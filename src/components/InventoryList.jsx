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

    setEditData({
      ...item,

      purchaseSeller:
        item.purchaseSeller ||
        "Altbestand"
    });
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
              Name:

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
                style={{
                  marginLeft: "5px"
                }}
              />

              <br />
              <br />

              {/* 🔥 Einkaufspreis */}
              Einkaufspreis:

              <input
                type="number"
                value={
                  editData.purchasePrice ??
                  ""
                }
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    purchasePrice:
                      parseFloat(
                        e.target.value
                      ) || 0
                  })
                }
                style={{
                  marginLeft: "5px"
                }}
              />

              <br />
              <br />

              {/* 🔥 Zustand */}
              Zustand:

              <select
                value={
                  editData.condition ||
                  "NM"
                }
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    condition:
                      e.target.value
                  })
                }
                style={{
                  marginLeft: "5px"
                }}
              >
                <option>NM</option>
                <option>EX</option>
                <option>GD</option>
                <option>LP</option>
                <option>PL</option>
                <option>PO</option>
              </select>

              <br />
              <br />

              {/* 🔥 Sprache */}
              Sprache:

              <select
                value={
                  editData.language ||
                  "DE"
                }
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    language:
                      e.target.value
                  })
                }
                style={{
                  marginLeft: "5px"
                }}
              >
                <option>DE</option>
                <option>EN</option>
                <option>JP</option>
                <option>KOR</option>
                <option>CHI</option>
                <option>ITA</option>
                <option>FRA</option>
              </select>

              <br />
              <br />

              {/* 🔥 Typ */}
              Art:

              <select
                value={
                  editData.type ||
                  "Einzelkarte"
                }
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    type:
                      e.target.value
                  })
                }
                style={{
                  marginLeft: "5px"
                }}
              >
                <option>
                  Einzelkarte
                </option>

                <option>
                  Slab
                </option>

                <option>
                  Sealed Promos
                </option>

                <option>
                  Booster/Box
                </option>

                <option>
                  Merch
                </option>
              </select>

              <br />
              <br />

              {/* 🔥 Lager */}
              Lager:

              <select
                value={
                  editData.storageType ||
                  "weiß"
                }
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    storageType:
                      e.target.value
                  })
                }
                style={{
                  marginLeft: "5px"
                }}
              >
                <option>weiß</option>
                <option>grau</option>
              </select>

              <br />
              <br />

              {/* 🔥 Herkunft */}
              Herkunft / Verkäufer:

              <input
                value={
                  editData.purchaseSeller ||
                  ""
                }
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    purchaseSeller:
                      e.target.value
                  })
                }
                style={{
                  marginLeft: "5px",
                  width: "250px"
                }}
              />

              <br />
              <br />

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
                style={{
                  marginLeft: "5px"
                }}
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

              {/* 🔥 Herkunft */}
              Herkunft:{" "}
              {item.purchaseSeller ||
                "Altbestand"}

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
                style={{
                  marginLeft: "5px"
                }}
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