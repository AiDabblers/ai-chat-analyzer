// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyBW6LIrsb_sUgRRojvqEicpziLycwtRIOo",
	authDomain: "ai-chat-analyzer.firebaseapp.com",
	projectId: "ai-chat-analyzer",
	storageBucket: "ai-chat-analyzer.appspot.com",
	messagingSenderId: "425481873777",
	appId: "1:425481873777:web:432ee6afae6a3732926ed0",
	measurementId: "G-EPRWJ7NCT0",
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export const db = getFirestore(app);
