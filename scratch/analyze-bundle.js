import fs from 'fs';
import path from 'path';

const assetsDir = '/home/zeticuz/Music/sws web/dist/assets';
const files = fs.readdirSync(assetsDir);

for (const file of files) {
  if (file.endsWith('.js')) {
    const filePath = path.join(assetsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Find anything that looks like a URL or has api/auth/signin or getApiUrl
    console.log(`Analyzing ${file}...`);
    
    // Check if localhost or vercel is in the file
    const hasLocalhost = content.includes('localhost');
    const hasVercel = content.includes('vercel');
    const hasBackend = content.includes('sws-member-backend');
    
    console.log(`  localhost: ${hasLocalhost}`);
    console.log(`  vercel: ${hasVercel}`);
    console.log(`  sws-member-backend: ${hasBackend}`);
    
    // Search for match of string literals with /api
    const regex = /"\/api\/[^"]+"|'\/api\/[^']+'/g;
    const matches = content.match(regex);
    if (matches) {
      console.log(`  Found API path matches:`, [...new Set(matches)].slice(0, 10));
    }
    
    // Let's find any occurrences of "http"
    const httpRegex = /https?:\/\/[^\s"'`]+/g;
    const httpMatches = content.match(httpRegex);
    if (httpMatches) {
      console.log(`  Found http matches:`, [...new Set(httpMatches)].slice(0, 10));
    }
  }
}
