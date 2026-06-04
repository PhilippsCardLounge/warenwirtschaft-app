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

// 🔍 Zahlung finden
export async function getPaymentByData(
  paymentDate,
  amount,
  seller
) {
  const q = query(
    collection(db, COLLECTION),

    where(
      "paymentDate",
      "==",
      paymentDate
    ),

    where(
      "amount",
      "==",
      amount
    ),

    where(
      "seller",
      "==",
      seller
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
    await getPaymentByData(
      paymentData.paymentDate,
      paymentData.amount,
      paymentData.seller
    );

  if (existing) {
    return existing;
  }

  await addPayment(
    paymentData
  );

  return await getPaymentByData(
    paymentData.paymentDate,
    paymentData.amount,
    paymentData.seller
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

// 🔥 Karte zu Zahlung hinzufügen
export async function addCardToPayment(
  paymentId,
  inventoryNumber
) {
  const payments =
    await getPayments();

  const payment =
    payments.find(
      (p) =>
        p.id === paymentId
    );

  if (!payment) {
    return;
  }

  const assignedCards =
    payment.assignedCards ||
    [];

  if (
    assignedCards.includes(
      inventoryNumber
    )
  ) {
    return;
  }

  await updatePayment(
    paymentId,
    {
      assignedCards: [
        ...assignedCards,
        inventoryNumber
      ]
    }
  );
}