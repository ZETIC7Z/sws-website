import dotenv from 'dotenv';
dotenv.config();

const token = process.env.BLOB_READ_WRITE_TOKEN;
const backendProject = "sws-member-backend";
const frontendProject = "sws-skeptrons";
const base = "https://api.vercel.com";

async function getProjectEnv(projectId) {
  const res = await fetch(`${base}/v9/projects/${projectId}/env`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

async function run() {
  console.log("Fetching env for backend...");
  const backendEnv = await getProjectEnv(backendProject);
  console.log("Backend Envs:");
  if (backendEnv.envs) {
    backendEnv.envs.forEach(e => {
      console.log(`- ${e.key}: id=${e.id}, target=${JSON.stringify(e.target)}, type=${e.type}`);
    });
  } else {
    console.log(backendEnv);
  }

  console.log("\nFetching env for frontend...");
  const frontendEnv = await getProjectEnv(frontendProject);
  console.log("Frontend Envs:");
  if (frontendEnv.envs) {
    frontendEnv.envs.forEach(e => {
      console.log(`- ${e.key}: id=${e.id}, target=${JSON.stringify(e.target)}, type=${e.type}`);
    });
  } else {
    console.log(frontendEnv);
  }
}

run().catch(console.error);
