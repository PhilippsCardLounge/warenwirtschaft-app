import { useState } from "react";

export default function SalesList({
  sales,
  items,
  onEdit,
  onDelete,
  onSell
}) {
  const [editingId, setEditingId] =
    useState(null);

  const [editData, setEditData] =
    useState({});

  // 🔥 Verkaufstext
  const [
    saleText,
    setSaleText
  ] = useState("");

  // 🔥 Analyse-Ergebnisse
  const [
    parsedSales,
    setParsedSales
  ] = useState([]);

  // 🔥 Verkäufe analysieren
  function analyzeSalesText() {
    const lines =
      saleText.split("\n");

    const results = [];

    let currentNumber =
      null;

    for (const line of lines) {
      // 🔥 Nummer erkennen
      const numberMatch =
        line.match(
          /Daily Shipping\s*\/\/\s*(\d+)/i
        );

      if (numberMatch) {
        currentNumber = `#${numberMatch[1]}`;
      }

      // 🔥 Preis erkennen
      const priceMatch =
        line.match(
          /(\d+,\d+)\s*€/i
        );

      if (
        priceMatch &&
        currentNumber
      ) {
        const parsedPrice =
          parseFloat(
            priceMatch[1].replace(
              ",",
              "."
            )
          );

        // 🔥 Inventar durchsuchen
        const matchingItem =
          items.find(
            (item) =>
              (
                item.inventoryNumber ||
                ""
              )
                .toString()
                .trim()
                .toLowerCase() ===
              currentNumber
                .toString()
                .trim()
                .toLowerCase()
          );

        results.push({
          inventoryNumber:
            currentNumber,

          salePrice:
            parsedPrice,

          found:
            !!matchingItem,

          cardName:
            matchingItem?.name ||
            null,

          matchedItem:
            matchingItem || null
        });

        currentNumber =
          null;
      }
    }

    setParsedSales(results);
  }

  // 🔥 Einzelverkauf
  async function handleParsedSale(
    parsedSale
  ) {
    if (
      !parsedSale.matchedItem
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `${parsedSale.inventoryNumber} wirklich verkaufen?`
      );

    if (!confirmed) {
      return;
    }

    await onSell(
      parsedSale.matchedItem,
      {
        salePrice:
          parsedSale.salePrice,

        feePercent: 5
      }
    );

    // 🔥 Aus Vorschlagsliste entfernen
    setParsedSales((prev) =>
      prev.filter(
        (sale) =>
          sale.inventoryNumber !==
          parsedSale.inventoryNumber
      )
    );
  }

  // 🔥 Sortierung
  const sortedSales =
    [...sales].sort((a, b) => {
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

      {/* 🔥 ANALYSE */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "14px",
          marginBottom: "20px",
          border:
            "1px solid #ddd"
        }}
      >
        <h3>
          Verkäufe analysieren
        </h3>

        <textarea
          value={saleText}
          onChange={(e) =>
            setSaleText(
              e.target.value
            )
          }
          placeholder="Cardmarket-Verkäufe hier einfügen..."
          style={{
            width: "100%",
            minHeight: "220px",
            padding: "12px",
            borderRadius: "10px",
            border:
              "1px solid #ccc",
            boxSizing:
              "border-box",
            marginBottom: "12px"
          }}
        />

        <button
          onClick={
            analyzeSalesText
          }
        >
          Verkäufe analysieren
        </button>

        {/* 🔥 Ergebnisse */}
        {parsedSales.length >
          0 && (
          <div
            style={{
              marginTop: "20px"
            }}
          >
            <h3>
              Erkannte Verkäufe
            </h3>

            {parsedSales.map(
              (
                parsedSale,
                index
              ) => (
                <div
                  key={index}
                  style={{
                    padding:
                      "12px",
                    borderBottom:
                      "1px solid #ddd"
                  }}
                >
                  <strong>
                    {
                      parsedSale.inventoryNumber
                    }
                  </strong>{" "}
                  →{" "}
                  {
                    parsedSale.salePrice
                  }
                  €

                  <br />

                  {parsedSale.found ? (
                    <>
                      <span>
                        ✅ Gefunden:
                        {" "}
                        {
                          parsedSale.cardName
                        }
                      </span>

                      <br />
                      <br />

                      <button
                        onClick={() =>
                          handleParsedSale(
                            parsedSale
                          )
                        }
                      >
                        ✅ Verkaufen
                      </button>
                    </>
                  ) : (
                    <span>
                      ❌ Nicht im
                      Inventar gefunden
                    </span>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </div>

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

      {sortedSales.map((sale) => (
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
              <strong>
                {
                  sale.inventoryNumber
                }{" "}
                {sale.name}
              </strong>

              <br />

              Zustand:{" "}
              {sale.condition ||
                "-"}{" "}
              | Sprache:{" "}
              {sale.language ||
                "-"}

              <br />

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