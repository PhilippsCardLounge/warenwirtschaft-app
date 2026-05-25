export default function AssignmentList({
  assignments
}) {
  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto"
      }}
    >
      {assignments.map(
        (assignment) => (
          <div
            key={assignment.id}
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
            {/* 🔢 Nummer + Name */}
            <div
              style={{
                fontSize: "22px",
                fontWeight: "700",
                marginBottom: "10px",
                color: "#111827",
                textAlign: "center"
              }}
            >
              {
                assignment.inventoryNumber
              }{" "}
              {
                assignment.cardName
              }
            </div>

            {/* 🔥 Zahlungsinfos */}
            <div
              style={{
                textAlign: "center",
                marginBottom: "8px",
                color: "#4b5563"
              }}
            >
              Zahlung:{" "}
              {
                assignment.paymentAmount
              }
              € •{" "}
              {
                assignment.paymentDate
              }
            </div>

            {/* 🔥 Verkäufer */}
            <div
              style={{
                textAlign: "center",
                marginBottom: "8px",
                color: "#4b5563"
              }}
            >
              Verkäufer:{" "}
              {
                assignment.seller
              }
            </div>

            {/* 🔥 Status */}
            <div
              style={{
                textAlign: "center",
                marginBottom: "8px",
                fontWeight: "600"
              }}
            >
              Status:{" "}
              {
                assignment.status
              }
            </div>

            {/* 🔥 Verkauf */}
            {assignment.status ===
              "verkauft" && (
              <div
                style={{
                  textAlign:
                    "center",
                  marginTop: "10px"
                }}
              >
                Verkaufspreis:{" "}
                {
                  assignment.salePrice
                }
                €
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}