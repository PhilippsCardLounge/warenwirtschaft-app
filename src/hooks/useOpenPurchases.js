import { useEffect, useState } from "react";
import {
  getOpenPurchases,
  addOpenPurchase,
  deleteOpenPurchase
} from "../services/openPurchasesService";

export function useOpenPurchases() {
  const [purchases, setPurchases] = useState([]);

  async function loadPurchases() {
    const data = await getOpenPurchases();
    setPurchases(data);
  }

  async function addPurchase(purchase) {
    await addOpenPurchase(purchase);
    await loadPurchases();
  }

  async function removePurchase(id) {
    await deleteOpenPurchase(id);
    await loadPurchases();
  }

  useEffect(() => {
    loadPurchases();
  }, []);

  return {
    purchases,
    addPurchase,
    removePurchase,
    reload: loadPurchases
  };
}