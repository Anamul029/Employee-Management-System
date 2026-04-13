# Employee Management System (Frontend)

Modern, production-ready **EMS dashboard UI** built with:

- React (Vite)
- React Router DOM
- Tailwind CSS
- Context API (auth + dummy CRUD)
- Recharts (simple chart)
- react-hot-toast (notifications)

All data is **dummy JSON** stored in **localStorage** (no backend yet).

## Run locally

```bash
npm install
npm run dev
```

## Roles & permissions

- **Admin**: Can edit/delete employees, add employees
- **Manager**: Can add employees
- **Employee**: Read-only for employee records

Role is stored in `localStorage` as part of the auth state (`ems_auth`).

## Folder structure

See `src/` for:

- `context/` Auth + EMS state (localStorage persistence)
- `data/` dummy seeds
- `layouts/` public + dashboard shells
- `pages/` route pages
- `components/ui/` reusable components
- `utils/` constants + formatting helpers

