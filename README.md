# SWS Skeptrons — Official Chapter Website

> **Alpha Kappa Rho — Social Welfare Skeptrons (SWS), Region VII**
> *"Truth Conquers All"*

---

## 🌐 Live Site

**[https://sws-skeptrons.vercel.app](https://sws-skeptrons.vercel.app)**

---

## 📖 About This Project

This is the official website of the **Social Welfare Skeptrons (SWS)** chapter of **Alpha Kappa Rho International Humanitarian Service Fraternity & Sorority**, Region VII, Philippines.

| Detail | Info |
|---|---|
| **Organization** | Alpha Kappa Rho (AKRho) |
| **Chapter** | Social Welfare Skeptrons (SWS) |
| **AKRho Founded** | August 8, 1973 — UST, Manila |
| **SWS Chapter Est.** | 2021 |
| **Region** | Region VII, Philippines |
| **Motto** | *"Truth Conquers All"* |

---

## ✨ Features

- **Landing/Disclaimer Page** — Members-only gate with Enter/Exit buttons
- **Background Audio** — Auto-plays after user enters (YouTube embed, no ads)
- **Live Anniversary Countdown** — Auto-calculates AKRho founding anniversary year, resets every Aug 8
- **Geolocation Display** — Detects user's city and province via browser GPS + OpenStreetMap
- **Member Login** — Auth-ready login system
- **Member Verifier** — Verify SWS chapter membership
- **News & Updates** — Latest AKRho and SWS news
- **SWS Activities Gallery** — Photo gallery of chapter events
- **What is AKRho?** — Info page with 16 founding fathers
- **Fully Responsive** — Optimized for mobile, tablet, and desktop

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite 5 |
| **Styling** | Tailwind CSS + Custom CSS |
| **Animations** | Framer Motion |
| **Routing** | React Router v6 |
| **UI Components** | shadcn/ui + Radix UI |
| **Backend/API** | Express.js (Node.js) |
| **Database** | MongoDB (optional) |
| **Deployment** | Vercel |

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- npm or yarn

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/ZETIC7Z/sws-website.git
cd sws-website

# 2. Install dependencies
npm install

# 3. (Optional) Set up environment variables
cp .env.example .env
# Edit .env and add your MongoDB URI if needed

# 4. Start development server
npm run dev
```

The site will be available at **http://localhost:8080**

### Backend (API server)
```bash
# In a separate terminal
node server.cjs
```
The API runs at **http://localhost:5000**

---

## 🏗 Build for Production

```bash
npm run build
```

Output goes to the `dist/` folder. This is what Vercel deploys.

---

## 📁 Project Structure

```
sws-website/
├── public/                  # Static assets
│   ├── stampede-logo.png    # SWS text logo
│   ├── sws-logo-badge.png   # SWS badge/seal
│   ├── sws-group-photo.jpg  # Chapter group photo
│   └── ...
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.tsx       # Navigation (mobile-responsive)
│   │   ├── Footer.tsx       # Footer
│   │   ├── DeadfrontTimer.tsx  # Anniversary countdown
│   │   ├── YouTubeAudioPlayer.tsx  # Background audio
│   │   └── ...
│   ├── pages/               # Route pages
│   │   ├── LandingPage.tsx  # Disclaimer/entry gate
│   │   ├── Index.tsx        # Home page
│   │   ├── News.tsx         # News & announcements
│   │   ├── Rankings.tsx     # Members list
│   │   ├── WhatIsAkrho.tsx  # AKRho info + founders
│   │   ├── About.tsx        # About the chapter
│   │   └── ...
│   ├── App.tsx              # Root app + routing
│   └── index.css            # Global styles
├── server.cjs               # Express API server
├── vercel.json              # Vercel deployment config
├── vite.config.ts           # Vite build config
└── package.json
```

---

## 🌐 Deploying to Vercel

### Option 1: Auto-deploy from GitHub (Recommended)
1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import `ZETIC7Z/sws-website` from GitHub
3. Set framework to **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Deploy!

### Option 2: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## ⚙️ Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string (optional) |
| `PORT` | API server port (default: 5000) |

Create a `.env` file in the root:
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
PORT=5000
```

---

## 📜 License

This project is private and intended exclusively for **Alpha Kappa Rho — Social Welfare Skeptrons (SWS)** members and authorized individuals.

---

*Developed by **ZETICUZ** for the SWS Skeptrons Chapter — Alpha Kappa Rho, Region VII*
*"Truth Conquers All" — Alpha Kappa Rho • Est. August 8, 1973*
