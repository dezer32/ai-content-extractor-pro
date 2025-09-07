# Changelog

All notable changes to AI Content Extractor will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned Features
- Multiple language support
- Cloud sync for settings
- Custom extraction rules
- Batch extraction mode
- Export to different formats (PDF, DOCX)

## [1.0.0] - 2025-01-XX

### Added
- Initial release
- Smart content detection algorithm
- Automatic removal of ads, navigation, and clutter
- Markdown formatting support
- Plain text extraction option
- Context menu integration for quick extraction
- Keyboard shortcuts (Ctrl+Shift+E / Cmd+Shift+E)
- Real-time content statistics (words, characters, reading time)
- Content preview with syntax highlighting
- Customizable extraction options:
  - Include/exclude images
  - Include/exclude links
  - Markdown or plain text format
- Right-click context menu for selected text
- Clipboard integration
- Modern, responsive popup UI
- Privacy-focused design (100% local processing)
- Chrome Storage API for settings persistence

### Technical
- Manifest V3 compliance
- Service Worker implementation
- Offscreen document for clipboard operations
- Content script injection
- Cross-browser compatibility (Chrome, Brave, Edge)

### Security
- No external API calls
- No data collection
- No tracking or analytics
- Local-only processing

## Version History Guide

### Version Number Format: MAJOR.MINOR.PATCH

- **MAJOR**: Incompatible API changes, complete rewrites
- **MINOR**: New functionality in a backwards compatible manner
- **PATCH**: Backwards compatible bug fixes

### Release Schedule
- Patch releases: As needed for bug fixes
- Minor releases: Monthly with new features
- Major releases: Annually or for significant changes