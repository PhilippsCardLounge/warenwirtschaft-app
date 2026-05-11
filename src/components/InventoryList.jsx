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
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto"
      }}
    >
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            background: "white",
            borderRadius: "14px",
            padding: "18px",
            marginBottom: "18px",
            boxShadow:
              "0 2px 10px rgba(0,0,0,0.08)",
            border:
              "1px solid #e5e7eb"
          }}
        >
          {/* EDIT MODE */}
          {editingId === item.id ? (
            <>
              {/* 🔥 Inventar-Nummer */}
              <div
                style={{
                  marginBottom: "12px"
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    marginBottom: "4px"
                  }}
                >
                  Inventar-Nummer
                </div>

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
                    width: "140px",
                    padding: "8px",
                    borderRadius: "8px",
                    border:
                      "1px solid #ccc"
                  }}
                />
              </div>

              {/* 🔥 Name */}
              <div
                style={{
                  marginBottom: "12px"
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    marginBottom: "4px"
                  }}
                >
                  Name
                </div>

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
                    width: "100%",
                    padding: "8px",
                    borderRadius: "8px",
                    border:
                      "1px solid #ccc"
                  }}
                />
              </div>

              {/* 🔥 Einkaufspreis */}
              <div
                style={{
                  marginBottom: "12px"
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    marginBottom: "4px"
                  }}
                >
                  Einkaufspreis
                </div>

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
                    padding: "8px",
                    borderRadius: "8px",
                    border:
                      "1px solid #ccc"
                  }}
                />
              </div>

              {/* 🔥 Zustand */}
              <div
                style={{
                  marginBottom: "12px"
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    marginBottom: "4px"
                  }}
                >
                  Zustand
                </div>

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
                    padding: "8px",
                    borderRadius: "8px",
                    border:
                      "1px solid #ccc"
                  }}
                >
                  <option>NM</option>
                  <option>EX</option>
                  <option>GD</option>
                  <option>LP</option>
                  <option>PL</option>
                  <option>PO</option>
                </select>
              </div>

              {/* 🔥 Sprache */}
              <div
                style={{
                  marginBottom: "12px"
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    marginBottom: "4px"
                  }}
                >
                  Sprache
                </div>

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
                    padding: "8px",
                    borderRadius: "8px",
                    border:
                      "1px solid #ccc"
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
              </div>

              {/* 🔥 Herkunft */}
              <div
                style={{
                  marginBottom: "16px"
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    marginBottom: "4px"
                  }}
                >
                  Herkunft /
                  Verkäufer
                </div>

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
                    width: "100%",
                    padding: "8px",
                    borderRadius: "8px",
                    border:
                      "1px solid #ccc"
                  }}
                />
              </div>

              {/* BUTTONS */}
              <div
                style={{
                  display: "flex",
                  gap: "10px"
                }}
              >
                <button
                  onClick={
                    handleSave
                  }
                  style={{
                    background:
                      "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius:
                      "8px",
                    padding:
                      "10px 16px",
                    cursor: "pointer"
                  }}
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
                    background:
                      "#e5e7eb",
                    border: "none",
                    borderRadius:
                      "8px",
                    padding:
                      "10px 16px",
                    cursor: "pointer"
                  }}
                >
                  Abbrechen
                </button>
              </div>
            </>
          ) : (
            <>
              {/* 🔢 Nummer + Name */}
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: "700",
                  marginBottom: "10px",
                  color: "#111827"
                }}
              >
                {item.inventoryNumber !==
                  null &&
                item.inventoryNumber !==
                  undefined
                  ? `${item.inventoryNumber} `
                  : ""}

                {item.name}
              </div>

              {/* 🔥 Infos */}
              <div
                style={{
                  color: "#4b5563",
                  marginBottom: "8px"
                }}
              >
                Zustand:{" "}
                {item.condition ||
                  "-"}{" "}
                • Sprache:{" "}
                {item.language ||
                  "-"}{" "}
                • Lager:{" "}
                {item.storageType ||
                  item.storage ||
                  item.lager ||
                  "-"}
              </div>

              {/* 🔥 Herkunft */}
              <div
                style={{
                  marginBottom: "8px",
                  color: "#4b5563"
                }}
              >
                Herkunft:{" "}
                {item.purchaseSeller ||
                  "Altbestand"}
              </div>

              {/* 💰 Einkaufspreis */}
              <div
                style={{
                  marginBottom: "14px",
                  fontWeight: "600"
                }}
              >
                Einkaufspreis:{" "}
                {item.purchasePrice !==
                  null &&
                item.purchasePrice !==
                  undefined
                  ? `${item.purchasePrice.toFixed(
                      2
                    )} €`
                  : "—"}
              </div>

              {/* 🔥 Verkauf */}
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginBottom: "14px"
                }}
              >
                <input
                  type="number"
                  placeholder="Verkaufspreis"
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
                  style={{
                    padding: "10px",
                    borderRadius:
                      "8px",
                    border:
                      "1px solid #ccc",
                    minWidth:
                      "180px"
                  }}
                />

                <button
                  onClick={() => {
                    const salePrice =
                      saleInputs[
                        item.id
                      ];

                    if (
                      salePrice ===
                        undefined ||
                      salePrice ===
                        null ||
                      isNaN(
                        salePrice
                      )
                    ) {
                      alert(
                        "Bitte Verkaufspreis eingeben"
                      );

                      return;
                    }

                    if (
                      salePrice ===
                      0
                    ) {
                      const confirmed =
                        window.confirm(
                          "Karte wirklich für 0 € verkaufen?"
                        );

                      if (
                        !confirmed
                      ) {
                        return;
                      }
                    }

                    onSell(
                      item,
                      {
                        salePrice,

                        platform:
                          "Cardmarket",

                        feePercent: 5
                      }
                    );
                  }}
                  style={{
                    background:
                      "#16a34a",
                    color: "white",
                    border: "none",
                    borderRadius:
                      "8px",
                    padding:
                      "10px 16px",
                    cursor: "pointer"
                  }}
                >
                  Verkaufen
                </button>
              </div>

              {/* Aktionen */}
              <div
                style={{
                  display: "flex",
                  gap: "10px"
                }}
              >
                <button
                  onClick={() =>
                    startEdit(item)
                  }
                  style={{
                    background:
                      "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius:
                      "8px",
                    padding:
                      "10px 16px",
                    cursor: "pointer"
                  }}
                >
                  Bearbeiten
                </button>

                <button
                  onClick={() =>
                    onDelete(item.id)
                  }
                  style={{
                    background:
                      "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius:
                      "8px",
                    padding:
                      "10px 16px",
                    cursor: "pointer"
                  }}
                >
                  Löschen
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}