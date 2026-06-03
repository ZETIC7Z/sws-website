import fs from 'fs';

const file = '/home/zeticuz/Music/sws web/dist/assets/index-DhlHNEdw.js';
const content = fs.readFileSync(file, 'utf8');

const pos = content.indexOf('"/api/auth/signin"');
if (pos !== -1) {
  console.log('Found "/api/auth/signin" at position:', pos);
  
  // Let's find Gr/getApiUrl definition
  // Search for the word startsWith or localhost
  const localPos = content.indexOf('"localhost"');
  if (localPos !== -1) {
    console.log('Found "localhost" at:', localPos);
    console.log('Surrounding:', content.slice(localPos - 50, localPos + 250));
  }
}
