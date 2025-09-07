// popup.js
let extractedContent = '';

document.addEventListener('DOMContentLoaded', function() {
    // Load saved options
    loadOptions();
    
    // Event listeners
    document.getElementById('extract-btn').addEventListener('click', extractContent);
    document.getElementById('copy-btn').addEventListener('click', copyContent);
    document.getElementById('clear-btn').addEventListener('click', clearContent);
    
    // Options listeners
    document.getElementById('include-images').addEventListener('change', saveOptions);
    document.getElementById('include-links').addEventListener('change', saveOptions);
    document.getElementById('markdown-format').addEventListener('change', saveOptions);
});

function loadOptions() {
    chrome.storage.sync.get({
        includeImages: false,
        includeLinks: true,
        markdownFormat: true
    }, function(items) {
        document.getElementById('include-images').checked = items.includeImages;
        document.getElementById('include-links').checked = items.includeLinks;
        document.getElementById('markdown-format').checked = items.markdownFormat;
    });
}

function saveOptions() {
    chrome.storage.sync.set({
        includeImages: document.getElementById('include-images').checked,
        includeLinks: document.getElementById('include-links').checked,
        markdownFormat: document.getElementById('markdown-format').checked
    });
}

async function extractContent() {
    showLoading(true);
    showStatus('', '');
    
    const options = {
        includeImages: document.getElementById('include-images').checked,
        includeLinks: document.getElementById('include-links').checked,
        markdownFormat: document.getElementById('markdown-format').checked
    };
    
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        // Send message to content script
        chrome.tabs.sendMessage(tab.id, { 
            action: 'extractContent',
            options: options
        }, function(response) {
            showLoading(false);
            
            if (chrome.runtime.lastError) {
                showStatus('Error: ' + chrome.runtime.lastError.message, 'error');
                return;
            }
            
            if (response && response.success) {
                extractedContent = response.content;
                updatePreview(response.content);
                updateStats(response.content);
                document.getElementById('copy-btn').disabled = false;
                showStatus('Content extracted successfully!', 'success');
            } else {
                showStatus('Failed to extract content', 'error');
            }
        });
    } catch (error) {
        showLoading(false);
        showStatus('Error: ' + error.message, 'error');
    }
}

function copyContent() {
    if (!extractedContent) return;
    
    // Create a textarea element to copy the content
    const textarea = document.createElement('textarea');
    textarea.value = extractedContent;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showStatus('Content copied to clipboard!', 'success');
        
        // Change button text temporarily
        const copyBtn = document.getElementById('copy-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    } catch (err) {
        showStatus('Failed to copy content', 'error');
    }
    
    document.body.removeChild(textarea);
}

function clearContent() {
    extractedContent = '';
    document.getElementById('content-preview').textContent = 'Click "Extract Content" to begin...';
    document.getElementById('copy-btn').disabled = true;
    updateStats('');
    showStatus('', '');
}

function updatePreview(content) {
    const preview = document.getElementById('content-preview');
    const maxLength = 500;
    
    if (content.length > maxLength) {
        preview.textContent = content.substring(0, maxLength) + '...';
    } else {
        preview.textContent = content;
    }
}

function updateStats(content) {
    // Word count
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    document.getElementById('word-count').textContent = formatNumber(words);
    
    // Character count
    const chars = content.length;
    document.getElementById('char-count').textContent = formatNumber(chars);
    
    // Reading time (assuming 200 words per minute)
    const readingTime = Math.ceil(words / 200);
    document.getElementById('reading-time').textContent = readingTime;
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

function showStatus(message, type) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = 'status';
    
    if (type) {
        status.classList.add(type);
    }
    
    if (message) {
        setTimeout(() => {
            status.className = 'status';
            status.textContent = '';
        }, 3000);
    }
}

function showLoading(show) {
    const loading = document.getElementById('loading');
    const preview = document.getElementById('content-preview');
    
    if (show) {
        loading.classList.add('active');
        preview.style.display = 'none';
    } else {
        loading.classList.remove('active');
        preview.style.display = 'block';
    }
}