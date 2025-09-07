// content.js - Content extraction script

class ContentExtractor {
    constructor() {
        this.unwantedTags = [
            'script', 'style', 'noscript', 'iframe', 'object', 'embed', 
            'applet', 'meta', 'link', 'comment', 'nav', 'header', 'footer',
            'aside', 'form', 'button', 'input', 'select', 'textarea'
        ];
        
        this.unwantedClasses = [
            'nav', 'navigation', 'menu', 'header', 'footer', 'sidebar',
            'widget', 'advertisement', 'ad', 'ads', 'social', 'share',
            'comment', 'comments', 'related', 'popup', 'modal', 'banner',
            'cookie', 'newsletter', 'subscribe', 'promo'
        ];
        
        this.contentIndicators = [
            'article', 'content', 'main', 'post', 'text', 'body',
            'entry', 'story', 'narrative', 'description', 'summary'
        ];
    }
    
    extract(options = {}) {
        try {
            // Try to find main content area
            let contentElement = this.findMainContent();
            
            if (!contentElement) {
                // Fallback to body if no main content found
                contentElement = document.body;
            }
            
            // Clone the content to avoid modifying the original page
            const clonedContent = contentElement.cloneNode(true);
            
            // Clean the content
            this.cleanContent(clonedContent);
            
            // Extract text based on options
            let extractedText = '';
            if (options.markdownFormat) {
                extractedText = this.convertToMarkdown(clonedContent, options);
            } else {
                extractedText = this.extractText(clonedContent, options);
            }
            
            // Post-process the text
            extractedText = this.postProcess(extractedText);
            
            return extractedText;
        } catch (error) {
            console.error('Content extraction error:', error);
            return 'Error extracting content: ' + error.message;
        }
    }
    
    findMainContent() {
        // Priority 1: Look for article tag
        const article = document.querySelector('article');
        if (article) return article;
        
        // Priority 2: Look for main tag
        const main = document.querySelector('main');
        if (main) return main;
        
        // Priority 3: Look for role="main"
        const roleMain = document.querySelector('[role="main"]');
        if (roleMain) return roleMain;
        
        // Priority 4: Look for content indicators in class or id
        for (const indicator of this.contentIndicators) {
            const byId = document.getElementById(indicator);
            if (byId) return byId;
            
            const byClass = document.querySelector(`.${indicator}`);
            if (byClass) return byClass;
            
            // Look for partial matches
            const partialMatch = document.querySelector(
                `[class*="${indicator}"], [id*="${indicator}"]`
            );
            if (partialMatch && this.isLikelyContent(partialMatch)) {
                return partialMatch;
            }
        }
        
        // Priority 5: Find the element with the most text content
        return this.findElementWithMostText();
    }
    
    findElementWithMostText() {
        let maxTextLength = 0;
        let bestElement = null;
        
        const candidates = document.querySelectorAll('div, section, article, main');
        
        candidates.forEach(element => {
            // Skip if it's a navigation or unwanted element
            if (this.isUnwantedElement(element)) return;
            
            const textLength = this.getTextLength(element);
            const linkDensity = this.getLinkDensity(element);
            
            // Prefer elements with more text and lower link density
            const score = textLength * (1 - linkDensity);
            
            if (score > maxTextLength) {
                maxTextLength = score;
                bestElement = element;
            }
        });
        
        return bestElement;
    }
    
    getTextLength(element) {
        const text = element.textContent || '';
        return text.replace(/\s+/g, ' ').trim().length;
    }
    
    getLinkDensity(element) {
        const textLength = this.getTextLength(element);
        if (textLength === 0) return 1;
        
        const linkText = Array.from(element.querySelectorAll('a'))
            .reduce((sum, link) => sum + (link.textContent || '').length, 0);
        
        return Math.min(linkText / textLength, 1);
    }
    
    isLikelyContent(element) {
        const text = element.textContent || '';
        const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
        
        // Content should have at least 100 words
        return wordCount > 100;
    }
    
    isUnwantedElement(element) {
        const classNames = (element.className || '').toLowerCase();
        const id = (element.id || '').toLowerCase();
        
        for (const unwanted of this.unwantedClasses) {
            if (classNames.includes(unwanted) || id.includes(unwanted)) {
                return true;
            }
        }
        
        return false;
    }
    
