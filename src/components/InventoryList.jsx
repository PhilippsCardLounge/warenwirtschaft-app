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

  const [
    adjustmentItemId,
    setAdjustmentItemId
  ] = useState(null);

  const [
    adjustmentData,
    setAdjustmentData
  ] = useState({
    amount: "",
    reason: "Versand"
  });

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
              "1px solid #e5e7eb",
            textAlign: "center"
          }}
        >
          {editingId === item.id ? (
            <>
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

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent:
                    "center"
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

              <div
                style={{
                  marginBottom: "14px",
                  lineHeight: "1.8"
                }}
              >
                <div>
                  <strong>
                    Kaufpreis:
                  </strong>{" "}
                  {Number(
                    item.purchasePrice || 0
                  ).toFixed(2)}{" "}
                  €
                </div>

                <div>
                  <strong>
                    Anpassungen:
                  </strong>{" "}
                  {(item.costAdjustments || [])
                    .reduce(
                      (
                        sum,
                        adjustment
                      ) => {
                        if (
                          adjustment.type ===
                          "refund"
                        ) {
                          return (
                            sum -
                            Number(
                              adjustment.amount ||
                                0
                            )
                          );
                        }

                        return (
                          sum +
                          Number(
                            adjustment.amount ||
                              0
                          )
                        );
                      },
                      0
                    )
                    .toFixed(2)}{" "}
                  €
                </div>

                {(item.costAdjustments || [])
                  .length > 0 && (
                  <div
                    style={{
                      marginTop: "8px",
                      marginLeft: "12px",
                      fontSize: "14px",
                      color: "#4b5563"
                    }}
                  >
                    {item.costAdjustments.map(
                      (adjustment, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "8px",
                            alignItems: "center"
                          }}
                        >
                          <span>
                            {adjustment.date
                              ? new Date(
                                  adjustment.date
                                ).toLocaleDateString(
                                  "de-DE"
                                )
                              : "-"}
                          </span>

                          <span>
                            {adjustment.type ===
                            "refund"
                              ? "-"
                              : "+"}
                            {Number(
                              adjustment.amount
                            ).toFixed(2)}{" "}
                            € — {adjustment.reason}
                          </span>

                          <button
                            onClick={() => {
                              const confirmed =
                                window.confirm(
                                  "Diese Anpassung wirklich löschen?"
                                );

                              if (!confirmed) {
                                return;
                              }

                              const updatedAdjustments =
                                (
                                  item.costAdjustments ||
                                  []
                                ).filter(
                                  (_, adjustmentIndex) =>
                                    adjustmentIndex !==
                                    index
                                );

                              onEdit(item.id, {
                                ...item,
                                costAdjustments:
                                  updatedAdjustments
                              });
                            }}
                            style={{
                              background: "#dc2626",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              padding: "2px 6px",
                              cursor: "pointer",
                              fontSize: "12px"
                            }}
                          >
                            Löschen
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}

                <div
                  style={{
                    fontWeight:
                      "700"
                  }}
                >
                  Gesamt-EK:{" "}
                  {(
                    Number(
                      item.purchasePrice || 0
                    ) +
                    (item.costAdjustments ||
                      []
                    ).reduce(
                      (
                        sum,
                        adjustment
                      ) => {
                        if (
                          adjustment.type ===
                          "refund"
                        ) {
                          return (
                            sum -
                            Number(
                              adjustment.amount ||
                                0
                            )
                          );
                        }

                        return (
                          sum +
                          Number(
                            adjustment.amount ||
                              0
                          )
                        );
                      },
                      0
                    )
                  ).toFixed(2)}{" "}
                  €
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  justifyContent:
                    "center",
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
                      salePrice === 0
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

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent:
                    "center"
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
                    setAdjustmentItemId(
                      adjustmentItemId ===
                        item.id
                        ? null
                        : item.id
                    )
                  }
                  style={{
                    background:
                      "#f59e0b",
                    color: "white",
                    border: "none",
                    borderRadius:
                      "8px",
                    padding:
                      "10px 16px",
                    cursor: "pointer"
                  }}
                >
                  Zusatzkosten
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

              {adjustmentItemId ===
                item.id && (
                <div
                  style={{
                    marginTop:
                      "14px",
                    padding:
                      "14px",
                    border:
                      "1px solid #f59e0b",
                    borderRadius:
                      "10px",
                    background:
                      "#fffbeb"
                  }}
                >
                  <h4
                    style={{
                      marginTop: 0
                    }}
                  >
                    Zusatzkosten /
                    Gutschrift
                  </h4>

                  <input
                    type="number"
                    placeholder="Betrag"
                    value={
                      adjustmentData.amount
                    }
                    onChange={(e) =>
                      setAdjustmentData({
                        ...adjustmentData,
                        amount:
                          e.target.value
                      })
                    }
                    style={{
                      width:
                        "120px",
                      padding:
                        "8px",
                      marginRight:
                        "10px"
                    }}
                  />

                  <select
                    value={
                      adjustmentData.reason
                    }
                    onChange={(e) =>
                      setAdjustmentData({
                        ...adjustmentData,
                        reason:
                          e.target.value
                      })
                    }
                    style={{
                      padding:
                        "8px",
                      marginRight:
                        "10px"
                    }}
                  >
                    <optgroup label="Kosten">
                      <option value="Versand">
                        Versand
                      </option>
                      <option value="Versicherter Versand">
                        Versicherter
                        Versand
                      </option>
                      <option value="Zoll">
                        Zoll
                      </option>
                      <option value="Gebühren">
                        Gebühren
                      </option>
                      <option value="Sonstiges">
                        Sonstiges
                      </option>
                    </optgroup>

                    <optgroup label="Gutschriften">
                      <option value="Erstattung">
                        Erstattung
                      </option>
                      <option value="Rabatt">
                        Rabatt
                      </option>
                      <option value="Preisnachlass">
                        Preisnachlass
                      </option>
                    </optgroup>
                  </select>

                  <button
                    onClick={() => {
                      const amount = Number(
                        adjustmentData.amount
                      );

                      if (
                        !amount ||
                        amount <= 0
                      ) {
                        alert(
                          "Bitte einen gültigen Betrag eingeben."
                        );

                        return;
                      }

                      const refundReasons = [
                        "Erstattung",
                        "Rabatt",
                        "Preisnachlass"
                      ];

                      const adjustment = {
                        amount,
                        reason:
                          adjustmentData.reason,

                        type:
                          refundReasons.includes(
                            adjustmentData.reason
                          )
                            ? "refund"
                            : "cost",

                        date:
                          new Date().toISOString()
                      };

                      onEdit(item.id, {
                        ...item,

                        costAdjustments: [
                          ...(item.costAdjustments ||
                            []),
                          adjustment
                        ]
                      });

                      setAdjustmentData({
                        amount: "",
                        reason: "Versand"
                      });

                      setAdjustmentItemId(null);
                    }}
                    style={{
                      background: "#16a34a",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      cursor: "pointer"
                    }}
                  >
                    Speichern
                  </button>

                  <button
                    onClick={() =>
                      setAdjustmentItemId(
                        null
                      )
                    }
                    style={{
                      marginLeft:
                        "10px"
                    }}
                  >
                    Abbrechen
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}