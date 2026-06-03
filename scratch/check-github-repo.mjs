import dotenv from "dotenv";
dotenv.config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = "ZETIC7Z";
const GITHUB_REPO = "sws-backend";

async function run() {
  console.log("Checking GitHub sws-backend repo...\n");
  const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/branches`, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "SWS-Check-Script"
    }
  });
  console.log("Branches Status:", res.status);
  const data = await res.json();
  console.log("Branches:", data);

  const res2 = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits`, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "SWS-Check-Script"
    }
  });
  console.log("\nCommits Status:", res2.status);
  const data2 = await res2.json();
  if (res2.status === 200) {
    data2.slice(0, 3).forEach(c => {
      console.log(`- Commit: ${c.sha.slice(0, 7)}: ${c.commit.message} (${c.commit.author.date})`);
    });
  } else {
    console.log("Commits Error:", data2);
  }
}

run().catch(console.error);