    cleanContent(element) {
        // Remove unwanted tags
        this.unwantedTags.forEach(tag => {
            const elements = element.querySelectorAll(tag);
            elements.forEach(el => el.remove());
        });
        
        // Remove elements with unwanted classes
        this.unwantedClasses.forEach(className => {
            const elements = element.querySelectorAll(
                `[class*="${className}"], [id*="${className}"]`
            );
            elements.forEach(el => {
                if (this.isUnwantedElement(el)) {
                    el.remove();
                }
            });
        });
        
        // Remove hidden elements
        const hidden = element.querySelectorAll('[style*="display:none"], [style*="display: none"], [hidden]');
        hidden.forEach(el => el.remove());
        
        // Remove empty elements
        this.removeEmptyElements(element);
    }
    
    removeEmptyElements(element) {
        const allElements = element.querySelectorAll('*');
        allElements.forEach(el => {
            if (!el.textContent.trim() && !el.querySelector('img')) {
                el.remove();
            }
        });
    }
    
    convertToMarkdown(element, options) {
        let markdown = '';
        
        // Get page title
        const title = document.title;
        if (title) {
            markdown += `# ${title}\n\n`;
        }
        
        // Get page URL
        markdown += `**URL:** ${window.location.href}\n\n`;
        
        // Add extraction date
        markdown += `**Extracted:** ${new Date().toLocaleString()}\n\n`;
        
        markdown += '---\n\n';
        
        // Convert content to markdown
        markdown += this.nodeToMarkdown(element, options);
        
        return markdown;
    }
    
    nodeToMarkdown(node, options, listLevel = 0) {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent.replace(/\s+/g, ' ');
        }
        
        if (node.nodeType !== Node.ELEMENT_NODE) {
            return '';
        }
        
        let markdown = '';
        const tagName = node.tagName.toLowerCase();
        
        switch (tagName) {
            case 'h1':
                markdown += `\n# ${this.getTextContent(node)}\n\n`;
                break;
            case 'h2':
                markdown += `\n## ${this.getTextContent(node)}\n\n`;
                break;
            case 'h3':
                markdown += `\n### ${this.getTextContent(node)}\n\n`;
                break;
            case 'h4':
                markdown += `\n#### ${this.getTextContent(node)}\n\n`;
                break;
            case 'h5':
                markdown += `\n##### ${this.getTextContent(node)}\n\n`;
                break;
            case 'h6':
                markdown += `\n###### ${this.getTextContent(node)}\n\n`;
                break;
            case 'p':
                const paragraphContent = this.processChildren(node, options, listLevel);
                if (paragraphContent.trim()) {
                    markdown += `${paragraphContent}\n\n`;
                }
                break;
            case 'br':
                markdown += '\n';
                break;
            case 'strong':
            case 'b':
                markdown += `**${this.getTextContent(node)}**`;
                break;
            case 'em':
            case 'i':
                markdown += `*${this.getTextContent(node)}*`;
                break;
            case 'code':
                markdown += `\`${this.getTextContent(node)}\``;
                break;
            case 'pre':
                markdown += `\n\`\`\`\n${this.getTextContent(node)}\n\`\`\`\n\n`;
                break;
            case 'blockquote':
                const quoteContent = this.processChildren(node, options, listLevel);
                if (quoteContent) {
                    markdown += quoteContent.split('\n')
                        .map(line => `> ${line}`)
                        .join('\n') + '\n\n';
                }
                break;
            case 'ul':
                markdown += this.processList(node, options, false, listLevel) + '\n';
                break;
            case 'ol':
                markdown += this.processList(node, options, true, listLevel) + '\n';
                break;
            case 'li':
                // Handled in processList
                break;
            case 'a':
                if (options.includeLinks) {
                    const href = node.getAttribute('href');
                    const text = this.getTextContent(node);
                    if (href && text) {
                        markdown += `[${text}](${this.resolveUrl(href)})`;
                    } else {
                        markdown += text;
                    }
                } else {
                    markdown += this.getTextContent(node);
                }
                break;
            case 'img':
                if (options.includeImages) {
                    const src = node.getAttribute('src');
                    const alt = node.getAttribute('alt') || 'Image';
                    if (src) {
                        markdown += `![${alt}](${this.resolveUrl(src)})`;
                    }
                }
                break;
            case 'table':
                markdown += this.tableToMarkdown(node, options) + '\n\n';
                break;
            default:
                markdown += this.processChildren(node, options, listLevel);
        }
        
