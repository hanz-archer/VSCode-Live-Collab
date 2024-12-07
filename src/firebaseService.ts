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

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

/**
 * Sync the document content with Firebase.
 * @param documentId - Unique ID for the document.
 * @param content - Content of the document.
 */
export const syncDocument = (documentId: string, content: string) => {
    const documentRef = ref(database, `documents/${documentId}/content`);
    set(documentRef, content);
};

/**
 * Update the user's cursor position in the database.
 * @param documentId - Unique ID for the document.
 * @param userId - Unique ID for the user.
 * @param position - Cursor position (line and character).
 */
export const updateCursorPosition = (documentId: string, userId: string, position: { line: number; character: number }) => {
    const cursorRef = ref(database, `documents/${documentId}/cursors/${userId}`);
    set(cursorRef, position);
};

/**
 * Listen for cursor updates from collaborators.
 * @param documentId - Unique ID for the document.
 * @param callback - Callback function to handle updated cursors.
 */
export const listenForCursorUpdates = (documentId: string, callback: (cursors: Record<string, { line: number; character: number }>) => void) => {
    const cursorRef = ref(database, `documents/${documentId}/cursors`);
    onValue(cursorRef, (snapshot) => {
        const cursors = snapshot.val() || {};
        callback(cursors); // Pass cursor positions to the callback
    });
};

/**
 * Listen for real-time document updates.
 * @param documentId - Unique ID for the document.
 * @param callback - Callback function to handle updated document content.
 */
export const listenForDocumentUpdates = (documentId: string, callback: (content: string) => void) => {
    const documentRef = ref(database, `documents/${documentId}/content`);
    onValue(documentRef, (snapshot) => {
        callback(snapshot.val()); // Pass the updated document content to the callback
    });
};
