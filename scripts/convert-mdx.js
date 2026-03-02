const fs = require('fs');
const path = require('path');

const docsDir = path.join(process.cwd(), 'content/docs');

const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.mdx'));

for (const file of files) {
  const filePath = path.join(docsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace <Warning> to blockquote
  content = content.replace(/<Warning>([\s\S]*?)<\/Warning>/g, '> **Warning:** $1');
  
  // Replace <Steps>
  content = content.replace(/<Steps>/g, '');
  content = content.replace(/<\/Steps>/g, '');

  // Replace <Step title="something">
  content = content.replace(/<Step title="([^"]+)">/g, '### $1');
  content = content.replace(/<\/Step>/g, '');

  // Replace <Snippet>
  content = content.replace(/<Snippet file="([^"]+)" \/>/g, '> *Snippet: $1*');

  // Strip leading spaces from all lines so they aren't parsed as code blocks
  content = content.replace(/^[ \t]+/gm, '');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Processed ${file}`);
}
