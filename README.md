# 📚 Library Badge

A dynamic badge that displays your latest checked-out library book from SWAN Libraries. The badge automatically updates daily via GitHub Actions and shows the current book title and author in a clean, formatted display.

## 🏷️ Badge Examples

Replace `your-domain.pages.dev` with your actual Cloudflare Pages domain:

### Usage
```markdown
![Library Badge](https://img.shields.io/endpoint?url=https://your-domain.pages.dev/api/library-badge)
```

### Cyan/Cerulean Text Options

#### ReadTheDocs Icon

**Bright Cyan**
![Library Badge](https://img.shields.io/badge/borrowed-The%20Wisdom%20of%20Morrie%20%E2%80%94%20Schwartz%2C%20M.-7B1FA2?labelColor=4A148C&logo=readthedocs&logoColor=00FFFF)

**Deep Sky Blue**
![Library Badge](https://img.shields.io/badge/borrowed-The%20Wisdom%20of%20Morrie%20%E2%80%94%20Schwartz%2C%20M.-7B1FA2?labelColor=4A148C&logo=readthedocs&logoColor=00BFFF)

**Cerulean**
![Library Badge](https://img.shields.io/badge/borrowed-The%20Wisdom%20of%20Morrie%20%E2%80%94%20Schwartz%2C%20M.-7B1FA2?labelColor=4A148C&logo=readthedocs&logoColor=007BA7)

**Turquoise**
![Library Badge](https://img.shields.io/badge/borrowed-The%20Wisdom%20of%20Morrie%20%E2%80%94%20Schwartz%2C%20M.-7B1FA2?labelColor=4A148C&logo=readthedocs&logoColor=40E0D0)

**Dark Turquoise**
![Library Badge](https://img.shields.io/badge/borrowed-The%20Wisdom%20of%20Morrie%20%E2%80%94%20Schwartz%2C%20M.-7B1FA2?labelColor=4A148C&logo=readthedocs&logoColor=00CED1)

**Light Sea Green**
![Library Badge](https://img.shields.io/badge/borrowed-The%20Wisdom%20of%20Morrie%20%E2%80%94%20Schwartz%2C%20M.-7B1FA2?labelColor=4A148C&logo=readthedocs&logoColor=20B2AA)

**Aqua**
![Library Badge](https://img.shields.io/badge/borrowed-The%20Wisdom%20of%20Morrie%20%E2%80%94%20Schwartz%2C%20M.-7B1FA2?labelColor=4A148C&logo=readthedocs&logoColor=00FFFF)

**Medium Turquoise**
![Library Badge](https://img.shields.io/badge/borrowed-The%20Wisdom%20of%20Morrie%20%E2%80%94%20Schwartz%2C%20M.-7B1FA2?labelColor=4A148C&logo=readthedocs&logoColor=48D1CC)

**Cadet Blue**
![Library Badge](https://img.shields.io/badge/borrowed-The%20Wisdom%20of%20Morrie%20%E2%80%94%20Schwartz%2C%20M.-7B1FA2?labelColor=4A148C&logo=readthedocs&logoColor=5F9EA0)

**Steel Blue**
![Library Badge](https://img.shields.io/badge/borrowed-The%20Wisdom%20of%20Morrie%20%E2%80%94%20Schwartz%2C%20M.-7B1FA2?labelColor=4A148C&logo=readthedocs&logoColor=4682B4)

#### GitBook Icon

**Bright Cyan**
![Library Badge](https://img.shields.io/badge/borrowed-The%20Wisdom%20of%20Morrie%20%E2%80%94%20Schwartz%2C%20M.-7B1FA2?labelColor=4A148C&logo=gitbook&logoColor=00FFFF)

**Deep Sky Blue**
![Library Badge](https://img.shields.io/badge/borrowed-The%20Wisdom%20of%20Morrie%20%E2%80%94%20Schwartz%2C%20M.-7B1FA2?labelColor=4A148C&logo=gitbook&logoColor=00BFFF)

**Cerulean**
![Library Badge](https://img.shields.io/badge/borrowed-The%20Wisdom%20of%20Morrie%20%E2%80%94%20Schwartz%2C%20M.-7B1FA2?labelColor=4A148C&logo=gitbook&logoColor=007BA7)

**Turquoise**
![Library Badge](https://img.shields.io/badge/borrowed-The%20Wisdom%20of%20Morrie%20%E2%80%94%20Schwartz%2C%20M.-7B1FA2?labelColor=4A148C&logo=gitbook&logoColor=40E0D0)

**Dark Turquoise**
![Library Badge](https://img.shields.io/badge/borrowed-The%20Wisdom%20of%20Morrie%20%E2%80%94%20Schwartz%2C%20M.-7B1FA2?labelColor=4A148C&logo=gitbook&logoColor=00CED1)

**Light Sea Green**
![Library Badge](https://img.shields.io/badge/borrowed-The%20Wisdom%20of%20Morrie%20%E2%80%94%20Schwartz%2C%20M.-7B1FA2?labelColor=4A148C&logo=gitbook&logoColor=20B2AA)

**Aqua**
![Library Badge](https://img.shields.io/badge/borrowed-The%20Wisdom%20of%20Morrie%20%E2%80%94%20Schwartz%2C%20M.-7B1FA2?labelColor=4A148C&logo=gitbook&logoColor=00FFFF)

**Medium Turquoise**
![Library Badge](https://img.shields.io/badge/borrowed-The%20Wisdom%20of%20Morrie%20%E2%80%94%20Schwartz%2C%20M.-7B1FA2?labelColor=4A148C&logo=gitbook&logoColor=48D1CC)

**Cadet Blue**
![Library Badge](https://img.shields.io/badge/borrowed-The%20Wisdom%20of%20Morrie%20%E2%80%94%20Schwartz%2C%20M.-7B1FA2?labelColor=4A148C&logo=gitbook&logoColor=5F9EA0)

**Steel Blue**
![Library Badge](https://img.shields.io/badge/borrowed-The%20Wisdom%20of%20Morrie%20%E2%80%94%20Schwartz%2C%20M.-7B1FA2?labelColor=4A148C&logo=gitbook&logoColor=4682B4)

## ✨ Features

- **📖 Current Book Display**: Shows your latest checked-out library book
- **🎨 Library-Themed Design**: Purple color scheme with BookStack icon that complements Spotify green
- **📝 Smart Formatting**: 
  - Truncates titles after ":" to keep badges clean
  - Shows author as "Last, First Initial" format
- **📚 Reading History**: Maintains a history of your previous books (up to 20)
- **🔄 Auto-Updates**: Daily scraping via GitHub Actions
- **🚀 Fast & Reliable**: Hosted on Cloudflare Pages with 30-minute caching

## 🛠️ How It Works

1. **Daily Scraping**: GitHub Actions runs daily at 8 AM UTC to check your SWAN library account
2. **Smart History**: When a new book is detected, the previous book is automatically added to `history.json`
3. **Badge Generation**: The `/api/library-badge` endpoint returns Shields.io-compatible JSON
4. **Caching**: Responses are cached for 30 minutes for optimal performance

## 📁 File Structure

- `current.json` - Your currently checked-out book
- `history.json` - Your reading history (last 20 books)
- `functions/api/library-badge.ts` - Badge API endpoint
- `scrape-swan.js` - Library scraping script
- `.github/workflows/scrape.yml` - Automated daily scraping

## 🔧 Setup

1. **Fork this repository**
2. **Set up secrets** in your GitHub repository:
   - `LIB_USER`: Your SWAN library username
   - `LIB_PASS`: Your SWAN library password
3. **Deploy to Cloudflare Pages**:
   - Connect your GitHub repository
   - Build command: `npm run build` (optional)
   - Output directory: `public`
   - Enable Functions
4. **Update your badge URL** with your Cloudflare Pages domain

## 🎯 Badge Customization

The badge automatically formats your book data:

- **Title**: Truncates after ":" (e.g., "The Art of War: Ancient Wisdom" → "The Art of War")
- **Author**: Converts to "Last, First Initial" (e.g., "Sun Tzu" → "Tzu, S.")
- **Color**: Library maroon (`#7B2D26`) when active, gray when inactive
- **Icon**: Custom library document SVG

## 🔍 Troubleshooting

- **Badge shows "none"**: Check if `current.json` exists and has valid data
- **Not updating**: Verify GitHub Actions secrets are set correctly
- **Wrong book**: The scraper reads from your "Reading History" page - make sure it's enabled in your library account

## 📊 API Response Format

The badge endpoint returns Shields.io-compatible JSON:

```json
{
  "schemaVersion": 1,
  "label": "borrowed",
  "message": "The Wisdom of Morrie — Schwartz, M.",
  "color": "7B2D26",
  "logoSvg": "<svg>...</svg>"
}
```

## 🤝 Contributing

Feel free to open issues or submit pull requests to improve the badge functionality!

## 📄 License

MIT License - feel free to use and modify as needed.