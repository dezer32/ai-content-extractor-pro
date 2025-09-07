# Private Key для Chrome Extension

## Что такое Private Key?

Private key (.pem файл) - это криптографический ключ, который:
- Генерирует уникальный ID вашего расширения
- Позволяет обновлять расширение, сохраняя тот же ID
- Необходим для распространения расширения вне Chrome Web Store

## Способы получения Private Key

### Способ 1: Автоматическая генерация Chrome (Рекомендуется)

1. **Загрузите расширение в режиме разработчика:**
   ```
   1. Откройте chrome://extensions/
   2. Включите "Developer mode"
   3. Нажмите "Load unpacked"
   4. Выберите папку src/
   ```

2. **Упакуйте расширение:**
   ```
   1. На странице chrome://extensions/
   2. Нажмите "Pack extension"
   3. В "Extension root directory" укажите путь к src/
   4. Оставьте "Private key file" пустым (для первой упаковки)
   5. Нажмите "Pack Extension"
   ```

3. **Результат:**
   - Chrome создаст два файла:
     - `extension.crx` - упакованное расширение
     - `extension.pem` - ваш private key (СОХРАНИТЕ ЕГО!)

### Способ 2: Через Chrome Web Store (Автоматически)

Когда вы публикуете в Chrome Web Store:
1. Google автоматически управляет ключами
2. Вам НЕ нужен private key
3. ID расширения генерируется автоматически
4. При обновлениях ID сохраняется

### Способ 3: Генерация через OpenSSL (Продвинутый)

```bash
# Генерация нового ключа
openssl genrsa -out key.pem 2048

# Конвертация в формат Chrome (если нужно)
openssl pkcs8 -topk8 -nocrypt -in key.pem -out chrome_key.pem
```

## Где хранить Private Key

### ⚠️ ВАЖНО: Безопасность

```
НИКОГДА не делайте это:
❌ Не коммитьте .pem файл в Git
❌ Не делитесь ключом публично
❌ Не храните в папке расширения

ВСЕГДА делайте это:
✅ Храните отдельно от кода
✅ Делайте резервные копии
✅ Используйте менеджер паролей
✅ Добавьте *.pem в .gitignore
```

### Рекомендуемая структура хранения:

```
~/Documents/
├── Chrome-Extensions-Keys/      # Отдельная папка для ключей
│   ├── ai-content-extractor.pem # Ваш private key
│   └── backup/                  # Резервные копии
│       └── ai-content-extractor-backup.pem
│
└── Claude/ai-content-extractor-pro/  # Код расширения
    └── (без .pem файлов!)
```

## Использование Private Key

### При локальной разработке:

```bash
# Упаковка с существующим ключом
1. chrome://extensions/ → "Pack extension"
2. Extension root directory: /path/to/src/
3. Private key file: /path/to/your-key.pem
4. Click "Pack Extension"
```

### При обновлении расширения:

```javascript
// manifest.json
{
  "version": "1.0.1",  // Увеличьте версию
  // ... остальные настройки
}
```

Затем переупакуйте с тем же .pem файлом.

## Extension ID

ID расширения генерируется из public key (который создается из private key):

```
Private Key (.pem) → Public Key → Extension ID (32 символа)
```

Пример ID: `abcdefghijklmnopqrstuvwxyzabcdef`

### Как узнать ID вашего расширения:

1. **Из загруженного расширения:**
   - chrome://extensions/
   - Найдите ваше расширение
   - ID отображается под названием

2. **Из .pem файла программно:**
   ```javascript
   // Требует Node.js скрипт для вычисления
   // ID = первые 32 символа SHA256 хеша public key
   ```

## Скрипт для безопасного управления ключами

Создайте файл `tools/key-manager.js`:

```javascript
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
```

## Для Chrome Web Store публикации

### Вам НЕ нужен private key для Web Store!

Chrome Web Store автоматически:
1. Генерирует ключи
2. Подписывает расширение
3. Назначает постоянный ID
4. Управляет обновлениями

### Процесс публикации:

```bash
# 1. Создайте ZIP архив (без .pem!)
cd /Users/vladislav_k/Documents/Claude/ai-content-extractor-pro
npm run build

# 2. Загрузите ZIP в Developer Dashboard
# 3. Google сам всё подпишет
```

## Когда нужен Private Key?

| Сценарий | Нужен .pem? | Почему |
|----------|-------------|---------|
| Chrome Web Store | ❌ Нет | Google управляет ключами |
| Корпоративное распространение | ✅ Да | Для подписи .crx файлов |
| Тестирование обновлений локально | ✅ Да | Сохранение ID при обновлениях |
| Приватное распространение | ✅ Да | Для создания .crx файлов |
| Разработка | ❌ Нет | Можно загружать unpacked |

## Troubleshooting

### "Failed to load extension"
- Проверьте, что .pem файл не повреждён
- Убедитесь, что используете правильный ключ

### "Invalid private key"
- Ключ может быть в неправильном формате
- Попробуйте перегенерировать

### "Extension ID changed"
- Вы использовали другой ключ
- Восстановите оригинальный .pem файл

## Best Practices

1. **Для Chrome Web Store:**
   - Просто загружайте ZIP
   - Не беспокойтесь о ключах

2. **Для корпоративного использования:**
   - Генерируйте один раз
   - Храните в безопасном месте
   - Делайте резервные копии

3. **Для разработки:**
   - Используйте "Load unpacked"
   - Ключи не требуются

## Заключение

Для публикации в Chrome Web Store вам НЕ нужен private key - просто загрузите ZIP архив с кодом расширения, и Google сделает всё остальное автоматически!