import dotenv from 'dotenv';
dotenv.config();

const token = process.env.BLOB_READ_WRITE_TOKEN;
const deployId = "dpl_9A8f3VTaKT4J55A54p2zBEKpDi21";
const alias = "sws-skeptrons.vercel.app";

async function run() {
  console.log("Checking deployment status...");
  while (true) {
    const res = await fetch("https://api.vercel.com/v13/deployments/" + deployId, {
      headers: { Authorization: "Bearer " + token }
    });
    const data = await res.json();
    console.log("State:", data.readyState);
    if (data.readyState === "READY") {
      console.log("Ready! Setting alias...");
      const resAlias = await fetch("https://api.vercel.com/v2/deployments/" + deployId + "/aliases", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ alias })
      });
      const aliasData = await resAlias.json();
      console.log("Alias result:", aliasData);
      break;
    }
    if (data.readyState === "ERROR") {
      console.error("Deployment failed!");
      break;
    }
    await new Promise(r => setTimeout(r, 5000));
  }
}

run().catch(console.error);
