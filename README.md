# Kakes by Kate

Marketing + custom-order site for **kakesbykate.com**, built with Vite + React.

## Local development

```sh
npm install
npm run dev
```

The dev server runs at <http://localhost:5173>.

## Production build

```sh
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

## Project structure

```
src/
  App.jsx              # Router + route definitions
  layout/Layout.jsx    # Header, nav, footer wrapper
  pages/
    Home.jsx
    Gallery.jsx
    Order.jsx          # Order request form (not yet wired to a backend)
    Contact.jsx
    NotFound.jsx
  styles.css           # All site styles
```

## Deploying to Vercel

1. Push this repo to GitHub.
2. In Vercel, **New Project → Import** the GitHub repo.
3. Framework preset auto-detects as **Vite**. Defaults are correct:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy. Vercel gives you a `*.vercel.app` URL.
5. Add the custom domain:
   - Project → **Settings → Domains → Add** → `kakesbykate.com`
   - Vercel will show DNS records to set at your registrar (usually an `A` record
     for the apex and a `CNAME` for `www`).
   - Once DNS propagates, SSL is provisioned automatically.

`vercel.json` rewrites all paths to `index.html` so client-side routes
(`/gallery`, `/order`, etc.) work on hard refresh.

## TODO before launch

- Replace gallery placeholder tiles with real cake photos
- Wire the order form to a real endpoint (Formspree, Vercel function, or
  Firebase). Right now it just shows a thank-you state.
- Add real email, phone, and Instagram handle in `Layout.jsx` and `Contact.jsx`
- Swap in a custom favicon for `public/favicon.svg`
