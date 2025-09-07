#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class KeyManager {
    constructor() {
        this.keyDir = path.join(process.env.HOME, 'Documents', 'Chrome-Extensions-Keys');
        this.keyPath = path.join(this.keyDir, 'ai-content-extractor.pem');
        this.backupPath = path.join(this.keyDir, 'backup', 'ai-content-extractor-backup.pem');
    }

    async init() {
        // Create directories if they don't exist
        if (!fs.existsSync(this.keyDir)) {
            fs.mkdirSync(this.keyDir, { recursive: true });
            fs.mkdirSync(path.join(this.keyDir, 'backup'), { recursive: true });
            console.log('✅ Created key storage directory');
        }
    }

    checkKey() {
        if (fs.existsSync(this.keyPath)) {
            console.log('✅ Private key found at:', this.keyPath);
            
            // Check backup
            if (fs.existsSync(this.backupPath)) {
                console.log('✅ Backup key found');
            } else {
                console.log('⚠️  No backup found - creating one now...');
                this.backupKey();
            }
            
            return true;
        } else {
            console.log('❌ No private key found');
            return false;
        }
    }

    backupKey() {
        if (fs.existsSync(this.keyPath)) {
            fs.copyFileSync(this.keyPath, this.backupPath);
            console.log('✅ Backup created');
        }
    }

    async importKey(sourcePath) {
        if (!fs.existsSync(sourcePath)) {
            console.log('❌ Source file not found:', sourcePath);
            return;
        }

        // Backup existing if present
        if (fs.existsSync(this.keyPath)) {
            this.backupKey();
        }

        // Copy new key
        fs.copyFileSync(sourcePath, this.keyPath);
        console.log('✅ Key imported successfully');
        
        // Set secure permissions (Unix-like systems)
        if (process.platform !== 'win32') {
            fs.chmodSync(this.keyPath, 0o600);
            console.log('✅ Set secure permissions (600)');
        }
    }

    getKeyInfo() {
        if (!fs.existsSync(this.keyPath)) {
            console.log('❌ No key to analyze');
            return;
        }

        const keyContent = fs.readFileSync(this.keyPath, 'utf8');
        const keySize = keyContent.length;
        
        console.log('\n📊 Key Information:');
        console.log('   Location:', this.keyPath);
        console.log('   Size:', keySize, 'bytes');
        console.log('   Backup:', fs.existsSync(this.backupPath) ? '✅' : '❌');
        
        // Security check
        if (process.platform !== 'win32') {
            const stats = fs.statSync(this.keyPath);
            const mode = (stats.mode & parseInt('777', 8)).toString(8);
            console.log('   Permissions:', mode);
            
            if (mode !== '600') {
                console.log('   ⚠️  Warning: Key permissions should be 600');
            }
        }
    }

    async menu() {
        console.log('\n🔑 Chrome Extension Key Manager\n');
        console.log('1. Check if key exists');
        console.log('2. Import key from .crx packaging');
        console.log('3. Backup current key');
        console.log('4. Show key information');
        console.log('5. Setup instructions');
        console.log('0. Exit\n');

        rl.question('Choose an option: ', async (answer) => {
            console.log();
            
            switch(answer) {
                case '1':
                    this.checkKey();
                    break;
                    
                case '2':
                    rl.question('Enter path to .pem file: ', (pemPath) => {
                        this.importKey(pemPath.trim());
                        this.menu();
                    });
                    return;
                    
                case '3':
                    this.backupKey();
                    break;
                    
                case '4':
                    this.getKeyInfo();
                    break;
                    
                case '5':
                    this.showInstructions();
                    break;
                    
                case '0':
                    console.log('Goodbye! 👋');
                    rl.close();
                    return;
                    
                default:
                    console.log('Invalid option');
            }
            
            this.menu();
        });
    }

    showInstructions() {
        console.log(`
📚 INSTRUCTIONS:

1. FIRST TIME - Generate a key:
   a) Load extension in Chrome (chrome://extensions/)
   b) Click "Pack extension"
   c) Select src/ folder, leave key field empty
   d) Chrome creates extension.pem
   e) Run option 2 to import it here

2. UPDATES - Use existing key:
   a) Increment version in manifest.json
   b) Pack extension with your saved .pem file
   c) Upload new .crx or .zip to Chrome Web Store

3. CHROME WEB STORE:
   - You DON'T need the .pem file
   - Google manages keys automatically
   - Just upload the .zip file

4. SECURITY RULES:
   ⚠️  NEVER commit .pem to Git
   ⚠️  NEVER share your private key
   ✅  Always keep backups
   ✅  Store separately from code
        `);
    }
}

// Run the manager
const manager = new KeyManager();
manager.init().then(() => {
    manager.menu();
});