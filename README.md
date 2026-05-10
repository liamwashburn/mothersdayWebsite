# Mother's Day Tribute

Editable React + JavaScript Vite version of the Mother's Day tribute site.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Netlify is configured in `netlify.toml` to run `npm run build` and publish `dist`.

## Editing Content

Most text, memories, messages, and gallery image paths live in:

```text
src/data/siteContent.js
```

Place custom photos in `public/Family-Photos` and reference timeline images with paths like `/Family-Photos/mom.jpg`. Unused photos in that folder are added to the gallery automatically.

## Private Access On Netlify

Deployed access is protected by the Netlify Edge Function in `netlify/edge-functions/family-auth.js`.

Set these Netlify environment variables with the `Functions` scope:

```text
MOTHERS_DAY_PASSWORD=your-family-password
MOTHERS_DAY_AUTH_SECRET=a-long-random-secret
```

The password is checked at the edge and is not bundled into the React app. Direct requests to pages, scripts, and `public/Family-Photos` assets are blocked until the edge function sets an HttpOnly access cookie.
