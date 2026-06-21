import { db } from "./firebase";

import {
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  deleteDoc
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

// 🧨 COLLECTION LEEREN
async function clearCollection(colName) {
  const snapshot = await getDocs(
    collection(db, colName)
  );

  for (const docSnap of snapshot.docs) {
    await deleteDoc(
      doc(db, colName, docSnap.id)
    );
  }
}

// ♻️ RESTORE
export async function importBackup(data) {
  // 1️⃣ alles löschen
  for (const col of COLLECTIONS) {
    await clearCollection(col);
  }

  // 2️⃣ neu schreiben
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