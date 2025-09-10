// Handle clipboard operations in offscreen document
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'copyToClipboard') {
        handleCopyToClipboard(request.text)
            .then(() => {
                console.log('Text successfully copied to clipboard');
                sendResponse({ success: true });
            })
            .catch(err => {
                console.error('Failed to write to clipboard:', err);
                sendResponse({ success: false, error: err.message });
            });
        // Return true to indicate async response
        return true;
    }
});

async function handleCopyToClipboard(text) {
    // Try multiple methods to copy to clipboard
    
    // Method 1: Try using the Clipboard API with focus
    try {
        // Focus the document first
        document.body.focus();
        await navigator.clipboard.writeText(text);
        return;
    } catch (err) {
        console.log('Clipboard API failed, trying fallback method:', err.message);
    }
    
    // Method 2: Use execCommand as fallback
    try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.top = '0';
        textarea.style.left = '0';
        document.body.appendChild(textarea);
        
        textarea.select();
        textarea.setSelectionRange(0, text.length);
        
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        
        if (success) {
            return;
        } else {
            throw new Error('execCommand copy failed');
        }
    } catch (err) {
        throw new Error(`All clipboard methods failed: ${err.message}`);
    }
}

// Notify background that offscreen document is ready
console.log('Offscreen document loaded and ready');