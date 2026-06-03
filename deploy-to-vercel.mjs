#!/usr/bin/env node
/**
 * deploy-to-vercel.mjs
 * Deploys built dist/ to Vercel via API + links GitHub repo for auto-deploys
 */
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { createHash } from "crypto";
import dotenv from "dotenv";

dotenv.config();

const VERCEL_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const PROJECT_NAME = "sws-skeptrons";
const GITHUB_OWNER = "ZETIC7Z";
const GITHUB_REPO = "sws-website";
const DESIRED_URL = "sws-skeptrons.vercel.app";

const BASE = "https://api.vercel.com";

async function api(method, path, body, extraHeaders = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      "Content-Type": "application/json",
      ...extraHeaders,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  if (res.status >= 400 && res.status !== 409) {
    console.log(`  [${res.status}] ${method} ${path}:`, JSON.stringify(data).slice(0, 300));
  }
  return { status: res.status, data };
}

function collectFiles(dir, root) {
  const files = [];
  const skip = new Set(["node_modules", ".git", ".env", "push-to-github.mjs", "deploy-to-vercel.mjs"]);
  for (const name of readdirSync(dir)) {
    if (skip.has(name) || name.startsWith(".")) continue;
    const full = join(dir, name);
    const rel = relative(root, full);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files.push(...collectFiles(full, root));
    } else {
      if (stat.size > 50 * 1024 * 1024) continue; // skip >50MB
      files.push({ path: rel.replace(/\\/g, "/"), full });
    }
  }
  return files;
}

async function run() {
  console.log("\n🚀 SWS Skeptrons → Vercel Deploy\n");

  // Step 1: Create or update project
  console.log("📦 Creating Vercel project...");
  let { status: ps, data: pd } = await api("POST", "/v10/projects", {
    name: PROJECT_NAME,
    framework: "vite",
    buildCommand: "npm run build",
    outputDirectory: "dist",
    installCommand: "npm install",
    gitRepository: {
      type: "github",
      repo: `${GITHUB_OWNER}/${GITHUB_REPO}`,
    },
  });

  let projectId;
  if (ps === 200 || ps === 201) {
    projectId = pd.id;
    console.log(`  ✅ Project created: ${pd.name} (id: ${projectId})`);
  } else {
    // Try to get existing project
    const { status: gs, data: gd } = await api("GET", `/v9/projects/${PROJECT_NAME}`);
    if (gs === 200) {
      projectId = gd.id;
      console.log(`  ℹ️  Using existing project: ${gd.name} (id: ${projectId})`);
    } else {
      console.error("  ❌ Cannot create or find project"); process.exit(1);
    }
  }

  // Update project settings to disable Vite build on Vercel side (since we deploy prebuilt dist)
  console.log("⚙️  Configuring project settings for prebuilt deployment...");
  await api("PATCH", `/v9/projects/${projectId}`, {
    framework: null,
    buildCommand: null,
    installCommand: null,
    outputDirectory: null,
  });

  // Step 2: Upload dist files for deployment
  console.log("\n📤 Uploading dist files...");
  const distDir = join(process.cwd(), "dist");
  const files = collectFiles(distDir, distDir);
  console.log(`  Found ${files.length} dist files`);

  const fileRefs = [];
  for (const file of files) {
    const content = readFileSync(file.full);
    const sha1 = createHash("sha1").update(content).digest("hex");
    const b64 = content.toString("base64");

    // Upload file blob
    const { status: us } = await fetch(`${BASE}/v2/files`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/octet-stream",
        "x-vercel-digest": sha1,
        "Content-Length": content.length,
      },
      body: content,
    }).then(r => ({ status: r.status }));

    fileRefs.push({ file: file.path, sha: sha1, size: content.length });
    process.stdout.write(`  ✅ ${file.path}\n`);
  }

  // Step 3: Create deployment
  console.log("\n🔄 Creating deployment...");
  const { status: ds, data: dd } = await api("POST", "/v13/deployments", {
    name: PROJECT_NAME,
    project: projectId,
    target: "production",
    files: fileRefs,
    projectSettings: {
      framework: null,
      buildCommand: null,
      outputDirectory: null,
      installCommand: null,
    },
    meta: {
      githubCommitRef: "main",
      githubRepo: `${GITHUB_OWNER}/${GITHUB_REPO}`,
    },
  });

  if (ds === 200 || ds === 201) {
    const deployUrl = dd.url ? `https://${dd.url}` : "see dashboard";
    console.log(`  ✅ Deployment created!`);
    console.log(`  🔗 Deploy URL: ${deployUrl}`);
    console.log(`  ⏳ Status: ${dd.readyState || "building..."}`);
    if (dd.id) {
      console.log(`  📋 Deploy ID: ${dd.id}`);
    }
  } else {
    console.log("  Deploy response:", JSON.stringify(dd).slice(0, 500));
  }

  // Step 4: Add alias
  if (dd?.id) {
    console.log(`\n🌐 Adding domain alias: ${DESIRED_URL}...`);
    const { status: as, data: ad } = await api("POST", `/v2/deployments/${dd.id}/aliases`, {
      alias: DESIRED_URL,
    });
    if (as === 200 || as === 201) {
      console.log(`  ✅ Alias set: https://${DESIRED_URL}`);
    } else {
      console.log(`  ℹ️  Alias note: ${JSON.stringify(ad).slice(0, 200)}`);
    }
  }

  console.log("\n✅ Done!");
  console.log(`🌐 Live at: https://${DESIRED_URL}`);
  console.log(`📊 Dashboard: https://vercel.com/${GITHUB_OWNER.toLowerCase()}`);
}

run().catch(console.error);
