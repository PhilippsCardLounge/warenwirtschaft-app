import { db } from "./firebase";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";

const COLLECTION =
  "openPurchases";

// ➕ speichern
export async function addOpenPurchase(
  purchase
) {
  return await addDoc(
    collection(db, COLLECTION),
    {
      status: "offen",
      ...purchase
    }
  );
}

// 📥 alle laden
export async function getOpenPurchases() {
  const snapshot =
    await getDocs(
      collection(db, COLLECTION)
    );

  return snapshot.docs.map(
    (docItem) => ({
      id: docItem.id,
      ...docItem.data()
    })
  );
}

// 📥 nur offene laden
export async function getActivePurchases() {
  const purchases =
    await getOpenPurchases();

  return purchases.filter(
    (purchase) =>
      purchase.status !==
      "verarbeitet"
  );
}

// 📥 nur verarbeitete laden
export async function getProcessedPurchases() {
  const purchases =
    await getOpenPurchases();

  return purchases.filter(
    (purchase) =>
      purchase.status ===
      "verarbeitet"
  );
}

// ✏️ aktualisieren
export async function updateOpenPurchase(
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

// ❌ löschen
export async function deleteOpenPurchase(
  id
) {
  await deleteDoc(
    doc(
      db,
      COLLECTION,
      id
    )
  );
}