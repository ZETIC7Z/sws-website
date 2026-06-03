import fs from 'fs';

const file = '/home/zeticuz/Music/sws web/dist/assets/index-D6l-8Nv_.js';
const content = fs.readFileSync(file, 'utf8');

// Find function Gr
// Since it's minified, it might be Gr = ... or function Gr(...
// Let's search for "Gr=" or "Gr =" or "function Gr"
const pos = content.indexOf('Gr=');
if (pos !== -1) {
  console.log('Found "Gr=" at:', pos);
  console.log('Surrounding:', content.slice(Math.max(0, pos - 150), pos + 150));
} else {
  // Let's search for Gr in different ways
  console.log('Could not find "Gr=" directly.');
  // Let's find Gr(
  let p = -1;
  while ((p = content.indexOf('Gr(', p + 1)) !== -1) {
    console.log('Found Gr( at:', p);
    console.log('Surrounding:', content.slice(Math.max(0, p - 50), p + 150));
  }
}
