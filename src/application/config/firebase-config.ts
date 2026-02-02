import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDcy6bpj1GgXl0fVrD8iAg48TCZZwvGooU",
  authDomain: "gem-signal-starter-kit.firebaseapp.com",
  projectId: "gem-signal-starter-kit",
  storageBucket: "gem-signal-starter-kit.firebasestorage.app",
  messagingSenderId: "528896603302",
  appId: "1:528896603302:web:eaf9d60df93df1d461b067",
  measurementId: "G-BRV7JQ5NJ4",
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined") return null;
  if (!app) {
    app = initializeApp(firebaseConfig);
    getAnalytics(app);
  }
  return app;
}

export function getAuthInstance(): Auth | null {
  if (typeof window === "undefined") return null;
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  if (!auth) {
    auth = getAuth(firebaseApp);
  }
  return auth;
}
