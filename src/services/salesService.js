import { db } from "./firebase";

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

const COLLECTION = "sales";

// ➕ Verkauf speichern
export async function addSale(sale) {
  return await addDoc(
    collection(db, COLLECTION),
    sale
  );
}

// 📥 Verkäufe laden
export async function getSales() {
  const snapshot =
    await getDocs(
      collection(db, COLLECTION)
    );

  return snapshot.docs.map(
    (doc) => ({
      id: doc.id,
      ...doc.data()
    })
  );
}

// ✏️ Verkauf bearbeiten
export async function updateSale(
  id,
  updatedData
) {
  const ref = doc(
    db,
    COLLECTION,
    id
  );

  await updateDoc(
    ref,
    updatedData
  );
}

// 🗑️ Verkauf löschen
export async function deleteSale(id) {
  const ref = doc(
    db,
    COLLECTION,
    id
  );

  await deleteDoc(ref);
}