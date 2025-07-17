#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Получаем версию из аргументов командной строки
const version = process.argv[2];

if (!version) {
  console.error('Usage: node create-release.js <version>');
  console.error('Example: node create-release.js 1.0.3');
  process.exit(1);
}

// Проверяем формат версии
const versionRegex = /^\d+\.\d+\.\d+$/;
if (!versionRegex.test(version)) {
  console.error('Version must be in format X.Y.Z (e.g., 1.0.3)');
  process.exit(1);
}

const extensionDir = path.join(__dirname, '..', 'packages', 'extension');
const distDir = path.join(extensionDir, 'dist');
const manifestPath = path.join(extensionDir, 'src', 'manifest.json');

try {
  // Читаем текущую версию из manifest.json
  const manifestContent = fs.readFileSync(manifestPath, 'utf8');
  const manifest = JSON.parse(manifestContent);
  const currentVersion = manifest.version;
  
  console.log(`Current version: ${currentVersion}`);
  console.log(`New version: ${version}`);
  
  if (currentVersion === version) {
    console.log('⚠️  Version is already set to ' + version);
  }
  
  // Проверяем, что мы в git репозитории
  try {
    execSync('git status', { stdio: 'pipe' });
  } catch (error) {
    console.error('❌ Not in a git repository');
    process.exit(1);
  }
  
  // Проверяем, что нет несохраненных изменений
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
  if (gitStatus.trim()) {
    console.error('❌ You have uncommitted changes. Please commit or stash them first.');
    console.error('Uncommitted changes:');
    console.error(gitStatus);
    process.exit(1);
  }
  
  // Проверяем, что тег не существует
  try {
    execSync(`git rev-parse v${version}`, { stdio: 'pipe' });
    console.error(`❌ Tag v${version} already exists`);
    process.exit(1);
  } catch (error) {
    // Тег не существует, продолжаем
  }
  
  console.log('\n🚀 Creating release...');
  
  // Собираем расширение
  console.log('📦 Building extension...');
  execSync('npm run build', { 
    cwd: extensionDir, 
    stdio: 'inherit' 
  });
  
  // Создаем ZIP архив
  console.log('📦 Creating ZIP archive...');
  const zipName = `shiki-extension-v${version}.zip`;
  execSync(`cd ${distDir} && zip -r ../${zipName} . -x "*.map"`, { 
    stdio: 'inherit' 
  });
  
  // Создаем тег
  console.log('🏷️  Creating git tag...');
  execSync(`git tag v${version}`, { stdio: 'inherit' });
  
  // Пушим тег
  console.log('📤 Pushing tag...');
  execSync(`git push origin v${version}`, { stdio: 'inherit' });
  
  console.log('\n🎉 Release created successfully!');
  console.log(`\nNext steps:`);
  console.log(`1. Go to https://github.com/[your-repo]/releases`);
  console.log(`2. Edit the release v${version}`);
  console.log(`3. Upload the ZIP file: ${zipName}`);
  console.log(`4. Add release notes`);
  console.log(`5. Publish the release`);
  
} catch (error) {
  console.error('❌ Error creating release:', error.message);
  process.exit(1);
}