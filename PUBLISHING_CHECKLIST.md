# ✅ Chrome Web Store Publishing Checklist

## 📋 Pre-Submission Checklist

### 1. Code & Files
- [ ] All files in correct folders (`src/` structure)
- [ ] `manifest.json` version number correct
- [ ] No console.log() statements in production code
- [ ] No minified/obfuscated code
- [ ] No external scripts (only local files)
- [ ] All permissions justified in code

### 2. Icons (Required)
- [ ] icon-16.png created and saved in `src/assets/icons/`
- [ ] icon-32.png created and saved in `src/assets/icons/`
- [ ] icon-48.png created and saved in `src/assets/icons/`
- [ ] icon-128.png created and saved in `src/assets/icons/`

### 3. Documentation
- [ ] Privacy Policy hosted online (GitHub Pages or website)
- [ ] Privacy Policy URL ready
- [ ] All permissions have justifications written

### 4. Store Assets
- [ ] Short description (132 chars max) ready
- [ ] Detailed description formatted and ready
- [ ] At least 1 screenshot (1280x800 or 640x400)
- [ ] Screenshots show actual functionality

### 5. Testing
- [ ] Tested on Chrome
- [ ] Tested on different websites
- [ ] All features working
- [ ] No errors in console
- [ ] Keyboard shortcuts working

---

## 🚀 Quick Submission Steps

### Step 1: Generate Icons
```bash
# Open icon generator
open tools/icon-generator.html

# Save each icon to src/assets/icons/
```

### Step 2: Build Extension
```bash
cd /Users/vladislav_k/Documents/Claude/ai-content-extractor-pro

# Create ZIP file
npm run build

# Check ZIP was created in dist/
ls dist/
```

### Step 3: Create Developer Account
1. Go to https://chrome.google.com/webstore/devconsole
2. Pay $5 registration fee (one-time)
3. Verify account

### Step 4: Upload Extension
1. Click "New Item"
2. Upload ZIP from `dist/` folder
3. Fill in details:

**Title:**
```
AI Content Extractor - Web to AI Bridge
```

**Short Description (132 chars):**
```
Extract clean, readable content from any webpage and format it perfectly for AI chats like ChatGPT & Claude.
```

**Category:**
- Primary: Productivity
- Secondary: Developer Tools

**Language:** English (United States)

**Detailed Description:**
Copy from `store/description.txt`

### Step 5: Add Privacy Policy
```
https://[yourusername].github.io/ai-content-extractor/privacy
```
Or upload `docs/PRIVACY_POLICY.md` to your website

### Step 6: Permission Justifications

| Permission | Justification |
|------------|--------------|
| activeTab | Required to read content from the current webpage the user wants to extract |
| storage | Needed to save user preferences for extraction options |
| clipboardWrite | Essential for copying extracted content to clipboard |
| contextMenus | Provides quick access via right-click menu |
| notifications | Shows extraction status to the user |
| offscreen | Required for clipboard operations in Manifest V3 |
| host_permissions | Allows content extraction from any website the user visits |

### Step 7: Add Screenshots
Minimum 1, maximum 5 screenshots
- Size: 1280x800 or 640x400
- Format: PNG or JPG
- Show actual functionality

### Step 8: Review & Submit
1. Review all information
2. Preview listing
3. Click "Submit for Review"
4. Wait 1-3 business days

---

## 📝 Copy-Paste Ready Texts

### Single Purpose Description:
```
This extension extracts and formats web content for use in AI chat applications.
```

### Support Email:
```
[your-email]@gmail.com
```

### Official Website (optional):
```
https://github.com/[yourusername]/ai-content-extractor
```

---

## ⏰ Timeline

- **Account Setup:** 10 minutes
- **Upload & Fill Details:** 30 minutes  
- **Review Process:** 1-3 business days
- **First Update:** Can submit immediately after approval

---

## 🚨 Common Issues & Solutions

### "Missing privacy policy"
→ Upload PRIVACY_POLICY.md to GitHub Pages or personal website

### "Excessive permissions"
→ All our permissions are justified and necessary

### "No screenshots"
→ Add at least one 1280x800 or 640x400 screenshot

### "Invalid manifest"
→ Check manifest.json syntax and required fields

### "Minified code"
→ Our code is not minified, all readable

---

## 📞 Support

If rejected, you can:
1. Fix issues mentioned in rejection email
2. Resubmit immediately
3. Appeal if you disagree (takes 1-2 weeks)

Developer Support Forum:
https://groups.google.com/a/chromium.org/g/chromium-extensions

---

## 🎉 After Approval

1. **Share the link** on social media
2. **Ask for reviews** from early users
3. **Monitor feedback** in Developer Dashboard
4. **Plan updates** based on user requests
5. **Track installs** and usage statistics

---

Good luck with your submission! 🚀

Extension ready to publish: ✅