import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBJAxuUY7IS16EIC9OCq5rdqhWibbDnTMw',
  authDomain: 'akj-web-aa42f.firebaseapp.com',
  projectId: 'akj-web-aa42f',
  storageBucket: 'akj-web-aa42f.firebasestorage.app',
  messagingSenderId: '71532437691',
  appId: '1:71532437691:web:21ea16e5c97c55c669899e',
  measurementId: 'G-NN75FQJ2P4',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Analytics safely in browser environments
export let analytics = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // Ignore analytics init errors in local/offline environments
    });
}

