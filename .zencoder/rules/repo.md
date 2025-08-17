---
description: Repository Information Overview
alwaysApply: true
---

# Library Badge Information

## Summary
A project that creates a Shields IO badge displaying the latest checked out library book from SWAN Libraries. It uses Playwright to scrape library data, GitHub Actions for automation, and Cloudflare Pages for hosting.

## Structure
- **functions/**: Contains Cloudflare Pages Functions for the API endpoint
- **public/**: Static files served by Cloudflare Pages, including the library.json data
- **.github/workflows/**: GitHub Actions workflow for automated scraping
- **Root files**: Configuration files and scraping scripts

## Language & Runtime
**Language**: TypeScript/JavaScript
**Version**: ES2022 target
**Build System**: None (static files)
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- playwright: ^1.45.0 (Web automation for scraping)

**Development Dependencies**:
- @types/node: ^20.0.0
- typescript: ^5.0.0

## Build & Installation
```bash
npm ci
```

## Automation
**GitHub Actions**: Daily workflow that scrapes library data
**Schedule**: Runs daily at 8 AM UTC (configurable in .github/workflows/scrape.yml)
**Environment Variables**:
- LIB_USER: SWAN library username
- LIB_PASS: SWAN library password

## Deployment
**Platform**: Cloudflare Pages
**Build Command**: `npm run build` (no actual build needed)
**Output Directory**: `public`
**Functions**: Enabled for API endpoint

## API
**Endpoint**: `/api/library-badge`
**Response Format**: Shields IO compatible JSON
**Cache Control**: 30 minutes
**Data Source**: public/library.json

## Scraping
**Target**: SWAN Libraries reading history
**Tool**: Playwright (Chromium)
**Output**: JSON file with book title and author
**Error Handling**: Provides fallback JSON on failure