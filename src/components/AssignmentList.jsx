import { useState } from "react";

export default function AssignmentList({
  assignments
}) {
  const [search, setSearch] =
    useState("");

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

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto"
      }}
    >
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