        return markdown;
    }
    
    processList(node, options, ordered, level) {
        let markdown = '';
        const items = node.querySelectorAll(':scope > li');
        const indent = '  '.repeat(level);
        
        items.forEach((item, index) => {
            const marker = ordered ? `${index + 1}.` : '-';
            const content = this.processChildren(item, options, level + 1).trim();
            markdown += `${indent}${marker} ${content}\n`;
        });
        
        return markdown;
    }
    
    tableToMarkdown(table, options) {
        let markdown = '\n';
        const rows = table.querySelectorAll('tr');
        
        if (rows.length === 0) return '';
        
        // Process header
        const headerCells = rows[0].querySelectorAll('th, td');
        if (headerCells.length > 0) {
            markdown += '| ';
            headerCells.forEach(cell => {
                markdown += this.getTextContent(cell) + ' | ';
            });
            markdown += '\n|';
            headerCells.forEach(() => {
                markdown += ' --- |';
            });
            markdown += '\n';
        }
        
        // Process body rows
        for (let i = 1; i < rows.length; i++) {
            const cells = rows[i].querySelectorAll('td');
            if (cells.length > 0) {
                markdown += '| ';
                cells.forEach(cell => {
                    markdown += this.getTextContent(cell) + ' | ';
                });
                markdown += '\n';
            }
        }
        
        return markdown;
    }
    
    processChildren(node, options, listLevel) {
        let result = '';
        node.childNodes.forEach(child => {
            result += this.nodeToMarkdown(child, options, listLevel);
        });
        return result;
    }
    
    getTextContent(node) {
        return (node.textContent || '').replace(/\s+/g, ' ').trim();
    }
    
    resolveUrl(url) {
        try {
            return new URL(url, window.location.href).href;
        } catch {
            return url;
        }
    }
    
    extractText(element, options) {
        let text = '';
        
        // Add page info
        text += `Title: ${document.title}\n`;
        text += `URL: ${window.location.href}\n`;
        text += `Extracted: ${new Date().toLocaleString()}\n\n`;
        text += '---\n\n';
        
        // Extract text content
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
            {
                acceptNode: (node) => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.tagName === 'A' && options.includeLinks) {
                            return NodeFilter.FILTER_ACCEPT;
                        }
                        if (node.tagName === 'IMG' && options.includeImages) {
                            return NodeFilter.FILTER_ACCEPT;
                        }
                    }
                    return NodeFilter.FILTER_SKIP;
                }
            }
        );
        
        let node;
        while (node = walker.nextNode()) {
            if (node.nodeType === Node.TEXT_NODE) {
                text += node.textContent;
            } else if (node.tagName === 'A' && options.includeLinks) {
                const href = node.getAttribute('href');
                if (href) {
                    text += ` [${node.textContent}](${this.resolveUrl(href)}) `;
                }
            } else if (node.tagName === 'IMG' && options.includeImages) {
                const alt = node.getAttribute('alt');
                const src = node.getAttribute('src');
                if (src) {
                    text += ` [Image: ${alt || 'No description'}] `;
                }
            }
        }
        
        return text;
    }
    
    postProcess(text) {
        // Remove excessive whitespace
        text = text.replace(/\n{3,}/g, '\n\n');
        text = text.replace(/[ \t]+/g, ' ');
        text = text.replace(/^\s+|\s+$/gm, '');
        
        // Remove common artifacts
        text = text.replace(/\[?\s*Advertisement\s*\]?/gi, '');
        text = text.replace(/\[?\s*Skip to content\s*\]?/gi, '');
        
        // Ensure proper spacing after punctuation
        text = text.replace(/([.!?])([A-Z])/g, '$1 $2');
        
        return text.trim();
    }
}

// Message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractContent') {
        const extractor = new ContentExtractor();
        const content = extractor.extract(request.options);
        
        sendResponse({
            success: true,
            content: content
        });
    }
    
    return true; // Keep the message channel open for async response
});