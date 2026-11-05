const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const docsDir = path.join(rootDir, 'docs');

function patchHtmlFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace socket.io local path with CDN for static hosting
  content = content.replace(/<script\s+src=["']\/socket\.io\/socket\.io\.js["']><\/script>/g, 
    '<script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>');

  // Replace absolute assets/css/js paths with relative paths
  content = content.replace(/href=["']\/css\//g, 'href="./css/');
  content = content.replace(/src=["']\/js\//g, 'src="./js/');
  content = content.replace(/src=["']\/assets\//g, 'src="./assets/');
  content = content.replace(/href=["']\/assets\//g, 'href="./assets/');
  content = content.replace(/src=["']\/data\//g, 'src="./data/');

  // Replace absolute internal page links with relative .html links
  content = content.replace(/href=["']\/dashboard\?tab=([^"']+)["']/g, 'href="./dashboard.html?tab=$1"');
  content = content.replace(/href=["']\/dashboard["']/g, 'href="./dashboard.html"');
  content = content.replace(/href=["']\/login["']/g, 'href="./login.html"');
  content = content.replace(/href=["']\/student["']/g, 'href="./student.html"');
  content = content.replace(/href=["']\/faculty["']/g, 'href="./faculty.html"');
  content = content.replace(/href=["']\/admin["']/g, 'href="./admin.html"');
  content = content.replace(/href=["']\/campus["']/g, 'href="./campus.html"');
  content = content.replace(/href=["']\/certificate\.html\?code=([^"']+)["']/g, 'href="./certificate.html?code=$1"');
  content = content.replace(/href=["']\/chanakya["']/g, 'href="./chanakya.html"');
  content = content.replace(/href=["']\/nexeus["']/g, 'href="./nexeus.html"');
  content = content.replace(/href=["']\/["']/g, 'href="./index.html"');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[Patched] ${path.basename(filePath)}`);
}

// Process all HTML files in docs and public
[docsDir, path.join(rootDir, 'public')].forEach(dir => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  files.forEach(f => {
    patchHtmlFile(path.join(dir, f));
  });
});

console.log('✅ Successfully made all docs and public HTML files fully portable and relative!');
