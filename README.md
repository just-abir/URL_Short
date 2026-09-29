# URL Shortener & Analytics Platform

A full-stack URL shortening service with built-in click analytics, QR code generation, and a real-time analytics dashboard. Built with **Node.js/Express** on the backend and **React + TypeScript** on the frontend.

---

## Overview

This platform lets users shorten long URLs into compact, shareable links with optional custom aliases. Every click on a shortened link is tracked — capturing browser, operating system, device type, and referrer data. A rich analytics dashboard visualizes this data through interactive charts (bar, pie, and line charts) to help users understand their link performance at a glance.

### Key Highlights

- 🔗 **Shorten URLs** with auto-generated 6-character codes or custom aliases
- 📊 **Analytics Dashboard** with real-time charts powered by Recharts
- 📱 **QR Code Generation** — every short link gets a downloadable QR code
- ✅ **URL Validation** — checks if the target URL is reachable before shortening
- ⏰ **Link Expiration** — short links auto-expire after 20 days
- 🌓 **Dark/Light Mode** — full theme toggle across the entire UI
- 📱 **Fully Responsive** — works on mobile, tablet, and desktop

---

## Live Demo

🚀 **Live Application:** [URL Short](https://url-short-ms3y-taupe.vercel.app)

## Screenshots

> Add your screenshots here after running the project:
>
> - **Home Page (Light Mode)** — URL shortening form with result card and QR code -(./screenshots/HomePage_lightMode.png)
> - **Home Page (Dark Mode)** — Same page in dark theme -(./screenshots/HomePage_darkMode.png)
> - **Dashboard** — Analytics charts showing clicks by browser, OS, device, and daily trends-(./screenshots/Dashboard.png)

## l

## Features

### URL Shortening

| Feature                     | Description                                                                 |
| --------------------------- | --------------------------------------------------------------------------- |
| Auto Short Code             | Generates a random 6-character hex code (`crypto.randomBytes(3)`)           |
| Custom Alias                | Users can set a custom alias (e.g., `my-link`) instead of random code       |
| Duplicate Detection         | If the same original URL is submitted again, returns the existing short URL |
| Self-Referencing Prevention | Prevents users from shortening an already-shortened URL from the same host  |
| URL Reachability Check      | Validates the target URL via an HTTP GET request before saving              |
| Link Expiration             | Each link expires **20 days** after creation                                |

### QR Code

| Feature         | Description                                                  |
| --------------- | ------------------------------------------------------------ |
| Auto Generation | A QR code image (PNG) is generated for every short link      |
| Download        | Users can download the QR code via a dedicated API endpoint  |
| Display         | QR code is shown directly in the result card on the frontend |

### Analytics Dashboard

| Feature           | Description                                                       |
| ----------------- | ----------------------------------------------------------------- |
| Summary Cards     | Total Links, Total Clicks, Active Links, Reachable Links          |
| Top Links Chart   | Horizontal bar chart of the top 10 most-clicked links             |
| Browser Analytics | Bar chart showing click distribution by browser                   |
| OS Analytics      | Pie chart showing click distribution by operating system          |
| Device Analytics  | Bar chart showing clicks by device type (Desktop, Mobile, Tablet) |
| Daily Report      | Line chart showing click trends over time                         |

### Click Tracking

Each click on a short link records:

- **Browser** name (parsed from User-Agent)
- **Operating System** (parsed from User-Agent)
- **Device Type** (Desktop, Mobile, Tablet)
- **Referrer** (where the click came from, or "Direct")
- **Timestamp** of the visit

### UI/UX

- 🌓 Dark/Light theme toggle with smooth transitions
- 💎 Glassmorphism navbar with backdrop blur
- 🎨 Gradient cards and buttons throughout the UI
- 📋 One-click copy-to-clipboard for short URLs
- ✅ Green/Red badges for URL reachability status
- 🔄 Loading spinner during URL creation

---

## Tech Stack

### Backend

| Technology       | Purpose                                  |
| ---------------- | ---------------------------------------- |
| **Node.js**      | JavaScript runtime                       |
| **Express 5**    | Web framework & API routing              |
| **MongoDB**      | NoSQL database for links & clicks        |
| **qrcode**       | QR code image generation (PNG)           |
| **ua-parser-js** | User-Agent parsing (browser, OS, device) |
| **axios**        | HTTP client for URL reachability checks  |

### Frontend

| Technology             | Purpose                                    |
| ---------------------- | ------------------------------------------ |
| **React 19**           | UI library                                 |
| **TypeScript**         | Type-safe JavaScript                       |
| **Vite 8**             | Lightning-fast dev server & bundler        |
| **React Router DOM 7** | Client-side routing (Home, Dashboard)      |
| **Recharts 3**         | Data visualization (Bar, Pie, Line charts) |
| **Tailwind CSS 4**     | Utility-first CSS framework                |
| **Axios**              | HTTP client for API calls                  |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                     CLIENT (React)                  │
│                                                     │
│  ┌──────────┐   ┌──────────┐   ┌────────────────┐  │
│  │   Home   │   │Dashboard │   │    Navbar      │  │
│  │  Page    │   │  Page    │   │  (Theme Toggle)│  │
│  └────┬─────┘   └────┬─────┘   └────────────────┘  │
│       │              │                              │
│       │   Axios HTTP Requests                       │
│       │   (http://localhost:5000)                    │
└───────┼──────────────┼──────────────────────────────┘
        │              │
        ▼              ▼
┌─────────────────────────────────────────────────────┐
│                 SERVER (Express 5)                   │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │              Middleware Layer                │    │
│  │  cors ─► express.json ─► static files       │    │
│  └─────────────────────┬───────────────────────┘    │
│                        │                            │
│  ┌─────────────────────┼───────────────────────┐    │
│  │              Route Layer                    │    │
│  │                                             │    │
│  │  POST /api/v1/links ──────► createLink      │    │
│  │  GET  /api/v1/links/:code/download          │    │
│  │                           ──► qrCodeDownload│    │
│  │  GET  /api/v1/dashboard ──► getDashboard    │    │
│  │  GET  /:code ─────────────► redirectOriginal│    │
│  └─────────────────────┬───────────────────────┘    │
│                        │                            │
│  ┌─────────────────────┼───────────────────────┐    │
│  │           Error Handling Layer              │    │
│  │  404 handler ─► globalErrorController       │    │
│  └─────────────────────────────────────────────┘    │
└────────────────────────┬────────────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │     MongoDB         │
              │                     │
              │  ┌───────────────┐  │
              │  │  Links        │  │
              │  │  Collection   │  │
              │  └───────────────┘  │
              │  ┌───────────────┐  │
              │  │  Clicks       │  │
              │  │  Collection   │  │
              │  └───────────────┘  │
              └─────────────────────┘
```

---

## Project Structure

```
URL_Short/
│
├── backend/
│   ├── server.js                          # Entry point — connects DB & starts server
│   ├── package.json
│   ├── .env                               # Environment variables (gitignored)
│   ├── .env.example                       # Template for environment variables
│   │
│   └── src/
│       ├── app.js                         # Express app setup, middleware & routes
│       │
│       ├── Router/
│       │   ├── createURL.route.js         # Routes: POST /  &  GET /:code/download
│       │   └── dashboard.route.js         # Routes: GET /
│       │
│       ├── controller/
│       │   ├── link.controller.js         # createLink, redirectOriginal, qrCodeDownload
│       │   └── dashboard.controller.js    # getDashboard (aggregated analytics)
│       │
│       ├── model/
│       │   ├── link.model.js              # Link schema (URL, shortCode, QR, expiry, etc.)
│       │   └── click.model.js             # Click schema (browser, OS, device, referrer)
│       │
│       ├── middlewares/
│       │   └── globalErrorHandler.js      # Centralized error response handler
│       │
│       ├── utils/
│       │   ├── appError.js                # Custom AppError class (statusCode + status)
│       │   ├── asyncHandler.js            # try/catch wrapper for async route handlers
│       │   └── sendResponse.js            # Standardized JSON response helper
│       │
│       └── uploads/
│           └── qr/                        # Generated QR code images (PNG files)
│
├── frontend/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   │
│   └── src/
│       ├── main.tsx                       # React entry point (BrowserRouter)
│       ├── App.tsx                        # Root component (Routes + Theme state)
│       ├── index.css                      # Global styles
│       │
│       ├── Components/
│       │   └── Navbar.tsx                 # Navigation bar with theme toggle
│       │
│       └── Pages/
│           ├── Home.tsx                   # URL shortening form + result card + QR
│           └── Dashboard.tsx              # Analytics dashboard with charts
│
├── .gitignore
└── README.md
```

---

## How It Works

### 1. Shortening a URL

```
User pastes URL ──► Frontend sends POST /api/v1/links
                          │
                          ▼
                    ┌─────────────┐
                    │  Validation │
                    │             │
                    │ • Empty?    │
                    │ • Already   │
                    │   shortened?│
                    │ • Duplicate │
                    │   original? │
                    │ • Alias     │
                    │   taken?    │
                    └──────┬──────┘
                           │ Pass
                           ▼
                    ┌─────────────┐
                    │  Generate   │
                    │  Short Code │
                    │  (6 hex)    │
                    └──────┬──────┘
                           │
                    ┌──────┼──────┐
                    │      │      │
                    ▼      ▼      ▼
                 Build   Gen    Check
                 Short   QR     URL
                 URL     Code   Reachable
                    │      │      │
                    └──────┼──────┘
                           │
                           ▼
                    Save to MongoDB
                           │
                           ▼
                    Return result
                    (shortUrl, qrCode, etc.)
```

### 2. Redirecting a Short URL

```
User visits /:code ──► Find link by shortCode or customAlias
                              │
                        ┌─────┼─────┐
                        │           │
                     Not Found   Found
                        │           │
                     404 Error   Check Expiry
                                    │
                              ┌─────┼─────┐
                              │           │
                           Expired    Active
                              │           │
                           400 Error   Parse User-Agent
                                          │
                                          ▼
                                    Save Click Data
                                    (browser, OS, device, referrer)
                                          │
                                          ▼
                                    Increment clickCount
                                    Update lastVisitedAt
                                          │
                                          ▼
                                    302 Redirect → originalUrl
```

### 3. Analytics Dashboard

The dashboard page calls `GET /api/v1/dashboard` which runs **MongoDB aggregation pipelines** to calculate:

- **Top 10 Links** — sorted by `clickCount` descending
- **Browser Stats** — grouped by `browser` field in clicks collection
- **OS Stats** — grouped by `operatingSystem` field
- **Device Stats** — grouped by `device` field
- **Daily Report** — grouped by date from `visitedAt`
- **Extra Stats** — total links, total clicks, active links, reachable links (using `$facet`)

---

## API Endpoints

### Links

| Method | Endpoint                       | Description                             | Request Body                                                 |
| ------ | ------------------------------ | --------------------------------------- | ------------------------------------------------------------ |
| `POST` | `/api/v1/links`                | Create a short URL                      | `{ "originalUrl": "https://...", "customAlias": "my-link" }` |
| `GET`  | `/api/v1/links/:code/download` | Download QR code image (PNG)            | —                                                            |
| `GET`  | `/:code`                       | Redirect to original URL (tracks click) | —                                                            |

### Dashboard

| Method | Endpoint            | Description            |
| ------ | ------------------- | ---------------------- |
| `GET`  | `/api/v1/dashboard` | Get all analytics data |

### Response Format

All API responses follow this standard structure:

```json
{
  "success": true,
  "message": "Short URL created successfully",
  "data": {
    "_id": "...",
    "originalUrl": "https://example.com/very-long-url",
    "shortCode": "a1b2c3",
    "customAlias": null,
    "shortUrl": "http://localhost:5000/a1b2c3",
    "qrCode": "/uploads/qr/a1b2c3.png",
    "clickCount": 0,
    "isActive": true,
    "isReachable": true,
    "expiresAt": "2026-09-02T08:00:00.000Z",
    "lastVisitedAt": null,
    "createdAt": "2026-08-13T08:00:00.000Z",
    "updatedAt": "2026-08-13T08:00:00.000Z"
  }
}
```

### Error Response

```json
{
  "success": false,
  "status": "fail",
  "message": "Route unavailable / Not Found",
  "stack": "Error: ... (only in development)"
}
```

---

## Database

### Link Model (`links` collection)

| Field           | Type      | Description                                                |
| --------------- | --------- | ---------------------------------------------------------- |
| `originalUrl`   | `String`  | The original long URL (required, trimmed)                  |
| `shortCode`     | `String`  | Auto-generated 6-char hex code (required, unique, indexed) |
| `customAlias`   | `String`  | Optional custom alias (unique, sparse index)               |
| `title`         | `String`  | Optional link title                                        |
| `clickCount`    | `Number`  | Total number of clicks (default: `0`)                      |
| `qrCode`        | `String`  | Path to the generated QR code image                        |
| `isActive`      | `Boolean` | Whether the link is active (default: `true`)               |
| `shortUrl`      | `String`  | Full short URL (unique)                                    |
| `expiresAt`     | `Date`    | Expiration date (20 days from creation)                    |
| `isReachable`   | `Boolean` | Whether the original URL is reachable (default: `true`)    |
| `lastVisitedAt` | `Date`    | Timestamp of the last click                                |
| `createdAt`     | `Date`    | Auto-generated by Mongoose                                 |
| `updatedAt`     | `Date`    | Auto-generated by Mongoose                                 |

### Click Model (`clicks` collection)

| Field             | Type       | Description                                        |
| ----------------- | ---------- | -------------------------------------------------- |
| `linkID`          | `ObjectId` | Reference to the Link document (required, indexed) |
| `browser`         | `String`   | Browser name (default: `"Unknown"`)                |
| `operatingSystem` | `String`   | OS name (default: `"Unknown"`)                     |
| `device`          | `String`   | Device type (default: `"Desktop"`)                 |
| `country`         | `String`   | Country (default: `"Unknown"`)                     |
| `city`            | `String`   | City (default: `"Unknown"`)                        |
| `referrer`        | `String`   | Referrer URL (default: `"Direct"`)                 |
| `visitedAt`       | `Date`     | Click timestamp (default: `Date.now`)              |

### Entity Relationship

```
┌──────────────┐          ┌──────────────┐
│    Link      │          │    Click     │
│──────────────│          │──────────────│
│ _id (PK)     │◄────────┤│ linkID (FK)  │
│ originalUrl  │   1 : N  │ browser      │
│ shortCode    │          │ OS           │
│ customAlias  │          │ device       │
│ clickCount   │          │ country      │
│ qrCode       │          │ city         │
│ shortUrl     │          │ referrer     │
│ expiresAt    │          │ visitedAt    │
│ isActive     │          └──────────────┘
│ isReachable  │
│ lastVisitedAt│
└──────────────┘
```

---

## Installation & Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local or MongoDB Atlas cloud)
- **npm** (comes with Node.js)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/URL_Short.git
cd URL_Short
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file by copying the example:

```bash
cp .env.example .env
```

Edit the `.env` file with your values (see [Environment Variables](#environment-variables) section).

Make sure the QR upload directory exists:

```bash
mkdir -p src/uploads/qr
```

Start the backend server:

```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

The backend runs at: **http://localhost:5000**

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Start the frontend dev server:

```bash
npm run dev
```

The frontend runs at: **http://localhost:5173**

---

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

FRONTEND_URL=http://localhost:5173
```

| Variable       | Required | Description                                     |
| -------------- | -------- | ----------------------------------------------- |
| `PORT`         | No       | Server port (default: `5000`)                   |
| `NODE_ENV`     | No       | Environment mode (`development` / `production`) |
| `MONGODB_URI`  | **Yes**  | MongoDB connection string                       |
| `JWT_SECRET`   | No       | JWT secret key (for future auth features)       |
| `FRONTEND_URL` | No       | Frontend URL (for CORS configuration)           |

---

## Usage

### 1. Shorten a URL

1. Open **https://url-short-ms3y-taupe.vercel.app** in your browser
2. Paste a long URL in the input field
3. (Optional) Enter a custom alias
4. Click **"Shorten →"**
5. View the result card with your short URL, QR code, and link details
6. Click **"📋 Copy"** to copy the short URL to your clipboard
7. Click **"↓ Download"** to save the QR code as a PNG image

### 2. Visit a Short URL

Open the short URL (e.g., `http://localhost:5000/a1b2c3`) in any browser. You will be automatically redirected to the original URL, and the click will be tracked.

### 3. View Analytics

1. Click **"Dashboard"** in the navbar
2. View real-time stats:
   - **Summary Cards** — Total Links, Total Clicks, Active Links, Reachable Links
   - **Top Links** — Bar chart of most-clicked links
   - **Browser Analytics** — Bar chart of clicks by browser
   - **OS Analytics** — Pie chart of clicks by operating system
   - **Daily Report** — Line chart of click trends over time
   - **Device Analytics** — Bar chart of clicks by device type

### 4. Toggle Theme

Click the **sun/moon icon** in the navbar to switch between light and dark mode. The theme applies globally across all pages with smooth transitions.

---

## Future Improvements

- [ ] **User Authentication** — Sign up, login, and manage your own links (JWT-based)
- [ ] **Geo-location Tracking** — Track country/city using IP geolocation APIs
- [ ] **Link Management** — Edit, delete, activate/deactivate links
- [ ] **Custom Expiration** — Let users set their own expiration date
- [ ] **Password-Protected Links** — Require a password to access a short URL
- [ ] **Bulk URL Shortening** — Upload a CSV of URLs and shorten them all at once
- [ ] **API Rate Limiting** — Prevent abuse with request throttling
- [ ] **Click Map** — Visual world map showing click locations
- [ ] **Link Tags & Categories** — Organize links with custom tags
- [ ] **Email Notifications** — Notify users when their link reaches a click milestone
- [ ] **Custom Domains** — Allow users to use their own domain for short URLs
- [ ] **Unit & Integration Tests** — Add testing with Jest & Supertest

---

## Author

**Abir**

- GitHub: [@just-abir](https://github.com/just-abir)

---

---

<p align="center">
  Made with ❤️ using Node.js, React & MongoDB
</p>
