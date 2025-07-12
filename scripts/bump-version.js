#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Получаем новую версию из аргументов командной строки
const newVersion = process.argv[2];

if (!newVersion) {
  console.error('Usage: node bump-version.js <version>');
  console.error('Example: node bump-version.js 1.0.3');
  process.exit(1);
}

// Проверяем формат версии
const versionRegex = /^\d+\.\d+\.\d+$/;
if (!versionRegex.test(newVersion)) {
  console.error('Version must be in format X.Y.Z (e.g., 1.0.3)');
  process.exit(1);
}

const srcDir = path.join(__dirname, '..', 'Chrome_extension', 'src');
const manifestPath = path.join(srcDir, 'manifest.json');
const packagePath = path.join(srcDir, 'package.json');

function updateFile(filePath, updater) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    const updatedData = updater(data);
    
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
    console.log(`✅ Updated ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`❌ Error updating ${path.basename(filePath)}:`, error.message);
    process.exit(1);
  }
}

// Обновляем manifest.json
updateFile(manifestPath, (manifest) => {
  manifest.version = newVersion;
  return manifest;
});

// Обновляем package.json
updateFile(packagePath, (pkg) => {
  pkg.version = newVersion;
  return pkg;
});

console.log(`\n🎉 Version bumped to ${newVersion}`);
console.log('\nNext steps:');
console.log('1. git add .');
console.log('2. git commit -m "Bump version to ' + newVersion + '"');
console.log('3. git tag v' + newVersion);
console.log('4. git push origin main --tags');