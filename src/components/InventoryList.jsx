import { useState } from "react";

export default function InventoryList({ items, onEdit, onDelete, onSell }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [saleInputs, setSaleInputs] = useState({});

  function startEdit(item) {
    setEditingId(item.id);
    setEditData(item);
  }

  function handleSave() {
    onEdit(editingId, editData);
    setEditingId(null);
  }

  function calculateProfit(item) {
    if (
      item.purchasePrice === null ||
      item.purchasePrice === undefined ||
      item.price === null ||
      item.price === undefined
    ) {
      return null;
    }

    return item.price - item.purchasePrice;
  }

  return (
    <div>
      {items.map((item) => (
        <div
          key={item.id}
          style={{ borderBottom: "1px solid #ccc", padding: "8px" }}
        >
          {/* EDIT MODE */}
          {editingId === item.id ? (
            <>
              <input
                value={editData.name || ""}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Verkaufspreis"
                value={editData.price ?? ""}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
              />

              <button onClick={handleSave}>Speichern</button>
              <button onClick={() => setEditingId(null)}>
                Abbrechen
              </button>
            </>
          ) : (
            <>
              {/* 🔢 Nummer + Name */}
              <strong>
                {item.inventoryNumber !== null &&
                item.inventoryNumber !== undefined
                  ? `${item.inventoryNumber} `
                  : ""}
                {item.name}
              </strong>
              <br />

              {/* 🔥 WICHTIGE INFOS */}
              Zustand: {item.condition || "-"} | Sprache: {item.language || "-"} | Lager: {item.storageType || item.storage || item.lager || "-"}
              <br />

              {/* 💰 Einkaufspreis */}
              Einkaufspreis:{" "}
              {item.purchasePrice !== null &&
              item.purchasePrice !== undefined
                ? `${item.purchasePrice.toFixed(2)} €`
                : "—"}
              <br />

              {/* 🔥 Verkaufen */}
              <input
                type="number"
                placeholder="Verkaufspreis eingeben"
                value={saleInputs[item.id] || ""}
                onChange={(e) =>
                  setSaleInputs({
                    ...saleInputs,
                    [item.id]: parseFloat(e.target.value),
                  })
                }
              />

              <button
                onClick={() =>
                  onSell(item, saleInputs[item.id] || 0)
                }
              >
                Verkaufen
              </button>

              <br />

              {/* Aktionen */}
              <button onClick={() => startEdit(item)}>
                Bearbeiten
              </button>
              <button onClick={() => onDelete(item.id)}>
                Löschen
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}