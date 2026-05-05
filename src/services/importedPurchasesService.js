import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs
} from "firebase/firestore";

const COLLECTION = "importedPurchases";

export async function getImportedPurchases() {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map(doc => doc.data().key);
}

export async function addImportedPurchase(key) {
  await addDoc(collection(db, COLLECTION), { key });
}