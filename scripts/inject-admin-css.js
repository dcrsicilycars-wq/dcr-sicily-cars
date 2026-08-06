const fs = require('fs')

const files = ['dist/admin/index.html', 'dist/admin/login.html']

for (const file of files) {
  if (!fs.existsSync(file)) continue
  let html = fs.readFileSync(file, 'utf8')
  if (html.includes('css/admin.css?v=3')) continue
  html = html.replace('</head>', '  <link rel="stylesheet" href="css/admin.css?v=3">\n</head>')
  fs.writeFileSync(file, html)
}
