# صلحلي — Space Tech Frontend

React + Vite front-end for صلحلي, a home-services marketplace that connects
customers with technicians (plumbing, electrical, carpentry, …).

Live: <https://sla7ly-org.github.io/space-tech-frontend/>

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
```

No `.env` file is required — the app talks to the shared backend out of the box.
Copy `.env.example` to `.env.local` only if you need to point at a different one.

## Scripts

| Script                 | What it does                                     |
| ---------------------- | ------------------------------------------------ |
| `npm run dev`          | Dev server with HMR and the API proxy            |
| `npm run build`        | Production build into `dist/`                    |
| `npm run preview`      | Serve the built `dist/` locally                  |
| `npm run lint`         | Oxlint                                           |
| `npm run lint:fix`     | Oxlint with autofix                              |
| `npm run format`       | Rewrite files with Prettier                      |
| `npm run format:check` | Fail if anything is unformatted (what CI runs)   |
| `npm run check`        | format:check + lint + build — run before pushing |

## Project structure

```
src/
├── assets/          # static files — icons/ for small SVGs, images/ for artwork
├── components/      # components shared by more than one page
├── config/          # api.js (the backend URL) + env.js (per-environment values)
├── constants/       # roles, routes, booking statuses, storage keys
├── hooks/           # reusable stateful logic (useGeolocation, …)
├── layouts/         # page shells rendered around a section's routes
├── pages/           # one folder per section: auth/, customer/, technician/
│   └── auth/
│       ├── components/       # shared across the auth screens
│       └── Register/         # a page big enough to need its own folder
├── routes/          # route tables — AppRoutes composes the section routers
├── services/        # the API layer, one module per backend area
├── styles/          # global stylesheet and the Tailwind theme
└── utils/           # pure helpers (phone formatting, localStorage access)
```

Conventions: folders are lowercase, component files are `PascalCase.jsx`, and
everything else is `camelCase.js`. Imports use the `@/` alias for anything
outside the current folder — `import { authService } from '@/services'`, never
`../../../services`.

## Talking to the backend

**The backend URL is defined in exactly one place: `src/config/api.js`.** Both
the runtime HTTP client and the Vite dev proxy read it from there, so the app
and the proxy can never drift apart.

- **Dev** — requests go to a relative `/api/v1/...`, and Vite proxies them to the
  backend. Same-origin, so no CORS.
- **Production** — a static host has no proxy, so the build inlines the absolute
  origin. The backend must allow the site's origin via CORS.

To use a different backend, set `VITE_API_ORIGIN` in `.env.local`; the proxy and
the client both pick it up.

Every request goes through `src/services/httpClient.js`, which attaches the auth
header, refreshes an expired token once and retries, times requests out, and
turns non-2xx responses into an `ApiError` carrying `status` and `details`. Add
new calls as a method on a service module — never call `fetch` from a component.

```js
import { userService } from '@/services';

const profile = await userService.getProfile();
```

## Deployment

Every push to `main` triggers `.github/workflows/deploy.yml`, which builds and
publishes `dist/` to GitHub Pages. Because Pages serves from a subpath, the
build sets `base: '/space-tech-frontend/'` and writes a `404.html` copy of
`index.html` so client-side routes survive a hard refresh.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for branch naming, commit format, code
style and the PR checklist.
