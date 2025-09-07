# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Content Extractor is a Chrome/Brave browser extension that extracts readable content from web pages and formats it for use in AI chat contexts. The extension uses Manifest V3 and provides smart content extraction with Markdown formatting capabilities.

## Development Commands

### Build & Package
```bash
# Build the extension and create a ZIP file for Chrome Web Store
npm run build

# Create ZIP without rebuilding (if dist/ already has files)
npm run zip

# Clean dist directory
npm run clean

# Increment version and build
npm run version
```

### Testing
```bash
# No automated tests configured yet
npm test

# Manual testing: Load unpacked extension from src/ directory in Chrome/Brave
# Test page available at: tools/test-page.html
```

### Icon Generation
Open `tools/icon-generator.html` in a browser to generate required icon sizes (16x16, 32x32, 48x48, 128x128).

## Architecture & Code Structure

### Extension Components

**Background Service Worker** (`src/background/background.js`)
- Handles extension lifecycle events (install, update)
- Manages context menus for quick extraction
- Coordinates message passing between components
- Uses offscreen document API for clipboard operations

**Content Script** (`src/content/content.js`)
- Core `ContentExtractor` class handles content extraction
- Multi-level content detection:
  1. Semantic tags (`<article>`, `<main>`)
  2. Class/ID analysis (content indicators)
  3. Statistical text density analysis
- Markdown conversion with structure preservation
- Filters unwanted elements (ads, navigation, widgets)

**Popup Interface** (`src/popup/popup.js` + `popup.html`)
- User controls for extraction options
- Real-time preview of extracted content
- Statistics display (word count, characters, reading time)
- Settings persistence via Chrome Storage API

**Offscreen Document** (`src/offscreen/offscreen.html`)
- Required for clipboard operations in Manifest V3
- Handles secure clipboard writing

### Key Classes and Patterns

- **ContentExtractor**: Main extraction logic with configurable options
  - `findMainContent()`: Intelligent content area detection
  - `cleanContent()`: Remove unwanted elements
  - `convertToMarkdown()`: HTML to Markdown conversion
  - `postProcess()`: Text cleanup and formatting

### Message Flow
1. User clicks extract → popup.js sends message to content script
2. Content script extracts and returns data
3. Background worker handles clipboard via offscreen document
4. Context menu actions bypass popup, direct to content script

## Important Conventions

- All user-facing strings in English (docs in Russian for local use)
- Chrome Extension Manifest V3 APIs only
- No external dependencies in runtime code
- Storage sync for settings persistence
- Defensive DOM manipulation to avoid breaking pages

## Chrome Web Store Submission

The extension includes store submission materials in `store/`:
- `description.txt`: Store listing description
- `screenshots/`: Required screenshots
- `promotional/`: Promotional images

Build creates `dist/ai-content-extractor-v{version}.zip` ready for upload.