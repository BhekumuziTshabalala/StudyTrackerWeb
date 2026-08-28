import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Progress from './pages/Progress';
import Curriculum from './pages/Curriculum';
import Settings from './pages/Settings';
import { useEffect, useState } from 'react';
import { initFirebase } from './firebase';

function App() {
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);

  useEffect(() => {
    // Check if we have credentials in localStorage
    const savedConfig = localStorage.getItem('firebase_config');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        initFirebase(config.projectId, config.appId, config.apiKey);
        setIsFirebaseInitialized(true);
      } catch (e) {
        console.error("Failed to parse firebase config", e);
      }
    }
  }, []);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen bg-slate-900 flex flex-col md:flex-row">
        {/* Navigation Bar/Rail */}
        <NavBar />
        
        {/* Main Content Area */}
        <main className="flex-1 w-full pb-20 md:pb-0 overflow-y-auto">
          <div className="max-w-screen-md mx-auto p-4 h-full">
            <Routes>
              <Route path="/" element={<Dashboard isLinked={isFirebaseInitialized} />} />
              <Route path="/calendar" element={<Calendar isLinked={isFirebaseInitialized} />} />
              <Route path="/progress" element={<Progress isLinked={isFirebaseInitialized} />} />
              <Route path="/curriculum" element={<Curriculum isLinked={isFirebaseInitialized} />} />
              <Route path="/settings" element={<Settings onLinkSuccess={() => setIsFirebaseInitialized(true)} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
