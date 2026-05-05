import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";

const COLLECTION = "openPurchases";

// ➕ speichern
export async function addOpenPurchase(purchase) {
  return await addDoc(collection(db, COLLECTION), purchase);
}

// 📥 laden
export async function getOpenPurchases() {
  const snapshot = await getDocs(collection(db, COLLECTION));

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

// ❌ löschen (nach Zuordnung)
export async function deleteOpenPurchase(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}