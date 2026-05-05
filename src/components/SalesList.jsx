export default function SalesList({ sales }) {
  function calculateTotalProfit() {
    return sales.reduce((sum, sale) => {
      return sum + (sale.profit || 0);
    }, 0);
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Verkäufe</h2>

      <div style={{ marginBottom: "10px" }}>
        Gesamtgewinn: {calculateTotalProfit().toFixed(2)} €
      </div>

      {sales.map((sale) => (
        <div
          key={sale.id}
          style={{ borderBottom: "1px solid #ccc", padding: "8px" }}
        >
          <strong>
            #{String(sale.inventoryNumber).padStart(4, "0")} {sale.name}
          </strong>
          <br />

          Einkaufspreis:{" "}
          {sale.purchasePrice !== null && sale.purchasePrice !== undefined
            ? `${sale.purchasePrice.toFixed(2)} €`
            : "—"}
          <br />

          Verkaufspreis: {sale.salePrice.toFixed(2)} €<br />

          Gewinn:{" "}
          {sale.profit !== null && sale.profit !== undefined
            ? `${sale.profit.toFixed(2)} €`
            : "—"}
          <br />

          Datum: {new Date(sale.date).toLocaleString()}
        </div>
      ))}
    </div>
  );
}