import { useEffect, useState } from "react";

import {
  addItem,
  getItems,
  updateItem,
  deleteItem
} from "../services/inventoryService";

import {
  addSale
} from "../services/salesService";

import {
  getInventorySettings,
  generateInventoryNumber,
  incrementInventoryNumber
} from "../services/settingsService";

export function useInventory() {
  const [items, setItems] = useState([]);

  const [
    filteredItems,
    setFilteredItems
  ] = useState([]);

  const [filters, setFilters] =
    useState({
      search: "",
      condition: "",
      language: ""
    });

  const [settings, setSettings] =
    useState(null);

  // 🔄 Daten laden
  async function loadItems() {
    const data = await getItems();
    setItems(data);
  }

  async function loadSettings() {
    const data =
      await getInventorySettings();

    setSettings(data);
  }

  useEffect(() => {
    loadItems();
    loadSettings();
  }, []);

  // ➕ Neue Karte erstellen
  async function createItem(data) {
    if (!settings) {
      console.error(
        "Settings noch nicht geladen"
      );

      return;
    }

    // 🔥 Manuelle Nummer erlauben
    const inventoryNumber =
      data.inventoryNumber ||
      generateInventoryNumber(
        data.type,
        settings
      );

    // 🔥 DUPLIKAT-SCHUTZ
    const alreadyExists =
      items.some(
        (item) =>
          (
            item.inventoryNumber ||
            ""
          )
            .toString()
            .trim()
            .toLowerCase() ===
          inventoryNumber
            .toString()
            .trim()
            .toLowerCase()
      );

    if (alreadyExists) {
      alert(
        `Inventar-Nummer ${inventoryNumber} existiert bereits!`
      );

      return;
    }

    const newItem = {
      ...data,
      inventoryNumber
    };

    await addItem(newItem);

    // 🔥 Counter intelligent erhöhen
    const updatedSettings =
      await incrementInventoryNumber(
        data.type,
        settings,
        inventoryNumber
      );

    setSettings(updatedSettings);

    await loadItems();
  }

  // ✏️ Bearbeiten
  async function editItem(
    id,
    updatedData
  ) {
    await updateItem(
      id,
      updatedData
    );

    await loadItems();
  }

  // 🗑️ Löschen
  async function removeItem(id) {
    await deleteItem(id);

    await loadItems();
  }

  // 💸 Verkaufen
  async function sellItem(
    item,
    saleData
  ) {
    const salePrice =
      parseFloat(
        saleData.salePrice
      ) || 0;

    const feePercent =
      parseFloat(
        saleData.feePercent
      ) || 0;

    const feeAmount =
      salePrice *
      (feePercent / 100);

    const netSale =
      salePrice - feeAmount;

    const purchasePrice =
      parseFloat(
        item.purchasePrice
      ) || 0;

    const netProfit =
      netSale - purchasePrice;

    // 🔥 Verkauf speichern
    await addSale({
      inventoryNumber:
        item.inventoryNumber,

      name: item.name,

      type: item.type || "",

      condition:
        item.condition || "",

      language:
        item.language || "",

      storageType:
        item.storageType || "",

      purchasePrice,

      salePrice,

      feePercent,

      feeAmount,

      netSale,

      profit: netProfit,

      platform:
        saleData.platform ||
        "Cardmarket",

      date:
        new Date().toISOString()
    });

    // 🔥 Karte aus Inventar entfernen
    await deleteItem(item.id);

    // 🔄 Inventar neu laden
    await loadItems();
  }

  // 🔍 FILTER + 🔥 SORTIERUNG
  useEffect(() => {
    const filtered = items.filter(
      (item) => {
        const searchTerm =
          (filters.search || "")
            .toString()
            .toLowerCase()
            .replace("#", "")
            .trim();

        const nameMatch =
          (
            item.name || ""
          )
            .toLowerCase()
            .includes(searchTerm);

        const numberMatch =
          (
            item.inventoryNumber ||
            ""
          )
            .toString()
            .toLowerCase()
            .replace("#", "")
            .includes(searchTerm);

        const conditionMatch =
          !filters.condition ||
          item.condition ===
            filters.condition;

        const languageMatch =
          !filters.language ||
          item.language ===
            filters.language;

        return (
          (
            nameMatch ||
            numberMatch
          ) &&
          conditionMatch &&
          languageMatch
        );
      }
    );

    // 🔥 SORTIERUNG
    const sorted =
      filtered.sort((a, b) => {
        function parseNumber(
          item
        ) {
          const num =
            (
              item.inventoryNumber ||
              ""
            ).toString();

          // Einzelkarten (#0001)
          if (
            num.startsWith("#")
          ) {
            return {
              group: 0,

              value:
                parseInt(
                  num.replace(
                    "#",
                    ""
                  ),
                  10
                ) || 0
            };
          }

          // Slab (G1)
          if (
            num.startsWith("G")
          ) {
            return {
              group: 1,

              value:
                parseInt(
                  num.replace(
                    "G",
                    ""
                  ),
                  10
                ) || 0
            };
          }

          // Sealed Promos (S1)
          if (
            num.startsWith("S")
          ) {
            return {
              group: 2,

              value:
                parseInt(
                  num.replace(
                    "S",
                    ""
                  ),
                  10
                ) || 0
            };
          }

          // Booster/Box (B1)
          if (
            num.startsWith("B")
          ) {
            return {
              group: 3,

              value:
                parseInt(
                  num.replace(
                    "B",
                    ""
                  ),
                  10
                ) || 0
            };
          }

          // Merch (M1)
          if (
            num.startsWith("M")
          ) {
            return {
              group: 4,

              value:
                parseInt(
                  num.replace(
                    "M",
                    ""
                  ),
                  10
                ) || 0
            };
          }

          return {
            group: 99,
            value: 0
          };
        }

        const aParsed =
          parseNumber(a);

        const bParsed =
          parseNumber(b);

        // zuerst Gruppe
        if (
          aParsed.group !==
          bParsed.group
        ) {
          return (
            aParsed.group -
            bParsed.group
          );
        }

        // dann Nummer innerhalb der Gruppe
        return (
          bParsed.value -
          aParsed.value
        );
      });

    setFilteredItems([
      ...sorted
    ]);
  }, [items, filters]);

  return {
    items: filteredItems,

    createItem,

    editItem,

    removeItem,

    sellItem,

    setFilters
  };
}