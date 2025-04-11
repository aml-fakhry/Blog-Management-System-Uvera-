const fs = require('fs');
const path = require('path');
const docsFolderTarget = path.join(__dirname, './dist/docs');
const docsFolderSrc = path.join(__dirname, './src/docs');
const docFileName = 'collection.yml';
if (!fs.existsSync(docsFolderTarget)) {
  fs.mkdirSync(docsFolderTarget);
}
fs.copyFileSync(path.join(docsFolderSrc, docFileName), path.join(docsFolderTarget, docFileName));
