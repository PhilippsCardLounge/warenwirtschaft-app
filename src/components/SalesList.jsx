export default function SalesList({
  sales
}) {
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

          {/* 🔥 Gebühren */}
          Gebühren (
          {sale.feePercent ||
            0}
          %):{" "}
          {sale.feeAmount !==
            null &&
          sale.feeAmount !==
            undefined
            ? `${sale.feeAmount.toFixed(
                2
              )} €`
            : "—"}

          <br />

          {/* 🔥 Netto */}
          Netto-Auszahlung:{" "}
          {sale.netSale !==
            null &&
          sale.netSale !==
            undefined
            ? `${sale.netSale.toFixed(
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

          {/* 📅 Datum */}
          Datum:{" "}
          {sale.date
            ? new Date(
                sale.date
              ).toLocaleString()
            : "-"}
        </div>
      ))}
    </div>
  );
}
