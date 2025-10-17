# IIT Onboarding — Split Frontend + Backend (Protected Dashboard)

This starter separates a **React (Vite)** frontend and a **Node/Express** backend with **JWT in HttpOnly cookies**. The `/dashboard` route is protected and redirects to `/login` when unauthenticated.

## Structure

```
iit-onboarding/
├─ backend/     # Node + Express + JWT (HttpOnly cookie)
└─ frontend/    # Vite + React + React Router
```

---

## Backend

**.env** (copy `.env.example` to `.env` and edit as needed)
```
PORT=4000
JWT_SECRET=super_secret_change_me
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

**Install & run:**
```bash
cd backend
npm i
npm run dev
# http://localhost:4000
```

Demo credentials:
- Email: `student@hawk.illinoistech.edu`
- Password: `Password123!`

---

## Frontend

**Install & run:**
```bash
cd frontend
npm i
npm run dev
# http://localhost:5173
```

The dev server proxies `/api/*` to the backend per `vite.config.js`.

Routes:
- `/` Home
- `/about`
- `/contact`
- `/login`
- `/dashboard/*` (protected via `<ProtectedRoute/>`)

---

## Integrate your existing UI

- Replace files in `frontend/src/pages/*` with your existing beautiful screens.
- Keep `frontend/src/auth/AuthProvider.jsx` and `frontend/src/auth/ProtectedRoute.jsx` as-is for protection.
- For login, call the provided `login(email, password)` from `useAuth()`.
- For logout, call `logout()` from `useAuth()`.

---

## Security notes

- JWT is stored in an **HttpOnly** cookie to mitigate XSS token theft.
- In production, set `NODE_ENV=production` and run over **HTTPS** so the cookie is `Secure` and `SameSite=None` works when needed (e.g., different origins).
- Replace the demo in‑memory user list with a real database.

Enjoy!
