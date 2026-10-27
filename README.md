# UNIQUE Bank — Frontend Demo

A modern, responsive banking website built with **React**, **Vite**, and **Tailwind CSS**.  
This project is a **frontend demonstration only** — it does not perform real banking transactions, store real data, or connect to a financial backend.

---

## ✨ Features

- **Sign Up Page** — Form with client-side validation (username, email, phone, password matching), loading/success states, and navigation to the dashboard.
- **Banking Dashboard** — Personalized greeting, account balance card with show/hide toggle, currency converter with sample rates, four interactive payment method cards, and recent transaction history.
- **Responsive Layout** — Works on desktop, tablet, and mobile with a collapsible sidebar and mobile navigation drawer.
- **Reusable Components** — Logo, Button, InputField, and more shared across both pages.
- **Clean Design System** — Consistent violet brand palette, green success actions, rounded cards, subtle shadows, and Inter typography.

---

## 🛠 Technologies

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI library |
| [Vite 8](https://vite.dev/) | Build tool and dev server |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first styling |
| [React Router DOM 7](https://reactrouter.com/) | Client-side routing |
| [Lucide React](https://lucide.dev/) | Icon library |

---

## 📁 Folder Structure

```text
banking-system/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── common/          # Logo, Button, InputField
│   │   ├── signup/          # SignupForm
│   │   └── dashboard/       # Header, Sidebar, AccountBalanceCard,
│   │                        # CurrencyConverter, PaymentMethods,
│   │                        # RecentTransactions
│   ├── pages/               # SignupPage, DashboardPage, NotFoundPage
│   ├── data/                # mockData.js (fictional accounts, rates, transactions)
│   ├── App.jsx              # Route definitions
│   ├── main.jsx             # React entry point
│   └── index.css            # Tailwind imports + design tokens
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 📋 Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yashaswinimullalli/banking-system.git
cd banking-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. (Optional) Create an environment file

```bash
cp .env.example .env
```

### 4. Start the development server

```bash
npm run dev
```

The app opens at **http://localhost:5173**.

### 5. Build for production

```bash
npm run build
```

### 6. Preview the production build

```bash
npm run preview
```

---

## 🔀 Routes

| Path | Page |
|---|---|
| `/` | Redirects to `/signup` |
| `/signup` | Sign Up page |
| `/dashboard` | Banking Dashboard |
| `*` | 404 Not Found |

---

## 🌿 Git Workflow

### Branch conventions

| Branch | Purpose |
|---|---|
| `main` | Stable, working code |
| `develop` | Shared integration branch (optional) |
| `feature/signup-page` | Signup implementation |
| `feature/banking-dashboard` | Dashboard implementation |
| `feature/shared-components` | Shared UI components |

### Commit message style

```
feat: implement signup page
feat: build banking dashboard
fix: validate password confirmation
style: improve responsive layouts
docs: update setup instructions
chore: initialize React and Tailwind
```

### Collaboration guidelines

- Use feature branches and pull requests.
- Assign clear ownership of components.
- Keep shared components stable while pages are in development.
- Pull the latest `main` or `develop` before starting work.
- Commit small, meaningful changes.
- Never commit `.env` files or secrets.
- Never force-push to shared branches without team agreement.

---

## ⚠️ Known Limitations

- **No backend** — The signup form validates input locally but does not create real accounts. Demo data is not persisted.
- **No authentication** — There is no session, token, or password hashing. Do not store real credentials.
- **Sample exchange rates** — Currency converter rates are hardcoded and illustrative; they are not live financial data.
- **Mock transactions** — All account data is fictional.

---

## 📄 License

ISC

---

> **Disclaimer:** This project is a frontend demonstration built for educational and portfolio purposes. It is **not** a real banking service. Do not enter real personal or financial information.