import { useEffect, useState } from "react";

import {
  getActivePurchases,
  getProcessedPurchases,
  addOpenPurchase,
  updateOpenPurchase
} from "../services/openPurchasesService";

export function useOpenPurchases() {
  const [purchases, setPurchases] =
    useState([]);

  const [
    processedPurchases,
    setProcessedPurchases
  ] = useState([]);

  async function loadPurchases() {
    const active =
      await getActivePurchases();

    const processed =
      await getProcessedPurchases();

    setPurchases(active);

    setProcessedPurchases(
      processed.sort(
        (a, b) =>
          new Date(
            b.processedAt || 0
          ) -
          new Date(
            a.processedAt || 0
          )
      )
    );
  }

  async function addPurchase(
    purchase
  ) {
    await addOpenPurchase(
      purchase
    );

    await loadPurchases();
  }

  async function removePurchase(
    id
  ) {
    await updateOpenPurchase(
      id,
      {
        status:
          "verarbeitet",

        processedAt:
          new Date().toISOString()
      }
    );

    await loadPurchases();
  }

  useEffect(() => {
    loadPurchases();
  }, []);

  return {
    purchases,
    processedPurchases,
    addPurchase,
    removePurchase,
    reload: loadPurchases
  };
}