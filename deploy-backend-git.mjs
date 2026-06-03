#!/usr/bin/env node
/**
 * deploy-backend-git.mjs
 * Automates SWS Backend Git repository creation, file upload, and Vercel Git-integrated deployment.
 */
import { readFileSync } from "fs";
import { join } from "path";
import dotenv from "dotenv";

dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (!GITHUB_TOKEN) {
  console.error("❌ GITHUB_TOKEN environment variable is missing!");
  process.exit(1);
}
const GITHUB_OWNER = "ZETIC7Z";
const GITHUB_REPO = "sws-backend";

const VERCEL_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const VERCEL_PROJECT = "sws-member-backend";

const GITHUB_BASE = "https://api.github.com";
const VERCEL_BASE = "https://api.vercel.com";

// Helper for GitHub API requests
async function githubApi(method, path, body) {
  const res = await fetch(`${GITHUB_BASE}${path}`, {
    method,
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      "User-Agent": "SWS-Deploy-Script"
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  return { status: res.status, data };
}

// Helper for Vercel API requests
async function vercelApi(method, path, body) {
  const res = await fetch(`${VERCEL_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  return { status: res.status, data };
}

async function run() {
  console.log("\n🚀 Starting SWS Backend Git & Vercel Auto-Deployment Prep...\n");

  let repoId;

  // ==========================================
  // Step 1: Create GitHub Repository
  // ==========================================
  console.log("1. Creating GitHub repository 'sws-backend'...");
  const { status: ghStatus, data: ghData } = await githubApi("POST", "/user/repos", {
    name: GITHUB_REPO,
    description: "SWS Member ID System - Backend API Server",
    private: false,
    auto_init: false,
  });

  if (ghStatus === 201) {
    console.log(`   ✅ GitHub Repo created: ${ghData.html_url}`);
    repoId = ghData.id;
  } else if (ghStatus === 422) {
    console.log("   ℹ️  GitHub Repo already exists, continuing...");
    // Fetch repo details to get the numeric ID
    const { status: getRepoStatus, data: getRepoData } = await githubApi("GET", `/repos/${GITHUB_OWNER}/${GITHUB_REPO}`);
    if (getRepoStatus === 200) {
      repoId = getRepoData.id;
      console.log(`   ℹ️  Resolved GitHub Repo ID: ${repoId}`);
    } else {
      console.error("   ❌ Failed to fetch GitHub repo details:", getRepoData);
      process.exit(1);
    }
  } else {
    console.error("   ❌ Failed to create GitHub repo:", ghData);
    process.exit(1);
  }

  // ==========================================
  // Step 2: Upload Files to GitHub Repo
  // ==========================================
  console.log("\n2. Uploading backend files to GitHub...");

  const backendVercelJson = {
    version: 2,
    builds: [
      { src: "server.mjs", use: "@vercel/node" }
    ],
    routes: [
      { src: "/(.*)", dest: "server.mjs" }
    ]
  };

  const gitignoreContent = `node_modules\n.env\n.env.local\n.DS_Store\n`;

  const filesToUpload = [
    {
      path: "server.mjs",
      content: readFileSync(join(process.cwd(), "server.mjs"), "utf8")
    },
    {
      path: "package.json",
      content: readFileSync(join(process.cwd(), "package.json"), "utf8")
    },
    {
      path: "vercel.json",
      content: JSON.stringify(backendVercelJson, null, 2)
    },
    {
      path: ".gitignore",
      content: gitignoreContent
    },
    {
      path: ".env.example",
      content: readFileSync(join(process.cwd(), ".env.example"), "utf8")
    }
  ];

  for (const file of filesToUpload) {
    const base64Content = Buffer.from(file.content).toString("base64");
    
    // Check if file exists to get its SHA (for update compatibility)
    const { data: existingFile } = await githubApi("GET", `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${file.path}?t=${Date.now()}`);
    const sha = existingFile?.sha;

    const { status: putStatus, data: putData } = await githubApi("PUT", `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${file.path}`, {
      message: sha ? `update: ${file.path}` : `initial commit: ${file.path}`,
      content: base64Content,
      ...(sha ? { sha } : {})
    });

    if (putStatus === 200 || putStatus === 201) {
      console.log(`   ✅ Uploaded: ${file.path}`);
    } else {
      console.error(`   ❌ Failed to upload: ${file.path}`, putData);
      process.exit(1);
    }
  }

  // ==========================================
  // Step 3: Create Vercel Project & Link Git Repo
  // ==========================================
  console.log("\n3. Configuring Vercel project & linking Git repo...");
  let { status: vpStatus, data: vpData } = await vercelApi("POST", "/v10/projects", {
    name: VERCEL_PROJECT,
    framework: null,
    gitRepository: {
      type: "github",
      repo: `${GITHUB_OWNER}/${GITHUB_REPO}`,
    }
  });

  let projectId;
  if (vpStatus === 200 || vpStatus === 201) {
    projectId = vpData.id;
    console.log(`   ✅ Vercel project created: ${vpData.name} (id: ${projectId})`);
  } else {
    // If project already exists, fetch it and link repository
    const { status: getStatus, data: getData } = await vercelApi("GET", `/v9/projects/${VERCEL_PROJECT}`);
    if (getStatus === 200) {
      projectId = getData.id;
      console.log(`   ℹ️  Using existing Vercel project: ${getData.name} (id: ${projectId})`);
      
      // Update link to repository
      await vercelApi("PATCH", `/v9/projects/${projectId}`, {
        gitRepository: {
          type: "github",
          repo: `${GITHUB_OWNER}/${GITHUB_REPO}`,
        }
      });
      console.log("   ✅ Repository link verified/updated");
    } else {
      console.error("   ❌ Cannot create or find Vercel project:", getData);
      process.exit(1);
    }
  }

  // ==========================================
  // Step 4: Configure Vercel Env Variables
  // ==========================================
  console.log("\n4. Setting environment variables on Vercel...");
  const envVars = {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    NODE_ENV: "production"
  };

  for (const [key, value] of Object.entries(envVars)) {
    if (!value) continue;
    
    // Check if env var already exists
    const { data: existingEnv } = await vercelApi("GET", `/v9/projects/${projectId}/env`);
    const existing = Array.isArray(existingEnv.envs) ? existingEnv.envs.find(e => e.key === key) : null;
    
    if (existing) {
      // Update existing env var
      const { status: updateStatus } = await vercelApi("PATCH", `/v9/projects/${projectId}/env/${existing.id}`, {
        value,
        target: ["production", "preview", "development"]
      });
      if (updateStatus === 200) console.log(`   ✅ Updated env var: ${key}`);
      else console.log(`   ⚠️  Failed to update env var: ${key}`);
    } else {
      // Add new env var
      const { status: createStatus } = await vercelApi("POST", `/v10/projects/${projectId}/env`, {
        key,
        value,
        type: "plain",
        target: ["production", "preview", "development"]
      });
      if (createStatus === 200 || createStatus === 201) console.log(`   ✅ Added env var: ${key}`);
      else console.log(`   ⚠️  Failed to add env var: ${key}`);
    }
  }

  // ==========================================
  // Step 5: Trigger Deployment on Vercel
  // ==========================================
  console.log("\n5. Triggering Vercel deployment from GitHub...");
  const { status: depStatus, data: depData } = await vercelApi("POST", "/v13/deployments", {
    name: VERCEL_PROJECT,
    project: projectId,
    gitSource: {
      type: "github",
      repoId: String(repoId),
      ref: "main"
    }
  });

  if (depStatus === 200 || depStatus === 201) {
    console.log(`\n🎉 Backend git deployment created successfully!`);
    console.log(`🔗 Deploy URL: https://${depData.url}`);
    console.log(`⏳ Status: ${depData.readyState || "building..."}`);
    console.log(`📋 Deploy ID: ${depData.id}`);
  } else {
    console.log("   ❌ Deploy trigger response:", depData);
  }

  console.log("\n✅ All done preparing and deploying backend!");
}

run().catch(console.error);
