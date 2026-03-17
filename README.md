# Delia Art Portfolio (Vite + React)

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy pe Vercel

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **SPA routing (React Router)**: proiectul include `vercel.json` cu rewrite către `index.html`, ca să meargă refresh / link direct pe rute ca:
  - `/collection`
  - `/products/:id`

