// Import the necessary functions from the Firebase SDK
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyB__zPNABruaEeI5VRA9X_p39jc_tOAOfo",
  authDomain: "live-collab-25940.firebaseapp.com",
  databaseURL: "https://live-collab-25940-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "live-collab-25940",
  storageBucket: "live-collab-25940.firebasestorage.app",
  messagingSenderId: "1071886686048",
  appId: "1:1071886686048:web:8f1957b8d10bfaa01db005",
  measurementId: "G-ZSN9YYJ21Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database
const database = getDatabase(app);

export const syncDocument = (documentId: string, content: string) => {
  const documentRef = ref(database, `documents/${documentId}`);

  // Set the initial content
  set(documentRef, content);

  // Listen for real-time updates
  onValue(documentRef, (snapshot) => {
    const updatedContent = snapshot.val();
    console.log(updatedContent); // Handle the updated content (e.g., update your document)
  });
};
