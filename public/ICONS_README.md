# PWA Icons for MoneyPilot

## Generated Icons

This folder contains PWA icons for the MoneyPilot application:

- **icon-192.png** - 192x192px icon for Android home screen and app drawer
- **icon-512.png** - 512x512px icon for splash screens and high-resolution displays
- **icon-source.svg** - Source SVG file used to generate the PNG icons

## Design Details

### Logo Concept
The MoneyPilot icon features:
- **Wallet symbol** - Represents personal finance management
- **Dollar sign ($)** - Clear indication of money/finance app
- **Green gradient background** - Uses brand color #22c55e (primary green)
- **Maskable design** - Content is within the safe zone (center 80%)

### Brand Colors
- Primary: `#22c55e` (green)
- Secondary: `#16a34a` (darker green)
- Background: `#09090b` (dark) - used in manifest
- Text: `#ffffff` (white)

## Regenerating Icons

If you need to modify the icon design:

1. Edit `icon-source.svg` with your changes
2. Run the generation script:
   ```bash
   npm run generate-icons
   ```

This will regenerate both PNG files from the SVG source.

## Testing Icons

Test how your icons look on different devices:
- **Maskable test**: https://maskable.app/
- **PWA Builder**: https://www.pwabuilder.com/

Upload the PNG files to see how they appear on various device shapes (circle, squircle, rounded square).

## Maskable Icon Guidelines

The icon follows PWA maskable icon best practices:
- ✅ Safe zone: Critical content within center 80%
- ✅ Solid background: No transparency
- ✅ High contrast: White elements on green background
- ✅ Simple design: Clear at small sizes
- ✅ Centered logo: Main visual element in safe zone

## Icon Sizes

Both icons are referenced in `manifest.json`:
```json
{
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

The `"purpose": "any maskable"` means these icons work as both standard and maskable icons.
