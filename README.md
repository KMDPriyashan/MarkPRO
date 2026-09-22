# AttendEase

AttendEase is a responsive workforce operations dashboard for attendance, leave, payroll, employee management, and audit visibility. It uses browser storage for a lightweight demo workspace and seeds an administrator account on first launch.

## Features

- Role-aware authentication with admin and employee access
- Employee directory with CRUD, search, filtering, pagination, and CSV import
- Geolocation-aware clock in/out and attendance reporting
- Leave balances, applications, approvals, cancellations, and status filters
- Attendance-based payroll generation with overtime and deduction calculations
- Downloadable PDF payslips
- Dashboard charts and quick actions
- Admin audit logs with filtering and CSV export
- Responsive Tailwind UI with reusable loaders, modals, confirmations, and empty states

## Setup

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. For a production check:

```bash
npm run lint
npm run build
```

## GitHub Pages

GitHub Pages is deployed automatically from the `main` branch by the workflow in `.github/workflows/deploy-pages.yml`. In the repository settings, set Pages to **GitHub Actions** as the deployment source. The published site is:

`https://kmdpriyashan.github.io/MarkPRO/`

## Default Login

Use `admin` as the username and `admin123` as the password. Seed data is created automatically on the first application load.

## Tech Stack

- React 19 and Vite
- React Router
- Tailwind CSS
- Recharts
- Axios
- React Toastify
- jsPDF and html2canvas
- React Icons
- Browser localStorage

## Screenshots

Screenshots can be added here as the product UI evolves.

<!-- Add images such as: ![Dashboard](docs/screenshots/dashboard.png) -->
