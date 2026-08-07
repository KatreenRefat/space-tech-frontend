# Contributing

Thanks for working on صلحلي. These are the rules the team agreed on — they exist
mostly to stop the merge conflicts and duplicated code we've already had.

## Before you start

```bash
node -v        # 20.19+ or 22.12+ — `nvm use` picks the version from .nvmrc
npm install
npm run dev
```

Never commit directly to `main`. Branch, open a PR, get one approval.

## Branch naming

`<type>/<short-description>` in lowercase with dashes:

```
feat/technician-schedule
fix/otp-resend-timer
refactor/booking-service
docs/api-setup
```

Types: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`, `test`.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/), one logical change
per commit:

```
feat(booking): add technician availability filter
fix(auth): keep the phone number after a page refresh
refactor(services): move signup into userService
```

Write the subject in English, in the imperative, under 72 characters. The body
is optional and can be in Arabic if that explains it better.

## Before you push

```bash
npm run check     # format:check + lint + build — exactly what CI runs
```

If `format:check` fails, run `npm run format`. Don't hand-fix formatting and
don't argue with Prettier — the config in `.prettierrc.json` is the agreement.

## Pull requests

- Keep them small. A PR that touches 40 files is a PR nobody reviews properly.
- Describe **what changed and why**, and add a screenshot for any UI change.
- Link the issue or task it closes.
- CI must be green and one teammate must approve before merge.
- Resolve conflicts by rebasing on `main` — never commit conflict markers
  (`<<<<<<<`, `=======`). We have shipped those before; the build broke.

## Code rules

### Structure

Put new files where the same kind of file already lives (see the tree in the
[README](README.md#project-structure)). In short:

| You are adding…                          | It goes in                        |
| ---------------------------------------- | --------------------------------- |
| A screen                                 | `src/pages/<section>/`            |
| A component used by one screen           | next to it, in that page's folder |
| A component used by several screens      | `src/components/`                 |
| A backend call                           | `src/services/<area>Service.js`   |
| Reusable stateful logic                  | `src/hooks/use*.js`               |
| A pure helper                            | `src/utils/`                      |
| A fixed value used in more than one file | `src/constants/`                  |

Naming: folders lowercase, components `PascalCase.jsx`, everything else
`camelCase.js`. A page over ~300 lines should be split into a folder with its
own `components/` — see `src/pages/auth/Register/`.

### Imports

Use the `@/` alias for anything outside the current folder:

```js
import { authService } from '@/services'; // ✅
import { authService } from '../../../services'; // ❌
```

### API calls

1. **Never hardcode the backend URL.** It lives in `src/config/api.js` and
   nowhere else. If you find yourself typing `https://back...`, stop.
2. **Never call `fetch` from a component.** Add a method to the relevant service
   in `src/services/` and call that. The shared `httpClient` already handles the
   auth header, token refresh on 401, timeouts and error parsing — code that
   calls `fetch` directly silently loses all of it.
3. Catch `ApiError` and branch on `err.status`; field-level messages are in
   `err.details`.

```js
// src/services/bookingService.js
import { httpClient } from './httpClient.js';

export const bookingService = {
  create: (booking) => httpClient.post('/bookings', booking),
};
```

### Routes and constants

Navigate with the constants in `src/constants/routes.js`, not string literals:

```js
navigate(ROUTES.CUSTOMER.HOME); // ✅
navigate('/customer/home'); // ❌
```

Same for `ROLES` and `BOOKING_STATUS`. Role values are uppercase because that is
what the API sends.

### Styling

Tailwind first, using the theme tokens in `src/styles/index.css`
(`text-primary-500`, `bg-blue-light-200`, …) rather than raw hex values. The
older auth screens use `auth.css`; leave it alone unless you're redoing them.

The UI is Arabic and RTL: keep `dir="rtl"` on layout containers and prefer the
logical utilities `ps-*` / `pe-*` / `start-*` / `end-*` over `pl-*` / `pr-*`.

### Don't commit

- `.env` files (only `.env.example`), secrets, or tokens
- `dist/`, `node_modules/`, or zipped copies of the project
- `console.log` left over from debugging
- Commented-out code — git remembers it for you
