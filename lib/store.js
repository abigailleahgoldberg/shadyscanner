const fs = require('fs');
const path = require('path');

const STORE_DIR = path.join(process.cwd(), '.scan-results');

function ensureDir() {
  if (!fs.existsSync(STORE_DIR)) {
    fs.mkdirSync(STORE_DIR, { recursive: true });
  }
}

function save(id, data) {
  ensureDir();
  fs.writeFileSync(path.join(STORE_DIR, `${id}.json`), JSON.stringify(data));
}

function get(id) {
  const filePath = path.join(STORE_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

module.exports = { save, get };
