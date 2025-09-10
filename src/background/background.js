// background.js - Service Worker for Chrome Extension

// Handle installation
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('AI Content Extractor installed successfully');
        
        // Set default options
        chrome.storage.sync.set({
            includeImages: true,
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

async function extractSelection(selectedText, tab) {
    if (!selectedText) return;
    
    try {
        // Format the selected text
        const formatted = formatForAI(selectedText, tab.url, tab.title);
        
        // Copy to clipboard and wait for completion
        await copyToClipboard(formatted);
        
        // Show success notification only after successful copy
        showNotification('Text Extracted', 'Selected text has been formatted and copied to clipboard');
    } catch (error) {
        console.error('Failed to extract selection:', error);
        showNotification('Extraction Failed', 'Failed to copy text to clipboard. Please try again.');
    }
}

async function extractFullPage(tab) {
    // Send message to content script to extract full page
    chrome.tabs.sendMessage(tab.id, {
        action: 'extractContent',
        options: {
            includeImages: true,
            includeLinks: true,
            markdownFormat: true
        }
    }, async (response) => {
        if (chrome.runtime.lastError) {
            showNotification('Extraction Failed', chrome.runtime.lastError.message);
            return;
        }
        
        if (response && response.success) {
            try {
                await copyToClipboard(response.content);
                showNotification('Page Extracted', 'Page content has been extracted and copied to clipboard');
            } catch (error) {
                console.error('Failed to copy page content:', error);
                showNotification('Copy Failed', 'Content extracted but failed to copy to clipboard');
            }
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
        // Check if offscreen document already exists
        const existingContexts = await chrome.runtime.getContexts({
            contextTypes: ['OFFSCREEN_DOCUMENT'],
            documentUrls: [chrome.runtime.getURL('offscreen/offscreen.html')]
        });
        
        if (!existingContexts.length) {
            // Create offscreen document
            await chrome.offscreen.createDocument({
                url: 'offscreen/offscreen.html',
                reasons: ['CLIPBOARD'],
                justification: 'Copy extracted content to clipboard'
            });
            
            // Wait a bit for the document to be ready
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Send message to offscreen document via a Promise wrapper
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
                action: 'copyToClipboard',
                text: text
            }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('Message error:', chrome.runtime.lastError);
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                
                if (response?.success) {
                    resolve(true);
                } else {
                    reject(new Error(response?.error || 'Failed to copy to clipboard'));
                }
            });
        });
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        throw error; // Re-throw to handle in calling function
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
    
    // Removed redundant clipboard handler - this is handled by offscreen document
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