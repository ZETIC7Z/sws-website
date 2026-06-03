import dotenv from "dotenv";
dotenv.config();

const VERCEL_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const PROJECT_NAME = "sws-skeptrons";

async function run() {
  console.log("Checking Vercel project domains and aliases...\n");
  const res = await fetch(`https://api.vercel.com/v9/projects/${PROJECT_NAME}/domains`, {
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`
    }
  });
  console.log(`Domains Status: ${res.status}`);
  if (res.status === 200) {
    const data = await res.json();
    data.domains.forEach(d => {
      console.log(`- Domain: ${d.name}`);
      console.log(`  Redirect: ${d.redirect || "None"}`);
      console.log(`  Verified: ${d.verified}`);
    });
  }
}

run().catch(console.error);
