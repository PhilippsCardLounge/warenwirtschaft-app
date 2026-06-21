import { db } from "./firebase";

import {
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc
} from "firebase/firestore";

const COLLECTIONS = [
  "inventory",
  "sales",
  "openPurchases",
  "settings",
  "importedPurchases",
  "payments",
  "assignments"
];

// 📦 EXPORT
export async function exportBackup() {
  const backup = {};

  for (const col of COLLECTIONS) {
    const snapshot = await getDocs(
      collection(db, col)
    );

    backup[col] = snapshot.docs.map(
      (docItem) => ({
        id: docItem.id,
        ...docItem.data()
      })
    );
  }

  return backup;
}

// ♻️ SICHERER RESTORE
// Löscht NICHT vorher, sondern stellt Dokumente mit gleicher ID wieder her.
export async function importBackup(data) {
  for (const col of COLLECTIONS) {
    if (!data[col]) continue;

    for (const item of data[col]) {
      const { id, ...rest } = item;

      if (id) {
        await setDoc(
          doc(db, col, id),
          rest
        );
      } else {
        await addDoc(
          collection(db, col),
          rest
        );
      }
    }
  }
}