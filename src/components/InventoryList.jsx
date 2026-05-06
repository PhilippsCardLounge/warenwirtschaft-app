import { useState } from "react";

export default function InventoryList({
  items,
  onEdit,
  onDelete,
  onSell
}) {
  const [editingId, setEditingId] =
    useState(null);

  const [editData, setEditData] =
    useState({});

  const [saleInputs, setSaleInputs] =
    useState({});

  function startEdit(item) {
    setEditingId(item.id);
    setEditData(item);
  }

  function handleSave() {
    // 🔥 DUPLIKAT-SCHUTZ
    const alreadyExists = items.some(
      (item) =>
        item.id !== editingId &&
        (
          item.inventoryNumber || ""
        )
          .toString()
          .trim()
          .toLowerCase() ===
        (
          editData.inventoryNumber || ""
        )
          .toString()
          .trim()
          .toLowerCase()
    );

    if (alreadyExists) {
      alert(
        `Inventar-Nummer ${editData.inventoryNumber} existiert bereits!`
      );

      return;
    }

    onEdit(editingId, editData);

    setEditingId(null);
  }

 
  return (
    <div>
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            borderBottom:
              "1px solid #ccc",
            padding: "8px"
          }}
        >
          {/* EDIT MODE */}
          {editingId === item.id ? (
            <>
              {/* 🔥 Inventar-Nummer */}
              Inventar-Nummer:
              <input
                value={
                  editData.inventoryNumber ||
                  ""
                }
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    inventoryNumber:
                      e.target.value
                  })
                }
                style={{
                  width: "120px",
                  marginLeft: "5px"
                }}
              />

              <br />
              <br />

              {/* 🔥 Name */}
              <input
                value={
                  editData.name || ""
                }
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    name:
                      e.target.value
                  })
                }
              />

              {/* 🔥 Verkaufspreis */}
              <input
                type="number"
                placeholder="Verkaufspreis"
                value={
                  editData.price ??
                  ""
                }
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    price:
                      parseFloat(
                        e.target.value
                      ) || 0
                  })
                }
              />

              <button
                onClick={
                  handleSave
                }
              >
                Speichern
              </button>

              <button
                onClick={() =>
                  setEditingId(
                    null
                  )
                }
              >
                Abbrechen
              </button>
            </>
          ) : (
            <>
              {/* 🔢 Nummer + Name */}
              <strong>
                {item.inventoryNumber !==
                  null &&
                item.inventoryNumber !==
                  undefined
                  ? `${item.inventoryNumber} `
                  : ""}

                {item.name}
              </strong>

              <br />

              {/* 🔥 WICHTIGE INFOS */}
              Zustand:{" "}
              {item.condition ||
                "-"}{" "}
              | Sprache:{" "}
              {item.language ||
                "-"}{" "}
              | Lager:{" "}
              {item.storageType ||
                item.storage ||
                item.lager ||
                "-"}

              <br />

              {/* 💰 Einkaufspreis */}
              Einkaufspreis:{" "}
              {item.purchasePrice !==
                null &&
              item.purchasePrice !==
                undefined
                ? `${item.purchasePrice.toFixed(
                    2
                  )} €`
                : "—"}

              <br />

            
              {/* 🔥 Verkaufen */}
              <input
                type="number"
                placeholder="Verkaufspreis eingeben"
                value={
                  saleInputs[
                    item.id
                  ] || ""
                }
                onChange={(e) =>
                  setSaleInputs({
                    ...saleInputs,
                    [item.id]:
                      parseFloat(
                        e.target.value
                      )
                  })
                }
              />

              <button
                onClick={() =>
                  onSell(
                    item,
                    {
                      salePrice:
                        saleInputs[
                          item.id
                        ] || 0,
                      
                        platform:
                          "Cardmarket",
                        
                        feePercent: 5
                    }
                    
                  )
                }
              >
                Verkaufen
              </button>

              <br />

              {/* Aktionen */}
              <button
                onClick={() =>
                  startEdit(item)
                }
              >
                Bearbeiten
              </button>

              <button
                onClick={() =>
                  onDelete(item.id)
                }
              >
                Löschen
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}