# Authentication flow

Start the backend and frontend in separate terminals from the repository root:

```sh
npm run dev:backend
npm run dev:frontend
```

Set `NEXT_PUBLIC_API_URL=http://localhost:7000` in `frontend/.env` (the backend origin, without `/api`). The backend's `PORT` must match, and `FRONTEND_URL` must match the frontend origin, normally `http://localhost:3000`. Restart Next.js after changing environment variables.

Use `localhost` consistently for both servers, rather than mixing it with `127.0.0.1`. This setup relies on both applications sharing a hostname: cookies are shared across ports. Deploying the applications on different hostnames requires a same-origin proxy or an explicit cookie-domain design; production cookies also require HTTPS.

## Try it

1. Visit `/dashboard` without a session: it redirects to `/login`.
2. Register at `/register`. Successful registration redirects to login; registration does not create a session.
3. Log in. The backend sets its 24-hour HttpOnly session cookie, then the browser opens `/dashboard`.
4. Refresh the dashboard. Next.js forwards only the session cookie to Express `/api/auth/me` and renders the welcome message only after verification. No session responses are cached.
5. Log out. Express deletes the session and clears the cookie, then the browser returns to login. Opening `/dashboard` again redirects to login.

The browser API helper includes credentials and the CSRF header automatically. It never reads or stores the session token in JavaScript. API failures appear in the forms; a session-verification outage displays a retry page rather than protected content. Future task endpoints must also use the backend authentication middleware and check ownership.

## Files

- `src/lib/api.ts`: browser requests, API URL, response errors, and user type.
- `src/lib/auth-server.ts`: server-side session verification.
- `src/components/auth/`: registration, login, and logout controls.
- `src/app/dashboard/page.tsx`: protected welcome page.
