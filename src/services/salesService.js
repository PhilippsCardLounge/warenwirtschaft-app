import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

const COLLECTION = "sales";

// ➕ Verkauf speichern
export async function addSale(sale) {
  return await addDoc(collection(db, COLLECTION), sale);
}

// 📥 Verkäufe laden
export async function getSales() {
  const snapshot = await getDocs(collection(db, COLLECTION));

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}