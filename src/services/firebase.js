import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAMjgDLYtYxjnjo22O_h5_HcEJk36gG5j4",
  authDomain: "sicher-warenwirtschaft-pokemon.firebaseapp.com",
  projectId: "sicher-warenwirtschaft-pokemon",
  storageBucket: "sicher-warenwirtschaft-pokemon.firebasestorage.app",
  messagingSenderId: "626113468932",
  appId: "1:626113468932:web:db6a9ce3260eb58e1c7351"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);