#!/usr/bin/env node

/**
 * Build script for AI Content Extractor
 * Creates a production-ready ZIP file for Chrome Web Store submission
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building AI Content Extractor for production...\n');

// Paths
const srcDir = path.join(__dirname, '..', 'src');
const distDir = path.join(__dirname, '..', 'dist');

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
    console.log('✅ Created dist directory');
}

// Clean dist directory
const existingFiles = fs.readdirSync(distDir);
existingFiles.forEach(file => {
    fs.rmSync(path.join(distDir, file), { recursive: true, force: true });
});
console.log('✅ Cleaned dist directory');

// Copy source files to dist
function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    
    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach(childItemName => {
            copyRecursiveSync(
                path.join(src, childItemName),
                path.join(dest, childItemName)
            );
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

// Copy all source files
copyRecursiveSync(srcDir, path.join(distDir, 'extension'));
console.log('✅ Copied source files');

// Read and validate manifest
const manifestPath = path.join(distDir, 'extension', 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Validate required fields
const requiredFields = ['name', 'version', 'manifest_version', 'description'];
const missingFields = requiredFields.filter(field => !manifest[field]);

if (missingFields.length > 0) {
    console.error('❌ Missing required fields in manifest.json:', missingFields.join(', '));
    process.exit(1);
}

console.log(`✅ Validated manifest.json (v${manifest.version})`);

// Check for icon files
const iconSizes = ['16', '32', '48', '128'];
const iconPath = path.join(distDir, 'extension', 'assets', 'icons');
let missingIcons = [];

iconSizes.forEach(size => {
    const iconFile = path.join(iconPath, `icon-${size}.png`);
    if (!fs.existsSync(iconFile)) {
        missingIcons.push(`icon-${size}.png`);
    }
});

if (missingIcons.length > 0) {
    console.warn('⚠️  Missing icon files:', missingIcons.join(', '));
    console.warn('   Please generate icons using tools/icon-generator.html');
}

// Create ZIP file
const zipName = `ai-content-extractor-v${manifest.version}.zip`;
const zipPath = path.join(distDir, zipName);

try {
    process.chdir(path.join(distDir, 'extension'));
    execSync(`zip -r ../${zipName} ./*`, { stdio: 'ignore' });
    console.log(`✅ Created ${zipName}`);
} catch (error) {
    console.error('❌ Failed to create ZIP file');
    console.error('   Make sure you have zip installed');
    process.exit(1);
}

// Calculate file size
const stats = fs.statSync(zipPath);
const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

console.log('\n📦 Build Complete!');
console.log(`   File: ${zipName}`);
console.log(`   Size: ${fileSizeInMB} MB`);
console.log(`   Location: ${zipPath}`);

// Check if size is within Chrome Web Store limits (10MB)
if (fileSizeInMB > 10) {
    console.warn('\n⚠️  Warning: Package size exceeds 10MB limit for Chrome Web Store');
}

console.log('\n📋 Next Steps:');
console.log('   1. Generate icons if not done: open tools/icon-generator.html');
console.log('   2. Test the extension locally');
console.log('   3. Upload to Chrome Web Store Developer Dashboard');
console.log('   4. Add screenshots and promotional images');
console.log('   5. Submit for review');

console.log('\n✨ Good luck with your submission!');