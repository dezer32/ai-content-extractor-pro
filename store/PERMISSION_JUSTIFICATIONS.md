# Permission Justifications for Chrome Web Store

## Copy-paste готовые обоснования для каждого разрешения:

### 1. activeTab
```
This permission is essential for the core functionality of extracting content from the currently active webpage. When the user clicks the extension icon or uses the keyboard shortcut, we need to read the DOM content of the active tab to identify and extract the main article text. Without this permission, the extension cannot access the webpage content that the user wants to extract. This permission is only activated when the user explicitly interacts with the extension, ensuring user control over when content is accessed.
```

### 2. clipboardWrite
```
This permission is required to copy the extracted and formatted content to the user's clipboard, which is the primary output method of the extension. After extracting and cleaning the webpage content, users need to paste it into AI chat applications like ChatGPT or Claude. The clipboardWrite permission enables the one-click copy functionality that makes this process seamless. Without this permission, users would have to manually select and copy the text, defeating the purpose of the extension's convenience feature.
```

### 3. contextMenus
```
This permission allows the extension to add options to the browser's right-click context menu, providing users with quick access to extraction features. Users can select specific text on a webpage and right-click to extract only that selection, or right-click anywhere to extract the entire page. This improves user experience by offering multiple ways to interact with the extension beyond just the toolbar icon. The context menu items are clearly labeled and only appear when relevant, giving users additional control over content extraction.
```

### 4. notifications
```
This permission is used to show brief status notifications to inform users when content extraction is complete or if an error occurs. These notifications provide important feedback, especially when using keyboard shortcuts or context menu options where the popup interface isn't visible. For example, we notify users when content has been successfully copied to clipboard or if extraction failed on a particular page. Notifications are non-intrusive, temporary, and only shown in response to user actions, never for marketing or unsolicited messages.
```

### 5. offscreen
```
This permission is required for Manifest V3 compliance to perform clipboard operations in a secure manner. Chrome's Manifest V3 requires clipboard operations to be performed in an offscreen document rather than in the background service worker. This permission allows us to create a temporary, invisible document solely for the purpose of writing extracted content to the clipboard. The offscreen document is created only when needed for clipboard operations and is immediately closed afterward, ensuring minimal resource usage and maintaining security standards.
```

### 6. storage
```
This permission is necessary to save user preferences and settings locally within the browser. Users can customize extraction options such as whether to include images, preserve links, or use Markdown formatting. The storage permission allows these preferences to persist between browser sessions, so users don't have to reconfigure settings each time they use the extension. All data is stored locally on the user's device using Chrome's storage API, and no settings or preferences are ever transmitted to external servers.
```

### 7. host_permissions (<all_urls>)
```
This broad host permission is required because users need to extract content from any website they visit, and we cannot predict which sites they will use. The extension must be able to inject content scripts into any webpage to analyze the DOM structure and extract article content. This permission is only utilized when the user actively triggers extraction through the extension icon, keyboard shortcut, or context menu. Without this permission, we would need to maintain an impossibly long list of individual website permissions, or users would be unable to extract content from many sites they visit. The extension never automatically accesses any webpage without explicit user action.
```

---

## Дополнительные поля для Privacy Policy:

### Single Purpose Description
```
This extension extracts and formats readable content from web pages for use in AI chat applications by removing advertisements, navigation elements, and other clutter while preserving the main article text in a clean format.
```

### Data Usage
```
This extension does not collect, transmit, or store any user data. All content processing happens locally in the user's browser. Extracted text is only copied to the clipboard when the user explicitly requests it. User preferences are stored locally using Chrome's storage API and never leave the device.
```

### Remote Code
```
This extension does not use any remote code. All functionality is contained within the extension package and executes locally.
```

---

## На русском языке (если нужно):

### activeTab
```
Это разрешение необходимо для основной функции извлечения контента с текущей активной веб-страницы. Когда пользователь нажимает на иконку расширения, мы должны прочитать DOM-содержимое активной вкладки, чтобы извлечь основной текст статьи. Без этого разрешения расширение не может получить доступ к содержимому веб-страницы.
```

### clipboardWrite  
```
Это разрешение требуется для копирования извлеченного контента в буфер обмена пользователя. После извлечения и очистки содержимого веб-страницы пользователям необходимо вставить его в AI-чаты. Разрешение clipboardWrite обеспечивает функцию копирования в один клик.
```

### contextMenus
```
Это разрешение позволяет добавлять опции в контекстное меню браузера (правый клик). Пользователи могут выделить текст и извлечь только его, или извлечь всю страницу. Это улучшает пользовательский опыт, предлагая несколько способов взаимодействия с расширением.
```

### notifications
```
Это разрешение используется для показа кратких уведомлений о статусе, чтобы информировать пользователей о завершении извлечения контента или об ошибках. Уведомления предоставляют важную обратную связь, особенно при использовании горячих клавиш.
```

### offscreen
```
Это разрешение требуется для соответствия Manifest V3 для выполнения операций с буфером обмена безопасным способом. Chrome Manifest V3 требует, чтобы операции с буфером обмена выполнялись в offscreen документе, а не в фоновом service worker.
```

### storage
```
Это разрешение необходимо для сохранения пользовательских настроек локально в браузере. Пользователи могут настраивать параметры извлечения, и эти настройки сохраняются между сессиями браузера.
```

### host_permissions
```
Это разрешение требуется, потому что пользователи должны иметь возможность извлекать контент с любого веб-сайта. Расширение должно внедрять контент-скрипты на любую веб-страницу для анализа структуры DOM и извлечения контента статьи.
```