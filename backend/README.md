# TaskFlow backend

From the repository root, install dependencies with `npm install`. In `backend/.env`, configure `PORT`, `FRONTEND_URL` (the exact frontend origin, e.g. `http://localhost:3000`), and `DATABASE_URL` for your local PostgreSQL database. Keep credentials out of Git.

From `backend/`:

```sh
npx prisma migrate deploy
npm run prisma:generate
npm run dev
```

## Authentication

| Endpoint | Body | Result |
| --- | --- | --- |
| POST /api/auth/register | name, email, password | Creates a user (201); then log in |
| POST /api/auth/login | email, password | Sets session cookie; returns public user and expiresAt |
| GET /api/auth/me | none | Returns current user, or 401 |
| POST /api/auth/logout | none | Invalidates current session and clears cookie |

Registration accepts a trimmed name of 1–100 characters, normalized lowercase email, and a password of 15–128 characters. Passwords are not trimmed. Passwords use Argon2id; responses never include password hashes.

Sessions have a fixed 24-hour lifetime, without sliding renewal. PostgreSQL stores only a SHA-256 hash of the random token. Logout invalidates the current browser session immediately; other devices remain logged in. Expired sessions are rejected on every authenticated request and cleaned up for the user on their next successful login.

Browser requests must use `credentials: "include"`. All auth POST requests require `X-TaskFlow-CSRF: 1`. Browser origins must match `FRONTEND_URL`; missing Origin is allowed for CLI clients only when the custom header is present. This header relies on strict CORS preflight behavior, and is not a secret token.

```ts
await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json", "X-TaskFlow-CSRF": "1" },
  body: JSON.stringify({ email, password }),
});
```

The example assumes NEXT_PUBLIC_API_URL is the backend origin without `/api`.

The cookie uses HttpOnly, SameSite=Lax, Path=/, and Secure when NODE_ENV=production. Local development uses HTTP. Production requires HTTPS and a same-site frontend/API deployment for this cookie configuration. Authentication attempts share a limit of 20 requests per IP per 15 minutes in memory; multiple server instances would require a shared limiter store. Do not enable broad proxy trust; configure trusted proxies explicitly when deploying behind one.

## Verification

```sh
npm run typecheck
npm run test:auth
```

The integration test uses DATABASE_URL and creates a unique temporary user, exercises auth endpoints, and removes that user and their sessions afterward. Use a local/test database. It verifies hashing, cookies, expiry, rotation, logout, CSRF, rate limiting, and safe responses. Frontend login screens, email verification, password reset, and task endpoints are not implemented yet.
