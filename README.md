# Dolphin Web

Dolphin Web is a responsive, React-based companion web application designed for tracking study progress, managing daily curriculums, and syncing data across devices. It connects directly to Firebase/Firestore to display daily tasks, learning modules, and overall progress.

## ✨ Features

- **Daily Dashboard**: View today's focus, track completed topics, and visualize progress with a daily goal ring.
- **Cross-Device Syncing**: Seamlessly syncs with your mobile device using Firebase.
- **QR Code Device Pairing**: Easily link your desktop web app to your mobile app by scanning a QR code—no need to manually type Firebase credentials.
- **Responsive Navigation**: Features a bottom navigation bar for mobile devices and a side rail for desktop screens.
- **Real-time Updates**: Uses Firestore snapshot listeners to instantly update task completion status across all linked devices.

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend/Database**: [Firebase](https://firebase.google.com/) (Firestore)
- **Icons**: [Lucide React](https://lucide.dev/)
- **QR Code**: `qrcode.react` (generation) & `jsqr` (scanning)
- **Date Formatting**: `date-fns`

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- A Firebase project with Firestore enabled.

### Installation

1. Clone the repository or navigate to the project directory:
   ```bash
   cd DolphinWeb
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

## 🔗 Firebase Configuration & Device Pairing

To access your study data, Dolphin Web needs to be linked to your Firebase project. You can do this in two ways via the **Settings** page:

### Method 1: QR Code Pairing (Recommended)
This method is used to instantly link your desktop browser to your mobile app.
1. Open the Dolphin app on your **Mobile Device** (screen width < 768px). If credentials are saved, it will generate a QR Code.
2. Open Dolphin Web on your **Desktop Browser**, go to **Settings**, and click **"Scan QR Code from Phone"**.
3. Point your webcam at the mobile screen. Once scanned, the app will automatically configure Firebase and link your account.

### Method 2: Manual Configuration
1. Go to the **Settings** page.
2. Enter your public Firebase credentials:
   - `Project ID`
   - `App ID`
   - `Web API Key`
3. Click **Save & Link**.

*Note: The app stores these credentials locally in your browser's `localStorage` (`firebase_config`). Actual data access is secured by your Firestore security rules.*

## 📁 Project Structure

```text
src/
├── components/       # Reusable UI components (NavBar, TaskCard, PlaceholderPage)
├── hooks/            # Custom React hooks (useStudyData)
├── pages/            # Main route views (Dashboard, Settings, Calendar, etc.)
├── styles/           # Global CSS and Tailwind directives
├── App.jsx           # Main application component & Routing setup
├── firebase.js       # Firebase initialization and instance management
└── main.jsx          # React entry point
```

## 📜 Available Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Bundles the app into static files for production (outputs to `/dist`).
- `npm run preview`: Bootstraps a local static web server to serve the files from `/dist` for previewing the production build.
