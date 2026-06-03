#!/usr/bin/env node
/**
 * deploy-backend-to-vercel.mjs
 * Deploys server.mjs backend to Vercel via API
 */
import { readFileSync } from "fs";
import { join } from "path";
import { createHash } from "crypto";
import dotenv from "dotenv";

dotenv.config();

const VERCEL_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const PROJECT_NAME = "sws-member-backend";
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

async function run() {
  console.log("\n🚀 SWS Member Backend → Vercel Deploy\n");

  // Step 1: Create or update project
  console.log("📦 Creating Vercel project...");
  let { status: ps, data: pd } = await api("POST", "/v10/projects", {
    name: PROJECT_NAME,
    framework: null,
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

  // Step 2: Set Environment Variables
  console.log("\n⚙️  Configuring project environment variables...");
  const envVars = {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    NODE_ENV: "production"
  };

  for (const [key, value] of Object.entries(envVars)) {
    if (!value) {
      console.log(`  ⚠️  Skipping empty env var: ${key}`);
      continue;
    }
    // Check if env var already exists
    const { data: existingEnv } = await api("GET", `/v9/projects/${projectId}/env`);
    const existing = Array.isArray(existingEnv.envs) ? existingEnv.envs.find(e => e.key === key) : null;
    
    if (existing) {
      // Update
      const { status: us } = await api("PATCH", `/v9/projects/${projectId}/env/${existing.id}`, {
        value,
        target: ["production", "preview", "development"]
      });
      if (us === 200) console.log(`  ✅ Updated env var: ${key}`);
      else console.log(`  ⚠️  Failed to update env var: ${key}`);
    } else {
      // Create new
      const { status: cs } = await api("POST", `/v10/projects/${projectId}/env`, {
        key,
        value,
        type: "plain",
        target: ["production", "preview", "development"]
      });
      if (cs === 200 || cs === 201) console.log(`  ✅ Added env var: ${key}`);
      else console.log(`  ⚠️  Failed to add env var: ${key}`);
    }
  }

  // Step 3: Prepare backend files
  console.log("\n📁 Preparing backend files for upload...");
  const backendVercelJson = {
    version: 2,
    builds: [
      { src: "server.mjs", use: "@vercel/node" }
    ],
    routes: [
      { src: "/(.*)", dest: "server.mjs" }
    ]
  };

  const filesToUpload = [
    {
      path: "server.mjs",
      content: readFileSync(join(process.cwd(), "server.mjs"))
    },
    {
      path: "package.json",
      content: readFileSync(join(process.cwd(), "package.json"))
    },
    {
      path: "vercel.json",
      content: Buffer.from(JSON.stringify(backendVercelJson, null, 2))
    }
  ];

  const fileRefs = [];
  for (const file of filesToUpload) {
    const sha1 = createHash("sha1").update(file.content).digest("hex");

    console.log(`  Uploading ${file.path}...`);
    // Upload file blob
    const res = await fetch(`${BASE}/v2/files`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/octet-stream",
        "x-vercel-digest": sha1,
        "Content-Length": file.content.length.toString(),
      },
      body: file.content,
    });

    if (res.status === 200 || res.status === 201) {
      console.log(`    ✅ Uploaded ${file.path}`);
    } else {
      console.error(`    ❌ Failed to upload ${file.path}: [${res.status}]`);
    }

    fileRefs.push({ file: file.path, sha: sha1, size: file.content.length });
  }

  // Step 4: Create backend deployment
  console.log("\n🔄 Creating Vercel backend deployment...");
  const { status: ds, data: dd } = await api("POST", "/v13/deployments", {
    name: PROJECT_NAME,
    project: projectId,
    target: "production",
    files: fileRefs,
    projectSettings: {
      framework: null,
      buildCommand: null,
      outputDirectory: null,
      installCommand: "npm install",
    }
  });

  if (ds === 200 || ds === 201) {
    const deployUrl = dd.url ? `https://${dd.url}` : "see dashboard";
    console.log(`\n✅ Backend deployment created!`);
    console.log(`🔗 Deploy URL: ${deployUrl}`);
    console.log(`⏳ Status: ${dd.readyState || "building..."}`);
    console.log(`📋 Deploy ID: ${dd.id}`);
  } else {
    console.log("❌ Deploy response:", JSON.stringify(dd).slice(0, 500));
  }
}

run().catch(console.error);
