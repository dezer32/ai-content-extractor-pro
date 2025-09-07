// background.js - Service Worker for Chrome Extension

// Handle installation
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('AI Content Extractor installed successfully');
        
        // Set default options
        chrome.storage.sync.set({
            includeImages: false,
            includeLinks: true,
            markdownFormat: true,
            autoExtract: false,
            maxContentLength: 50000
        });
        
        // Open welcome page (optional)
        // chrome.tabs.create({ url: 'welcome.html' });
    } else if (details.reason === 'update') {
        console.log('AI Content Extractor updated to version', chrome.runtime.getManifest().version);
    }
});

// Context menu for quick extraction
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'extract-selection',
        title: 'Extract selected text for AI',
        contexts: ['selection']
    });
    
    chrome.contextMenus.create({
        id: 'extract-page',
        title: 'Extract entire page for AI',
        contexts: ['page']
    });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'extract-selection') {
        extractSelection(info.selectionText, tab);
    } else if (info.menuItemId === 'extract-page') {
        extractFullPage(tab);
    }
});

function extractSelection(selectedText, tab) {
    if (!selectedText) return;
    
    // Format the selected text
    const formatted = formatForAI(selectedText, tab.url, tab.title);
    
    // Copy to clipboard
    copyToClipboard(formatted);
    
    // Show notification
    showNotification('Text Extracted', 'Selected text has been formatted and copied to clipboard');
}

function extractFullPage(tab) {
    // Send message to content script to extract full page
    chrome.tabs.sendMessage(tab.id, {
        action: 'extractContent',
        options: {
            includeImages: false,
            includeLinks: true,
            markdownFormat: true
        }
    }, (response) => {
        if (chrome.runtime.lastError) {
            showNotification('Extraction Failed', chrome.runtime.lastError.message);
            return;
        }
        
        if (response && response.success) {
            copyToClipboard(response.content);
            showNotification('Page Extracted', 'Page content has been extracted and copied to clipboard');
        }
    });
}

function formatForAI(text, url, title) {
    let formatted = `# ${title}\n\n`;
    formatted += `**Source:** ${url}\n`;
    formatted += `**Extracted:** ${new Date().toLocaleString()}\n\n`;
    formatted += '---\n\n';
    formatted += text;
    
    return formatted;
}

async function copyToClipboard(text) {
    try {
        // Try using the Clipboard API
        await chrome.offscreen.createDocument({
            url: '../offscreen/offscreen.html',
            reasons: ['CLIPBOARD'],
            justification: 'Copy extracted content to clipboard'
        });
        
        await chrome.runtime.sendMessage({
            action: 'copyToClipboard',
            text: text
        });
        
        await chrome.offscreen.closeDocument();
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
    }
}

function showNotification(title, message) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: '../assets/icons/icon-128.png',
        title: title,
        message: message,
        priority: 1
    });
}

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getTabInfo') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            sendResponse({ tab: tabs[0] });
        });
        return true;
    }
    
    if (request.action === 'copyToClipboard') {
        // This would be handled by the offscreen document
        navigator.clipboard.writeText(request.text).then(() => {
            sendResponse({ success: true });
        }).catch(err => {
            sendResponse({ success: false, error: err.message });
        });
        return true;
    }
});

// Keyboard shortcut handler
chrome.commands.onCommand.addListener((command) => {
    if (command === 'extract-content') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                extractFullPage(tabs[0]);
            }
        });
    }
});

// Handle tab updates for auto-extraction
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        chrome.storage.sync.get(['autoExtract'], (items) => {
            if (items.autoExtract) {
                // Auto-extract content when page loads
                chrome.tabs.sendMessage(tabId, {
                    action: 'extractContent',
                    options: {
                        includeImages: false,
                        includeLinks: true,
                        markdownFormat: true
                    }
                });
            }
        });
    }
});

// Clean up on extension unload
chrome.runtime.onSuspend.addListener(() => {
    console.log('AI Content Extractor suspended');
});