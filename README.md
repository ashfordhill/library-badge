# Library Badge

A Shields IO badge that displays your latest checked out library book from SWAN Libraries.

![reading](https://img.shields.io/endpoint?url=https%3A%2F%2Fyour-pages-domain.pages.dev%2Fapi%2Flibrary-badge&style=flat-square)

## Setup

### 1. Cloudflare Pages Setup

1. Go to Cloudflare Dashboard → Pages → Create a project
2. Connect this GitHub repository
3. Build settings:
   - Build command: `npm run build`
   - Output directory: `public`
   - Framework preset: None
4. Enable Pages Functions
5. Set your custom domain or note the provided `*.pages.dev` subdomain

### 2. GitHub Repository Secrets

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

- `LIB_USER`: Your SWAN library username
- `LIB_PASS`: Your SWAN library password

### 3. Test the Setup

1. Run the GitHub Action manually:
   - Go to Actions tab → "Scrape SWAN Reading History" → "Run workflow"
2. Check that `public/library.json` gets updated
3. Verify your Cloudflare Pages site deploys automatically
4. Test the badge endpoint: `https://your-domain.pages.dev/api/library-badge`

### 4. Use the Badge

Replace `your-domain.pages.dev` with your actual Cloudflare Pages domain:

```markdown
![reading](https://img.shields.io/endpoint?url=https%3A%2F%2Fyour-domain.pages.dev%2Fapi%2Flibrary-badge&style=flat-square)
```

## How It Works

1. **GitHub Action** (daily): Uses Playwright to log into SWAN, scrape your reading history, and commit the latest book info to `public/library.json`
2. **Cloudflare Pages**: Automatically deploys the updated JSON file
3. **Pages Function**: Serves a Shields-compatible endpoint at `/api/library-badge` that reads the JSON and formats it for the badge
4. **Shields IO**: Renders the badge using your endpoint

## Customization

- **Frequency**: Edit the cron schedule in `.github/workflows/scrape.yml`
- **Badge Style**: Add parameters to the Shields URL like `&labelColor=000&logo=bookstack`
- **Badge Label**: Change `label: "last read"` in `functions/api/library-badge.ts`

## Troubleshooting

- Check GitHub Actions logs if the scraper fails
- Verify your SWAN credentials are correct
- Make sure Cloudflare Pages is connected to your repo and deploying
- Test the endpoint directly in your browser