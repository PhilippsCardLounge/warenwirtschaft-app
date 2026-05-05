import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

const COLLECTION = "inventory";

// ➕ Neue Karte hinzufügen
export async function addItem(item) {
  const safeItem = {
    name: item.name || "",
    price: item.price ?? 0, // Verkaufspreis
    purchasePrice: item.purchasePrice ?? null, // Einkaufspreis
    condition: item.condition || "NM",
    language: item.language || "DE",
    purchaseDate: item.purchaseDate || "",
    purchaseSeller: item.purchaseSeller || "",
    inventoryNumber: item.inventoryNumber ?? null, // 🔥 wichtig!

    // 🔥 NEU (entscheidend!)
    type: item.type || "Einzelkarte",
    storageType: item.storageType || "weiß"
  };

  console.log("SAVE ITEM:", safeItem); // Debug

  return await addDoc(collection(db, COLLECTION), safeItem);
}

// 📥 Alle Karten laden
export async function getItems() {
  const snapshot = await getDocs(collection(db, COLLECTION));

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();

    return {
      id: docSnap.id,
      ...data
    };
  });
}

// ✏️ Karte bearbeiten
export async function updateItem(id, updatedData) {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, updatedData);
}

// 🗑️ Karte löschen
export async function deleteItem(id) {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
}