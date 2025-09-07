# ✅ ГОТОВЫЕ ОБОСНОВАНИЯ ДЛЯ CHROME WEB STORE

Скопируйте эти тексты в соответствующие поля на вкладке "Меры по обеспечению конфиденциальности":

## 📋 Обоснования разрешений (копировать как есть):

### activeTab
```
This permission is essential for the core functionality of extracting content from the currently active webpage. When the user clicks the extension icon or uses the keyboard shortcut, we need to read the DOM content of the active tab to identify and extract the main article text. Without this permission, the extension cannot access the webpage content that the user wants to extract. This permission is only activated when the user explicitly interacts with the extension, ensuring user control over when content is accessed.
```

### clipboardWrite
```
This permission is required to copy the extracted and formatted content to the user's clipboard, which is the primary output method of the extension. After extracting and cleaning the webpage content, users need to paste it into AI chat applications like ChatGPT or Claude. The clipboardWrite permission enables the one-click copy functionality that makes this process seamless. Without this permission, users would have to manually select and copy the text, defeating the purpose of the extension's convenience feature.
```

### contextMenus
```
This permission allows the extension to add options to the browser's right-click context menu, providing users with quick access to extraction features. Users can select specific text on a webpage and right-click to extract only that selection, or right-click anywhere to extract the entire page. This improves user experience by offering multiple ways to interact with the extension beyond just the toolbar icon. The context menu items are clearly labeled and only appear when relevant, giving users additional control over content extraction.
```

### notifications
```
This permission is used to show brief status notifications to inform users when content extraction is complete or if an error occurs. These notifications provide important feedback, especially when using keyboard shortcuts or context menu options where the popup interface isn't visible. For example, we notify users when content has been successfully copied to clipboard or if extraction failed on a particular page. Notifications are non-intrusive, temporary, and only shown in response to user actions, never for marketing or unsolicited messages.
```

### offscreen
```
This permission is required for Manifest V3 compliance to perform clipboard operations in a secure manner. Chrome's Manifest V3 requires clipboard operations to be performed in an offscreen document rather than in the background service worker. This permission allows us to create a temporary, invisible document solely for the purpose of writing extracted content to the clipboard. The offscreen document is created only when needed for clipboard operations and is immediately closed afterward, ensuring minimal resource usage and maintaining security standards.
```

### storage
```
This permission is necessary to save user preferences and settings locally within the browser. Users can customize extraction options such as whether to include images, preserve links, or use Markdown formatting. The storage permission allows these preferences to persist between browser sessions, so users don't have to reconfigure settings each time they use the extension. All data is stored locally on the user's device using Chrome's storage API, and no settings or preferences are ever transmitted to external servers.
```

### host_permissions (<all_urls>)
```
This broad host permission is required because users need to extract content from any website they visit, and we cannot predict which sites they will use. The extension must be able to inject content scripts into any webpage to analyze the DOM structure and extract article content. This permission is only utilized when the user actively triggers extraction through the extension icon, keyboard shortcut, or context menu. Without this permission, we would need to maintain an impossibly long list of individual website permissions, or users would be unable to extract content from many sites they visit. The extension never automatically accesses any webpage without explicit user action.
```

---

## 🎯 Краткая версия (если есть ограничение по символам):

### activeTab
```
Required to read and extract content from the current webpage when user clicks the extension icon. Only activated on user interaction.
```

### clipboardWrite
```
Required to copy extracted content to clipboard so users can paste it into AI chat applications like ChatGPT or Claude.
```

### contextMenus
```
Adds right-click menu options for quick content extraction of selected text or entire page.
```

### notifications
```
Shows brief status messages when extraction completes or fails. Only triggered by user actions.
```

### offscreen
```
Required by Manifest V3 for secure clipboard operations. Creates temporary document for clipboard access.
```

### storage
```
Saves user preferences locally (include images, links, markdown format). No data sent to servers.
```

### host_permissions
```
Needed to extract content from any website user visits. Only activated when user clicks extension.
```

---

## 📝 Дополнительная информация:

### Single Purpose (Единственная цель)
```
This extension extracts and formats readable content from web pages for use in AI chat applications by removing advertisements, navigation elements, and other clutter while preserving the main article text in a clean format.
```

### Data Usage (Использование данных)
```
This extension does not collect, transmit, or store any user data. All content processing happens locally in the user's browser. Extracted text is only copied to the clipboard when the user explicitly requests it. User preferences are stored locally using Chrome's storage API and never leave the device.
```

---

## ⚠️ Важные моменты:

1. **Используйте полную версию** - она более подробная и убедительная
2. **Не изменяйте текст** - копируйте как есть
3. **Проверьте все поля** - должны быть заполнены все 7 разрешений
4. **Privacy Policy URL** - убедитесь, что ссылка на политику конфиденциальности работает

## ✅ После заполнения:

1. Нажмите "Save" внизу страницы
2. Проверьте, что все разрешения имеют зеленую галочку
3. Отправьте на проверку

Эти обоснования написаны с учетом требований Google и должны пройти проверку без проблем!