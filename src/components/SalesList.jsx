import { useState } from "react";

export default function SalesList({
  sales,
  onEdit,
  onDelete
}) {
  const [editingId, setEditingId] =
    useState(null);

  const [editData, setEditData] =
    useState({});

  function calculateTotalProfit() {
    return sales.reduce(
      (sum, sale) => {
        return (
          sum +
          (sale.profit || 0)
        );
      },
      0
    );
  }

  function startEdit(sale) {
    setEditingId(sale.id);

    setEditData({
      ...sale
    });
  }

  async function handleSave() {
    const salePrice =
      parseFloat(
        editData.salePrice
      ) || 0;

    const purchasePrice =
      parseFloat(
        editData.purchasePrice
      ) || 0;

    const feePercent =
      parseFloat(
        editData.feePercent
      ) || 0;

    // 🔥 Gebühren neu berechnen
    const feeAmount =
      salePrice *
      (feePercent / 100);

    const netSale =
      salePrice - feeAmount;

    const profit =
      netSale - purchasePrice;

    const updatedSale = {
      ...editData,

      salePrice,

      purchasePrice,

      feePercent,

      feeAmount,

      netSale,

      profit
    };

    await onEdit(
      editingId,
      updatedSale
    );

    setEditingId(null);
  }

  async function handleDelete(id) {
    const confirmed =
      window.confirm(
        "Diesen Verkauf wirklich löschen?"
      );

    if (!confirmed) return;

    await onDelete(id);
  }

  return (
    <div
      style={{
        marginTop: "20px"
      }}
    >
      <h2>Verkäufe</h2>

      <div
        style={{
          marginBottom: "10px"
        }}
      >
        Gesamtgewinn:{" "}
        {calculateTotalProfit().toFixed(
          2
        )}{" "}
        €
      </div>

      {sales.map((sale) => (
        <div
          key={sale.id}
          style={{
            borderBottom:
              "1px solid #ccc",

            padding: "8px"
          }}
        >
          {editingId === sale.id ? (
            <>
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
                      e.target.value
                  })
                }
                style={{
                  marginLeft: "5px"
                }}
              />

              <br />
              <br />

              {/* 🔥 Verkaufspreis */}
              Verkaufspreis:
              <input
                type="number"
                value={
                  editData.salePrice ??
                  ""
                }
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    salePrice:
                      e.target.value
                  })
                }
                style={{
                  marginLeft: "5px"
                }}
              />

              <br />
              <br />

              {/* 🔥 Gebühren */}
              Gebühren %:
              <input
                type="number"
                value={
                  editData.feePercent ??
                  5
                }
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    feePercent:
                      e.target.value
                  })
                }
                style={{
                  marginLeft: "5px",
                  width: "60px"
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
                {
                  sale.inventoryNumber
                }{" "}
                {sale.name}
              </strong>

              <br />

              {/* 🔥 Infos */}
              Zustand:{" "}
              {sale.condition ||
                "-"}{" "}
              | Sprache:{" "}
              {sale.language ||
                "-"}{" "}
              | Plattform:{" "}
              {sale.platform ||
                "Cardmarket"}

              <br />

              {/* 💰 Einkauf */}
              Einkaufspreis:{" "}
              {sale.purchasePrice !==
                null &&
              sale.purchasePrice !==
                undefined
                ? `${sale.purchasePrice.toFixed(
                    2
                  )} €`
                : "—"}

              <br />

              {/* 💸 Verkauf */}
              Verkaufspreis:{" "}
              {sale.salePrice !==
                null &&
              sale.salePrice !==
                undefined
                ? `${sale.salePrice.toFixed(
                    2
                  )} €`
                : "—"}

              <br />

              {/* 🔥 Gewinn */}
              Gewinn:{" "}
              {sale.profit !==
                null &&
              sale.profit !==
                undefined
                ? `${sale.profit.toFixed(
                    2
                  )} €`
                : "—"}

              <br />
              <br />

              {/* 🔥 Aktionen */}
              <button
                onClick={() =>
                  startEdit(sale)
                }
              >
                Bearbeiten
              </button>

              <button
                onClick={() =>
                  handleDelete(
                    sale.id
                  )
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
