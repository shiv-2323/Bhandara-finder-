# 🚩 Bhandara Finder (भंडारा खोजक)

Bhandara Finder is a full-featured community platform to discover, share, and manage local community feasts (Bhandaras, Langars, and Prasad distribution) in real time with interactive maps, live status, volunteer coordination, reviews, and multi-language support (Hindi & English).

---

## ✨ Features

- 📍 **Interactive Maps & Geolocation**: Discover nearby bhandaras with distance calculation and one-click Google Maps directions.
- 🕒 **Live Status Tracking**: Real-time status indicators (Live / Serving Now, Upcoming, Completed).
- 🚩 **Add & Manage Events**: Easy event submission with location, dates, timings, menu items, and organizer details.
- 🤝 **Volunteer & In-Kind Needs**: Connect volunteers with organizers to help distribute food or donate ingredients.
- ⭐ **Community Reviews & Ratings**: Share feedback, photos, and ratings for events.
- 📲 **WhatsApp Sharing & QR Codes**: One-click sharing on WhatsApp and printable QR codes for event venues.
- 🌐 **Bilingual Interface**: Native support for both Hindi (हिंदी) and English.
- ⚡ **Real-time Persistence**: Integrated with Firebase Firestore.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React Icons, Motion
- **Maps**: Leaflet / OpenStreetMap
- **Database & Storage**: Firebase Firestore
- **Deployment**: Vercel / Netlify / Cloud Run / GitHub Pages

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/bhandara-finder.git
   cd bhandara-finder
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env` (if custom Firebase keys or environment variables are needed):
   ```bash
   cp .env.example .env
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) (or the port shown in terminal) in your browser.

5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components (MapView, BhandaraCard, Modals, etc.)
│   ├── data/               # Default initial data and configurations
│   ├── lib/                # Utility functions & Firebase SDK setup
│   ├── services/           # Firestore real-time subscriptions & CRUD operations
│   ├── types.ts            # Global TypeScript interfaces & data models
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── firestore.rules         # Security rules for Firebase
└── package.json            # Project dependencies and scripts
```

---

## 📄 License

MIT License. Open for community contributions!
