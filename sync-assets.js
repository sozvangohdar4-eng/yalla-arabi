/**
 * Asset Synchronizer for Yalla Arabi Android APK
 * Copies web assets into android/app/src/main/assets/www/ for 100% offline fallback
 * and generates mipmap launcher icons.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const ASSETS_DIR = path.join(ROOT_DIR, 'android', 'app', 'src', 'main', 'assets', 'www');
const RES_DIR = path.join(ROOT_DIR, 'android', 'app', 'src', 'main', 'res');

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('--- 1. Syncing Web Assets into Android Assets Folder ---');

// Create destination directories
if (fs.existsSync(ASSETS_DIR)) {
  fs.rmSync(ASSETS_DIR, { recursive: true, force: true });
}
fs.mkdirSync(ASSETS_DIR, { recursive: true });

// Copy root files
const filesToCopy = [
  'index.html',
  'manifest.json',
  'sw.js',
  'app-config.json'
];

filesToCopy.forEach(file => {
  const src = path.join(ROOT_DIR, file);
  const dest = path.join(ASSETS_DIR, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✓ Copied ${file}`);
  }
});

// Copy directories
const dirsToCopy = ['js', 'css', 'icons'];
dirsToCopy.forEach(dir => {
  const src = path.join(ROOT_DIR, dir);
  const dest = path.join(ASSETS_DIR, dir);
  if (fs.existsSync(src)) {
    copyDirRecursive(src, dest);
    console.log(`✓ Copied directory ${dir}/`);
  }
});

console.log('\n--- 2. Setting up Android Mipmap App Icons ---');
const mipmapFolders = [
  'mipmap-mdpi',
  'mipmap-hdpi',
  'mipmap-xhdpi',
  'mipmap-xxhdpi',
  'mipmap-xxxhdpi'
];

const iconSrc192 = path.join(ROOT_DIR, 'icons', 'icon-192.png');
const iconSrc512 = path.join(ROOT_DIR, 'icons', 'icon-512.png');
const iconSource = fs.existsSync(iconSrc512) ? iconSrc512 : iconSrc192;

if (fs.existsSync(iconSource)) {
  mipmapFolders.forEach(folder => {
    const folderPath = path.join(RES_DIR, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    fs.copyFileSync(iconSource, path.join(folderPath, 'ic_launcher.png'));
    fs.copyFileSync(iconSource, path.join(folderPath, 'ic_launcher_round.png'));
    console.log(`✓ Generated icons in ${folder}`);
  });
}

console.log('\n============================================================');
console.log('ANDROID ASSETS SYNC COMPLETED SUCCESSFULLY! ✅');
console.log(`Embedded Bundle Location: ${ASSETS_DIR}`);
console.log('============================================================\n');
