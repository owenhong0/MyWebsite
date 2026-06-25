# Environment Setup

This project now has separate configurations for development and production environments.

## Development Environment

For local development, use these commands:

```bash
# Start development server (no GitHub Pages base path)
npm run dev
# or
npm start

# Build for development (no GitHub Pages base path)
npm run build:dev
```

The development server runs at:
- Local: http://localhost:3000/
- Network: http://192.168.1.18:3000/

## Production Environment

For GitHub Pages deployment, use these commands:

```bash
# Build for production (with GitHub Pages base path)
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Configuration Files

- `vite.config.ts` - Main configuration that automatically detects environment
- `vite.config.dev.ts` - Development-specific configuration (optional)
- `vite.config.prod.ts` - Production-specific configuration (optional)

## Key Differences

### Development
- Base path: `/` (serves from root)
- Optimized for local development
- Hot module replacement enabled
- Network access enabled

### Production
- Base path: `/MyWebsite/` (for GitHub Pages)
- Optimized build output
- Assets properly referenced for GitHub Pages deployment

## How It Works

The main `vite.config.ts` uses Vite's mode detection:
- `--mode development` sets base path to `/`
- `--mode production` sets base path to `/MyWebsite/`

This ensures your development environment works locally while production builds work correctly on GitHub Pages.