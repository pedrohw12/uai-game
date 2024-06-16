// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVVEFRKdek950NHLLXrWu6cx-ctpzIcTY",
  authDomain: "teste-game-d304b.firebaseapp.com",
  projectId: "teste-game-d304b",
  storageBucket: "teste-game-d304b.appspot.com",
  messagingSenderId: "228721545606",
  appId: "1:228721545606:web:8af68ba5272e09f45edc07",
  measurementId: "G-TVV8KS8G8C",
};

let app;
if (typeof window !== "undefined") {                                                            
  app = initializeApp(firebaseConfig);
}

const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;

export { auth, db };
