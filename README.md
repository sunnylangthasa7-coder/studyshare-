# StudyShare - Premium Study Notes & PDF Marketplace

StudyShare is a high-end, responsive web platform designed for students and educators to upload, categorize, buy, and sell educational notes and PDF study guides. 

The application is built using **React, Vite, and Vanilla CSS** with a premium dark-mode glassmorphic theme.

---

## ✨ Key Features

1. **Category & Metadata Filtering**:
   - Filter listings by specific subjects (Computer Science, Chemistry, Law, Mathematics, Physics, etc.).
   - Search notes by title, description, department, or university (e.g. Stanford, MIT, Harvard, UC Berkeley).
   - Price range selector ($0 to $100) and sorting controls (Top Rated, Low to High, High to Low, Newest).

2. **Automated Transaction Routing**:
   - Strict commission mechanics: **20% Platform Fee** is deducted from each purchase, and **80% Net Payout** is routed directly to the seller's wallet.
   - Buyers are presented with a detailed, transparent checkout summary before final order confirmation.

3. **Integrated Cloud Storage**:
   - Direct connection panel in **Cloud Settings** supporting **Supabase Storage**.
   - Note files upload directly from the seller's browser into your cloud storage bucket, ensuring zero local space is used on your personal computer.
   - Fallback simulation allows full testing using temporary local Object URLs when cloud keys are not configured.

4. **Dedicated Portals**:
   - **Buyer Portal**: Browse notes, read page-1 previews (locked preview blurred), deposit mock money, purchase outlines, access downloads, and write rating reviews.
   - **Seller Hub**: Review sales count, net earnings, platform cuts, upload files, and manage live listings tables.

---

## 🛠️ Getting Started

### 1. Installation
Clone the repository and install all dependencies:
```bash
npm install
```

### 2. Launch Development Server
Start the local hot-reloading development server:
```bash
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser to view the application.

---

## 📁 Codebase Layout

- `src/main.jsx` - Application bootstrap and entrypoint.
- `src/App.jsx` - Page layout container, simple client-side router, and HUD toast notification overlays.
- `src/index.css` - Custom styling library (glassmorphism tokens, backdrop blurs, glow variables, float animations, and responsive media layout queries).
- `src/context/AppContext.jsx` - Main state manager containing initial seed notes, user balances, registration routing, and the 20% platform fee transaction logic.
- `src/utils/storage.js` - Connection helpers for uploading documents to Supabase Storage client-side.
- `src/components/`
  - `Navbar.jsx` - Navigation bar with profile details, wallet balance tracking, and mock fund deposit forms.
  - `Hero.jsx` - Landing banner with quick tags, search input, and global platform counters.
  - `NoteCard.jsx` - Interactive card representing a listing.
  - `GlassModal.jsx` - Reusable overlay dialog box wrapper.
- `src/pages/`
  - `Marketplace.jsx` - Notes catalog search and sidebar filter panels.
  - `NoteDetails.jsx` - Document preview page with blur overlays, checkout summary, and reviews submission.
  - `SellerDashboard.jsx` - Stats panel and cloud note uploader.
  - `BuyerDashboard.jsx` - Buyer purchases shelf with instant download buttons.
  - `Settings.jsx` - Cloud storage setup panel and global marketplace analytics stats.

---

## ☁️ Connecting Your 1TB Cloud Storage (Supabase)

To link StudyShare to your Supabase storage bucket:
1. Create a free project at **[Supabase](https://supabase.com)**.
2. Go to **Storage** and create a new **Public Bucket** (e.g. `study-notes-bucket`).
3. In the Supabase project dashboard, navigate to **Project Settings > API** and copy your **Project URL** and **anon public Key**.
4. Launch StudyShare locally, click **Cloud Settings** in the navbar, and enter these values.
5. Click **Test Connection** to confirm connection.
6. Click **Save Configuration**. All subsequent file uploads will go directly to your Supabase cloud bucket!
