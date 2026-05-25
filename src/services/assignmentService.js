import { db } from "./firebase";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where
} from "firebase/firestore";

const COLLECTION =
  "assignments";

// ➕ Neue Zuordnung erstellen
export async function addAssignment(
  assignment
) {
  return await addDoc(
    collection(db, COLLECTION),
    assignment
  );
}

// 📥 Alle Zuordnungen laden
export async function getAssignments() {
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

// ✏️ Zuordnung aktualisieren
export async function updateAssignment(
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