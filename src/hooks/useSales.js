import {
  useEffect,
  useState
} from "react";

import {
  getSales,
  updateSale,
  deleteSale
} from "../services/salesService";

import {
  addItem
} from "../services/inventoryService";

import {
  getSoldAssignmentByInventoryNumber,
  updateAssignment
} from "../services/assignmentService";

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
  // 🔥 Karte zurück ins Inventar
  async function removeSale(id) {
    const sale = sales.find(
      (s) => s.id === id
    );

    if (!sale) return;

    // 🔥 Karte zurücklegen
    await addItem({
      inventoryNumber:
        sale.inventoryNumber,

      name: sale.name,

      type:
        sale.type ||
        "Einzelkarte",

      condition:
        sale.condition ||
        "NM",

      language:
        sale.language ||
        "DE",

      storageType:
        sale.storageType ||
        "weiß",

      purchasePrice:
        sale.purchasePrice || 0,

      purchaseSeller:
        sale.purchaseSeller ||
        "Altbestand",

      price: 0
    });

    // 🔥 Verkauf löschen
    await deleteSale(id);

    // 🔥 Passendes verkauftes Assignment finden
    const assignment =
      await getSoldAssignmentByInventoryNumber(
        sale.inventoryNumber
      );

    // 🔥 Assignment zurücksetzen
    if (assignment) {
      await updateAssignment(
        assignment.id,
        {
          status:
            "im Inventar",

          saleDate: null,

          salePrice: null
        }
      );
    }

    await loadSales();
  }

  return {
    sales,

    reloadSales: loadSales,

    editSale,

    removeSale
  };
}