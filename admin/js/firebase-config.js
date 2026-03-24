// Firebase Configuration
// IMPORTANT: Replace this with your actual Firebase config from Firebase Console
// See firebase-setup.md for instructions

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// Export for use in other files
window.db = db;
window.auth = auth;
window.storage = storage;

console.log('Firebase initialized successfully');
