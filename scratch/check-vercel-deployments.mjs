import dotenv from "dotenv";
dotenv.config();

const VERCEL_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const PROJECTS = ["sws-skeptrons", "sws-member-backend"];

async function run() {
  console.log("Checking Vercel deployments for SWS projects...\n");
  for (const project of PROJECTS) {
    const res = await fetch(`https://api.vercel.com/v6/deployments?projectId=${project}&limit=5`, {
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`
      }
    });
    console.log(`Project: ${project} (status: ${res.status})`);
    if (res.status === 200) {
      const data = await res.json();
      if (!data.deployments || data.deployments.length === 0) {
        console.log("  No deployments found.");
      } else {
        data.deployments.forEach((dep, idx) => {
          console.log(`  [${idx + 1}] ID: ${dep.uid}`);
          console.log(`      URL: https://${dep.url}`);
          console.log(`      Created: ${new Date(dep.created).toLocaleString()}`);
          console.log(`      State: ${dep.state}`);
          console.log(`      Creator: ${dep.creator?.username}`);
        });
      }
    } else {
      const text = await res.text();
      console.log(`  Error: ${text.slice(0, 500)}`);
    }
    console.log();
  }
}

run().catch(console.error);
