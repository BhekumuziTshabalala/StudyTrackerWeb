import { initializeApp, getApps, deleteApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

let db = null;

export const initFirebase = (projectId, appId, apiKey) => {
  const firebaseConfig = {
    projectId,
    appId,
    apiKey,
  };

  const apps = getApps();
  if (apps.length > 0) {
    const app = apps[0];
    if (app.options.projectId !== projectId || app.options.apiKey !== apiKey) {
        deleteApp(app);
        const newApp = initializeApp(firebaseConfig);
        db = getFirestore(newApp);
    } else {
        db = getFirestore(app);
    }
  } else {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }

  // Save to local storage
  localStorage.setItem('firebase_config', JSON.stringify(firebaseConfig));
  return db;
};

export const getDb = () => {
  if (!db) {
    throw new Error("Firebase is not initialized yet");
  }
  return db;
};
