export default function PaymentsList({
  payments
}) {
  const sortedPayments =
    [...payments].sort(
      (a, b) =>
        new Date(b.paymentDate) -
        new Date(a.paymentDate)
    );

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto"
      }}
    >
      {sortedPayments.length ===
        0 && (
        <div>
          Noch keine Zahlungen
          vorhanden.
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "160px 120px 140px 120px 180px",
          gap: "20px",
          fontWeight: "700",
          marginBottom: "8px",
          padding: "0 15px"
        }}
      >
        <div>Datum</div>
        <div>Betrag</div>
        <div>Startnr.</div>
        <div>Karten</div>
        <div>Verkäufer</div>
      </div>

      {sortedPayments.map(
        (payment) => {
          const cardCount =
            payment.cardCount || 1;

          return (
            <div
              key={payment.id}
              style={{
                background: "white",
                borderRadius: "8px",
                padding: "10px 15px",
                marginBottom: "6px",
                border: "1px solid #ddd",
                display: "grid",
                gridTemplateColumns:
                  "160px 120px 140px 120px 180px",
                alignItems: "center",
                gap: "20px"
              }}
            >
              <div>
                <strong>
                  {new Date(
                    payment.paymentDate
                  ).toLocaleDateString(
                    "de-DE"
                  )}
                </strong>
              </div>

              <div>
                {Number(
                  payment.amount || 0
                ).toFixed(2)}{" "}
                €
              </div>

              <div>
                {payment.firstInventoryNumber ||
                  "-"}
              </div>

              <div>
                {cardCount}{" "}
                {cardCount === 1
                  ? "Karte"
                  : "Karten"}
              </div>

              <div>
                {payment.seller || "-"}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}