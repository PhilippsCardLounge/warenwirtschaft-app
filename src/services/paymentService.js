import { db } from "./firebase";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc
} from "firebase/firestore";

const COLLECTION =
  "payments";

// ➕ Neue Zahlung
export async function addPayment(
  payment
) {
  return await addDoc(
    collection(db, COLLECTION),
    payment
  );
}

// 📥 Alle Zahlungen laden
export async function getPayments() {
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

// 🔍 Zahlung anhand openPurchase finden
export async function getPaymentBySourcePurchaseId(
  sourcePurchaseId
) {
  const q = query(
    collection(db, COLLECTION),

    where(
      "sourcePurchaseId",
      "==",
      sourcePurchaseId
    )
  );

  const snapshot =
    await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const docItem =
    snapshot.docs[0];

  return {
    id: docItem.id,
    ...docItem.data()
  };
}

// 🔥 Nur erstellen wenn nicht vorhanden
export async function createPaymentIfMissing(
  paymentData
) {
  const existing =
    await getPaymentBySourcePurchaseId(
      paymentData.sourcePurchaseId
    );

  if (existing) {
    return existing;
  }

  await addPayment(
    paymentData
  );

  return await getPaymentBySourcePurchaseId(
    paymentData.sourcePurchaseId
  );
}

// ✏️ Zahlung aktualisieren
export async function updatePayment(
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