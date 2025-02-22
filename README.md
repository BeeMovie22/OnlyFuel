# OnlyFuel Chrome Extension

This Chrome extension automatically replaces the words "fuel" and "NoFuel" with custom emotes on Twitch.tv.

## Current Word-Image Mappings

- "fuel" → Fuel emote
- "NoFuel" → NoFuel emote
- "pizza" → Pizza image

## Installation Instructions

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select this extension directory
4. The extension will automatically work when you visit Twitch.tv

## Customization

To add or modify word-image mappings, edit the `wordToImage` object in `content.js`. The format is:

```javascript
const wordToImage = {
    'word': 'image_url'
};
```

## Features

- Case-insensitive word matching
- Works with dynamically loaded Twitch chat
- Maintains inline text flow
- Hover over images to see the original word
