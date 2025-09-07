# Структура папок для Chrome Web Store

```
ai-content-extractor/
│
├── src/                          # Исходный код расширения
│   ├── manifest.json            # Манифест расширения
│   ├── background/              # Фоновые скрипты
│   │   └── background.js
│   ├── content/                 # Контент-скрипты
│   │   └── content.js
│   ├── popup/                   # Интерфейс popup
│   │   ├── popup.html
│   │   ├── popup.js
│   │   └── popup.css
│   ├── offscreen/              # Offscreen документы
│   │   └── offscreen.html
│   ├── assets/                 # Ресурсы
│   │   ├── icons/              # Иконки расширения
│   │   │   ├── icon-16.png
│   │   │   ├── icon-32.png
│   │   │   ├── icon-48.png
│   │   │   └── icon-128.png
│   │   └── images/             # Другие изображения
│   └── lib/                    # Библиотеки (если есть)
│
├── store/                       # Материалы для Chrome Web Store
│   ├── screenshots/            # Скриншоты (1280x800 или 640x400)
│   │   ├── screenshot-1.png
│   │   ├── screenshot-2.png
│   │   └── screenshot-3.png
│   ├── promotional/            # Промо-материалы
│   │   ├── small-tile.png     # 440x280
│   │   ├── large-tile.png     # 920x680
│   │   └── marquee.png        # 1400x560
│   └── description.txt        # Описание для магазина
│
├── docs/                       # Документация
│   ├── README.md
│   ├── PRIVACY_POLICY.md     # Политика конфиденциальности (обязательно!)
│   ├── CHANGELOG.md           # История изменений
│   └── CONTRIBUTING.md       # Для open source
│
├── tools/                      # Инструменты разработки
│   ├── icon-generator.html
│   └── build.js               # Скрипт сборки (опционально)
│
├── dist/                       # Готовая сборка для публикации
│   └── ai-content-extractor.zip
│
├── .gitignore
├── LICENSE
└── package.json               # Для npm скриптов (опционально)
```

## Требования Chrome Web Store:

### Обязательные элементы:
- ✅ manifest.json с правильными permissions
- ✅ Иконки всех размеров (16, 32, 48, 128)
- ✅ Политика конфиденциальности
- ✅ Описание до 132 символов (краткое)
- ✅ Детальное описание

### Рекомендуемые элементы:
- 📸 Минимум 1 скриншот (1280x800 или 640x400)
- 🎨 Промо-изображения для витрины
- 🎥 Промо-видео на YouTube (опционально)
- 🌍 Локализация на разные языки