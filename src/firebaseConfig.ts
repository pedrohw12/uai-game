import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAVVEFRKdek950NHLLXrWu6cx-ctpzIcTY",
    authDomain: "teste-game-d304b.firebaseapp.com",
    projectId: "teste-game-d304b",
    storageBucket: "teste-game-d304b.appspot.com",
    messagingSenderId: "228721545606",
    appId: "1:228721545606:web:8af68ba5272e09f45edc07",
    measurementId: "G-TVV8KS8G8C"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app)

export { auth, db }