export default function PaymentsList({
  payments,
  items
}) {
  const sortedPayments =
    [...payments].sort(
      (a, b) => {
        const dateA =
          new Date(
            a.paymentDate
          );

        const dateB =
          new Date(
            b.paymentDate
          );

        return dateB - dateA;
      }
    );

  function getCardLabel(
    inventoryNumber
  ) {
    const item = items?.find(
      (card) =>
        card.inventoryNumber ===
        inventoryNumber
    );

    if (!item) {
      return inventoryNumber;
    }

    return `${inventoryNumber} ${item.name}`;
  }

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

      {sortedPayments.map(
        (payment) => (
          <div
            key={payment.id}
            style={{
              background:
                "white",
              borderRadius:
                "14px",
              padding: "18px",
              marginBottom:
                "18px",
              boxShadow:
                "0 2px 10px rgba(0,0,0,0.08)",
              border:
                "1px solid #e5e7eb"
            }}
          >
            {/* Datum */}
            <div
              style={{
                fontSize:
                  "20px",
                fontWeight:
                  "700",
                textAlign:
                  "center",
                marginBottom:
                  "10px"
              }}
            >
              {
                payment.paymentDate
              }
            </div>

            {/* Betrag */}
            <div
              style={{
                textAlign:
                  "center",
                marginBottom:
                  "8px"
              }}
            >
              Betrag:{" "}
              {
                payment.amount
              }
              €
            </div>

            {/* Plattform */}
            <div
              style={{
                textAlign:
                  "center",
                marginBottom:
                  "8px"
              }}
            >
              Plattform:{" "}
              {
                payment.platform
              }
            </div>

            {/* Verkäufer */}
            <div
              style={{
                textAlign:
                  "center",
                marginBottom:
                  "8px"
              }}
            >
              Verkäufer:{" "}
              {
                payment.seller
              }
            </div>

            {/* Startnummer */}
            <div
              style={{
                textAlign:
                  "center",
                fontWeight:
                  "600",
                marginBottom:
                  "8px"
              }}
            >
              Startnummer:{" "}
              {
                payment.firstInventoryNumber
              }
            </div>

            {/* Anzahl Karten */}
            <div
              style={{
                textAlign:
                  "center",
                fontWeight:
                  "600"
              }}
            >
              Anzahl Karten:{" "}
              {
                payment.cardCount ||
                1
              }
            </div>
          </div>
        )
      )}
    </div>
  );
}