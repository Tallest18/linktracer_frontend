# LinkTracker — React Frontend (Tailwind CSS)

Beautiful, responsive admin dashboard for managing staff tracking links.

## Stack
- React 18, Tailwind CSS v3, CSS custom animations
- JetBrains Mono for link slugs and numbers
- Fully responsive: desktop table + mobile card layout

## Quick start

```bash
# 1. Make sure the Flask backend is running on port 5000
cd ../link-tracker && python app.py

# 2. Install and start React
cd ../link-tracker-react
npm install
npm start   # → http://localhost:3000
```

## Build for production

```bash
npm run build
```

Copy the `build/` folder to your server or deploy to Netlify/Vercel.

## Environment variables

| Variable | Purpose |
|---|---|
| `REACT_APP_API_URL` | Flask API base URL. Leave blank in dev (CRA proxy). Set in production e.g. `https://api.yourdomain.com` |
| `REACT_APP_BASE_URL` | Public domain for tracking link display. Defaults to `window.location.origin` |
