# Cloudflare Worker Setup

This project now includes a Cloudflare Worker that provides a more reliable API endpoint for the library badge. The worker fetches data directly from GitHub, ensuring it always has the latest information.

## Setup Steps

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
# or use the local version
npm ci
```

### 2. Authenticate with Cloudflare

```bash
npx wrangler login
```

### 3. Get Your Account ID

```bash
npx wrangler whoami
```

### 4. Set up GitHub Secrets

In your GitHub repository settings, add these secrets:

- `CLOUDFLARE_API_TOKEN`: Create an API token at https://dash.cloudflare.com/profile/api-tokens
  - Use the "Custom token" template
  - Permissions: `Zone:Zone:Read`, `Zone:Zone Settings:Edit`, `Account:Cloudflare Workers:Edit`
  - Account Resources: Include your account
  - Zone Resources: Include your domain (if using custom domain)

- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID (from step 3)

### 5. Deploy the Worker

#### Option A: Manual Deployment
```bash
npm run worker:deploy
```

#### Option B: Automatic Deployment
The worker will be automatically deployed when:
- You push changes to `worker.js` or `wrangler.toml`
- The daily scraping job updates `current.json`

### 6. Configure Your Domain (Optional)

If you want to use a custom domain instead of `*.workers.dev`:

1. Edit `wrangler.toml` and uncomment the routes section
2. Update the pattern to match your domain
3. Redeploy the worker

## Testing

### Local Testing
```bash
# Test the worker logic locally
npm run test:worker

# Run the worker in development mode
npm run worker:dev
```

### Production Testing
Once deployed, test your worker at:
- `https://library-badge.your-subdomain.workers.dev` (workers.dev subdomain)
- `https://your-domain.com/api/library-badge` (custom domain)

## How It Works

1. The worker fetches `current.json` directly from your GitHub repository
2. It formats the book title and author according to your preferences
3. It returns a Shields.io-compatible JSON response
4. The response is cached for 30 minutes to reduce API calls

## Benefits Over Cloudflare Pages

- ✅ Always fetches the latest data from GitHub
- ✅ No deployment delays or cache issues
- ✅ Automatic deployment with GitHub Actions
- ✅ Better error handling and fallbacks
- ✅ More reliable and faster response times

## Migration

To switch from Cloudflare Pages to Workers:

1. Deploy the worker using the steps above
2. Update your badge URLs to point to the worker endpoint
3. You can keep the Pages deployment as a backup if needed