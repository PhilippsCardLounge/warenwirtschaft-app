import {
  useEffect,
  useState
} from "react";

import {
  getSales,
  updateSale,
  deleteSale
} from "../services/salesService";

export function useSales() {
  const [sales, setSales] =
    useState([]);

  async function loadSales() {
    const data =
      await getSales();

    setSales(data);
  }

  useEffect(() => {
    loadSales();
  }, []);

  // ✏️ Verkauf bearbeiten
  async function editSale(
    id,
    updatedData
  ) {
    await updateSale(
      id,
      updatedData
    );

    await loadSales();
  }

  // 🗑️ Verkauf löschen
  async function removeSale(id) {
    await deleteSale(id);

    await loadSales();
  }

  return {
    sales,

    reloadSales: loadSales,

    editSale,

    removeSale
  };
}