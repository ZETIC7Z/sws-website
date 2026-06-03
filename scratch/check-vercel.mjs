import dotenv from "dotenv";
dotenv.config();

const VERCEL_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

async function run() {
  const res = await fetch("https://api.vercel.com/v2/user", {
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`
    }
  });
  const status = res.status;
  const data = await res.json();
  console.log("Vercel Token Check Status:", status);
  if (status === 200) {
    console.log("Logged in Vercel user:", data.user?.username || data.user?.email);
  } else {
    console.log("Error details:", data);
  }
}

run().catch(console.error);
