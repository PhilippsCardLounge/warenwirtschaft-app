import { useState } from "react";

import {
  createAssignmentIfMissing
} from "../services/assignmentService";

export default function AssignmentList({
  assignments,
  items = [],
  sales = []
}) {
  const [search, setSearch] =
    useState("");

  const [
    migrationRunning,
    setMigrationRunning
  ] = useState(false);

  // 🔥 Sortierung
  const sortedAssignments =
    [...assignments].sort(
      (a, b) => {
        // 🔥 verkauft zuerst
        if (
          a.status ===
            "verkauft" &&
          b.status !==
            "verkauft"
        ) {
          return -1;
        }

        if (
          a.status !==
            "verkauft" &&
          b.status ===
            "verkauft"
        ) {
          return 1;
        }

        // 🔥 Nummernvergleich
        function parseNumber(
          item
        ) {
          const num =
            (
              item.inventoryNumber ||
              ""
            )
              .toString()
              .replace(
                "#",
                ""
              );

          return (
            parseInt(
              num,
              10
            ) || 0
          );
        }

        return (
          parseNumber(b) -
          parseNumber(a)
        );
      }
    );

  // 🔥 Suche
  const filteredAssignments =
    sortedAssignments.filter(
      (assignment) => {
        const term =
          search
            .toLowerCase()
            .trim();

        return (
          (
            assignment.inventoryNumber ||
            ""
          )
            .toLowerCase()
            .includes(term) ||
          (
            assignment.cardName ||
            ""
          )
            .toLowerCase()
            .includes(term) ||
          (
            assignment.seller ||
            ""
          )
            .toLowerCase()
            .includes(term)
        );
      }
    );

  // 🔥 Alle existierenden Nummern
  const existingAssignmentNumbers =
    assignments.map(
      (assignment) =>
        assignment.inventoryNumber
    );

  // 🔥 Fehlende Inventar-Karten
  const missingInventoryAssignments =
    items.filter(
      (item) =>
        !existingAssignmentNumbers.includes(
          item.inventoryNumber
        )
    );

  // 🔥 Fehlende Verkaufs-Karten
  const missingSalesAssignments =
    sales.filter(
      (sale) =>
        !existingAssignmentNumbers.includes(
          sale.inventoryNumber
        )
    );

  // 🔥 Gesamt
  const totalMissing =
    missingInventoryAssignments.length +
    missingSalesAssignments.length;

  // 🔥 Migration starten
  async function handleMigration() {
    const confirmed =
      window.confirm(
        `${totalMissing} fehlende Assignments erzeugen?`
      );

    if (!confirmed) {
      return;
    }

    setMigrationRunning(true);

    try {
      // 🔥 Inventar
      for (const item of missingInventoryAssignments) {
        await createAssignmentIfMissing(
          {
            paymentDate:
              "Unbekannt",

            paymentAmount:
              item.purchasePrice ||
              0,

            platform:
              "Altbestand",

            seller:
              item.purchaseSeller ||
              "Altbestand",

            inventoryNumber:
              item.inventoryNumber,

            cardName:
              item.name,

            status:
              "im Inventar",

            saleDate: null,

            salePrice: null
          }
        );
      }

      // 🔥 Verkäufe
      for (const sale of missingSalesAssignments) {
        await createAssignmentIfMissing(
          {
            paymentDate:
              "Unbekannt",

            paymentAmount:
              sale.purchasePrice ||
              0,

            platform:
              "Altbestand",

            seller:
              sale.purchaseSeller ||
              "Altbestand",

            inventoryNumber:
              sale.inventoryNumber,

            cardName:
              sale.name,

            status:
              "verkauft",

            saleDate:
              sale.saleDate ||
              null,

            salePrice:
              sale.salePrice ||
              null
          }
        );
      }

      alert(
        "Migration erfolgreich abgeschlossen!"
      );

      window.location.reload();
    } catch (error) {
      console.error(error);

      alert(
        "Fehler bei der Migration"
      );
    }

    setMigrationRunning(false);
  }

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto"
      }}
    >
      {/* 🔥 Fehlende Assignments */}
      <div
        style={{
          background: "#fff8e1",
          border:
            "1px solid #facc15",
          borderRadius: "14px",
          padding: "18px",
          marginBottom: "25px"
        }}
      >
        <h2
          style={{
            marginTop: 0
          }}
        >
          Fehlende Assignments
        </h2>

        <div
          style={{
            fontWeight: "600",
            marginBottom: "15px"
          }}
        >
          {totalMissing} Karten
          ohne Assignment
          gefunden
        </div>

        {/* 🔥 BUTTON */}
        {totalMissing > 0 && (
          <button
            onClick={
              handleMigration
            }
            disabled={
              migrationRunning
            }
            style={{
              marginBottom:
                "20px",
              padding:
                "10px 16px",
              borderRadius:
                "10px",
              cursor: "pointer"
            }}
          >
            {migrationRunning
              ? "Migration läuft..."
              : "Fehlende Assignments erzeugen"}
          </button>
        )}

        {/* 🔥 Inventar */}
        {missingInventoryAssignments.length >
          0 && (
          <>
            <h3>
              Im Inventar
            </h3>

            {missingInventoryAssignments.map(
              (item) => (
                <div
                  key={item.id}
                  style={{
                    marginBottom:
                      "6px"
                  }}
                >
                  {
                    item.inventoryNumber
                  }{" "}
                  — {item.name}
                </div>
              )
            )}
          </>
        )}

        {/* 🔥 Verkäufe */}
        {missingSalesAssignments.length >
          0 && (
          <>
            <h3
              style={{
                marginTop: "20px"
              }}
            >
              Bereits verkauft
            </h3>

            {missingSalesAssignments.map(
              (sale) => (
                <div
                  key={sale.id}
                  style={{
                    marginBottom:
                      "6px"
                  }}
                >
                  {
                    sale.inventoryNumber
                  }{" "}
                  — {sale.name}
                </div>
              )
            )}
          </>
        )}
      </div>

      {/* 🔍 Suche */}
      <input
        type="text"
        placeholder="Suchen nach Nummer, Karte oder Verkäufer"
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "20px",
          borderRadius: "10px",
          border:
            "1px solid #ccc",
          fontSize: "16px",
          boxSizing:
            "border-box"
        }}
      />

      {filteredAssignments.map(
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