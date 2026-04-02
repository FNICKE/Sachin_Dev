const fs = require('fs');
const path = require('path');

const foldersToRemove = [
  path.join(__dirname, 'app', '(admin)'),
  path.join(__dirname, 'app', '(public)')
];

foldersToRemove.forEach(folder => {
  if (fs.existsSync(folder)) {
    console.log(`🗑️ Removing conflicting directory: ${folder}`);
    fs.rmSync(folder, { recursive: true, force: true });
  } else {
    console.log(`✅ Directory already removed: ${folder}`);
  }
});

console.log('🚀 Routing conflicts resolved! Please run "npm run dev" now.');
