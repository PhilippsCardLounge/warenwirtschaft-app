import { useState, useRef } from "react";

import AddItemForm from "./components/AddItemForm";
import InventoryList from "./components/InventoryList";
import SearchFilter from "./components/SearchFilter";
import CSVImport from "./components/CSVImport";
import CSVRowForm from "./components/CSVRowForm";
import SalesList from "./components/SalesList";
import AssignmentList from "./components/AssignmentList";
import QuickAddCard from "./components/QuickAddCard";

import { useInventory } from "./hooks/useInventory";
import { useSales } from "./hooks/useSales";
import { useAssignments } from "./hooks/useAssignments";
import { useOpenPurchases } from "./hooks/useOpenPurchases";
import PaymentsList from "./components/PaymentsList";

import { usePayments } from "./hooks/usePayments";

import {
  getImportedPurchases,
  addImportedPurchase
} from "./services/importedPurchasesService";

import {
  exportBackup,
  importBackup
} from "./services/backupService";

import {
  createPaymentIfMissing
} from "./services/paymentService";

export default function App() {
  // 🔒 Passwortschutz
  const [passwordInput, setPasswordInput] =
    useState("");

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  const appPassword =
    import.meta.env.VITE_APP_PASSWORD;

  function handleLogin() {
    if (
      passwordInput === appPassword
    ) {
      setIsAuthenticated(true);
    } else {
      alert("Falsches Passwort");
    }
  }

  const {
    items,
    createItem,
    sellItem,
    editItem,
    removeItem,
    setFilters
  } = useInventory();

  const {
    sales,
    reloadSales,
    editSale,
    removeSale
  } = useSales();

  const {
    assignments
  } = useAssignments();
  
  const {
  payments
} = usePayments();

  const {
    purchases,
    processedPurchases,
    addPurchase,
    removePurchase
  } = useOpenPurchases();

  const [lastAction, setLastAction] =
    useState(null);

  const [activeTab, setActiveTab] =
    useState("overview");

  // 🔥 Auto-Skip Refs
  const rowRefs = useRef([]);

  function registerRowRef(index, ref) {
    rowRefs.current[index] = ref;
  }

  function focusNextRow(index) {
    const next =
      rowRefs.current[index + 1];

    if (next && next.current) {
      next.current.focus();
    }
  }

  // 🔥 CSV IMPORT
  async function handleCSVData(data) {
    const importedKeys =
      await getImportedPurchases();

    for (const entry of data) {
      const key = `${entry.seller}_${entry.date}_${entry.price}`;

      const alreadyImported =
        importedKeys.includes(key);

      if (!alreadyImported) {
        await addPurchase({
          seller: entry.seller,
          date: entry.date,
          price: entry.price
        });

        await addImportedPurchase(
          key
        );
      } else {
        console.log(
          "⚠️ Duplikat übersprungen:",
          entry
        );
      }
    }
  }

  async function handleSell(
    item,
    saleData
  ) {
    await sellItem(item, saleData);

    await reloadSales();
  }

  async function handleUndo() {
    if (!lastAction) return;

    const latestItem =
      items[items.length - 1];

    if (latestItem) {
      await removeItem(
        latestItem.id
      );
    }

    setLastAction(null);
  }

  // 🔥 BACKUP EXPORT
  async function handleBackup() {
    const data =
      await exportBackup();

    const blob = new Blob(
      [
        JSON.stringify(
          data,
          null,
          2
        )
      ],
      {
        type: "application/json"
      }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download = `backup-${
      new Date()
        .toISOString()
        .split("T")[0]
    }.json`;

    a.click();

    URL.revokeObjectURL(url);
  }

  // 🔥 BACKUP IMPORT
  async function handleRestore(
    event
  ) {
    const file =
      event.target.files[0];

    if (!file) return;

    const confirmed =
      window.confirm(
        "ACHTUNG: Alle aktuellen Daten werden gelöscht und durch das Backup ersetzt. Fortfahren?"
      );

    if (!confirmed) return;

    const text =
      await file.text();

    const data =
      JSON.parse(text);

    await importBackup(data);

    alert(
      "Backup erfolgreich wiederhergestellt!"
    );

    window.location.reload();
  }

  // 🔥 DATUMS-SORTIERUNG
  function parseDate(dateString) {
    const parsed =
      new Date(dateString);

    if (!isNaN(parsed))
      return parsed;

    if (
      dateString &&
      dateString.includes(".")
    ) {
      const [
        day,
        month,
        year
      ] = dateString.split(".");

      return new Date(
        `${year}-${month}-${day}`
      );
    }

    return new Date(0);
  }

  const sortedPurchases = [
    ...purchases
  ].sort((a, b) => {
    const dateA = parseDate(a.date);

    const dateB = parseDate(b.date);

    return dateB - dateA;
  });

  // 🔒 LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center"
        }}
      >
        <h1>Warenwirtschaft</h1>

        <h2>
          Passwort eingeben
        </h2>

        <input
          type="password"
          value={passwordInput}
          onChange={(e) =>
            setPasswordInput(
              e.target.value
            )
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
          style={{
            padding: "10px",
            fontSize: "16px",
            width: "250px"
          }}
        />

        <br />
        <br />

        <button
          onClick={handleLogin}
          style={{
            padding:
              "10px 20px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div
      style={{ padding: "20px" }}
    >
      <h1>Warenwirtschaft</h1>

      {/* 🔷 TABS */}
      <div
        style={{
          marginBottom: "20px"
        }}
      >
        <button
          onClick={() =>
            setActiveTab(
              "overview"
            )
          }
        >
          Übersicht
        </button>

        <button
          onClick={() =>
            setActiveTab(
              "payments"
            )
          }
          style={{
            marginLeft: "5px"
          }}
        >
          Zahlungen
        </button>

        <button
          onClick={() =>
            setActiveTab(
              "history"
            )
          }
          style={{
            marginLeft: "5px"
          }}
        >
          Kaufhistorie
        </button>

        <button
          onClick={() =>
            setActiveTab("csv")
          }
          style={{
            marginLeft: "5px"
          }}
        >
          Offene Einkäufe
        </button>

        <button
          onClick={() =>
            setActiveTab(
              "inventory"
            )
          }
          style={{
            marginLeft: "5px"
          }}
        >
          Inventar
        </button>

        <button
          onClick={() =>
            setActiveTab(
              "sales"
            )
          }
          style={{
            marginLeft: "5px"
          }}
        >
          Verkäufe
        </button>

        <button
          onClick={() =>
            setActiveTab(
              "assignments"
            )
          }
          style={{
            marginLeft: "5px"
          }}
        >
          Assignments
        </button>
      </div>

      {/* 🔁 Undo */}
      {lastAction && (
        <div
          style={{
            marginBottom: "10px",
            background: "#ffeeba",
            padding: "10px"
          }}
        >
          Letzte Aktion rückgängig
          machen

          <button
            onClick={handleUndo}
            style={{
              marginLeft: "10px"
            }}
          >
            Undo
          </button>
        </div>
      )}

      {/* 🔢 ÜBERSICHT */}
      {activeTab === "overview" && (
        <div>
          <h2>Übersicht</h2>

          {/* 🔥 Backup Buttons */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "20px"
            }}
          >
            {/* EXPORT */}
            <button
              onClick={handleBackup}
              style={{
                background: "#3498db",
                color: "white",
                borderRadius: "4px",
                padding: "8px 14px",
                cursor: "pointer",
                minWidth: "160px",
                textAlign: "center",
                fontSize: "18px",
                display: "inline-block"
              }}
            >
              Backup exportieren
            </button>

            {/* IMPORT */}
            <label
              style={{
                background:
                  "#3498db",

                color: "white",

                borderRadius:
                  "4px",

                padding:
                  "6px 10px",

                cursor: "pointer",

                minWidth: "160px",

                textAlign:
                  "center"
              }}
            >
              Backup importieren

              <input
                type="file"
                accept=".json"
                onChange={
                  handleRestore
                }
                style={{
                  display: "none"
                }}
              />
            </label>
          </div>

          <QuickAddCard
            onAdd={createItem}
          />
        </div>
      )}

      {/* 💳 ZAHLUNGEN */}
      {activeTab ===
        "payments" && (
        <div>
          <h2>Zahlungen</h2>

          <PaymentsList
            payments={payments}
            items={items}
          />
        </div>
      )}
      {/* 📚 KAUFHISTORIE */}
      {activeTab ===
        "history" && (
        <div>
          <h2>
            Kaufhistorie
          </h2>

          {processedPurchases.length ===
            0 && (
            <div>
              Noch keine
              verarbeiteten
              Einkäufe vorhanden.
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

          {[...processedPurchases]
            .sort(
              (a, b) =>
                new Date(b.date) -
                new Date(a.date)
            )
            .map((purchase) => {
              const payment =
                payments.find(
                  (p) =>
                    p.sourcePurchaseId ===
                    purchase.id
                );

              const cardCount =
                payment?.cardCount || 1;

              return (
                <div
                  key={purchase.id}
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
                        purchase.date
                      ).toLocaleDateString(
                        "de-DE"
                      )}
                    </strong>
                  </div>

                  <div>
                    {Number(
                      purchase.price || 0
                    ).toFixed(2)}{" "}
                    €
                  </div>

                  <div>
                    {payment
                      ?.firstInventoryNumber ||
                      "-"}
                  </div>

                  <div>
                    {cardCount}{" "}
                    {cardCount === 1
                      ? "Karte"
                      : "Karten"}
                  </div>

                  <div>
                    {purchase.seller || "-"}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* 📥 OFFENE EINKÄUFE */}
      {activeTab === "csv" && (
        <div>
          <h2>
            Offene Einkäufe
          </h2>

          <CSVImport
            onDataImported={
              handleCSVData
            }
          />

          {purchases.length ===
            0 && (
            <div
              style={{
                marginTop: "10px"
              }}
            >
              Keine offenen
              Einkäufe
            </div>
          )}

          {sortedPurchases.map(
            (entry, index) => {
              const inputRef = {
                current: null
              };

              return (
                <CSVRowForm
                  key={entry.id}
                  entry={entry}
                  inputRef={
                    inputRef
                  }
                  registerRef={() =>
                    registerRowRef(
                      index,
                      inputRef
                    )
                  }
                  onCreate={async (data) => {
                    const result =
                      await createItem(data);

                    if (
                      result?.success
                    ) {

                      if (
                        data.isFirstCard
                      ) {
                        await createPaymentIfMissing(
                          {
                            sourcePurchaseId:
                              entry.id,

                            paymentDate:
                              entry.date,

                            amount:
                              parseFloat(
                                entry.price
                              ) || 0,

                            seller:
                              entry.seller,

                            platform:
                              "Whatnot",

                            firstInventoryNumber:
                              result.inventoryNumber,

                            cardCount:
                              data.cardCount || 1
                          }
                        );
                      }

                      await removePurchase(
                        entry.id
                      );

                      setTimeout(
                        () =>
                          focusNextRow(
                            index
                          ),
                        0
                      );
                    }
                  }}

                  onRemove={() =>
                    removePurchase(
                      entry.id
                    )
                  }
                />
              );
            }
          )}
        </div>
      )}

      {/* 📦 INVENTAR */}
      {activeTab ===
        "inventory" && (
        <div>
          <h2>Inventar</h2>

          <SearchFilter
            onFilterChange={
              setFilters
            }
          />

          <InventoryList
            items={items}
            onEdit={editItem}
            onDelete={
              removeItem
            }
            onSell={handleSell}
          />
        </div>
      )}

      {/* 💸 VERKÄUFE */}
      {activeTab === "sales" && (
        <div>
          <SalesList
            sales={sales}
            items={items}
            onEdit={editSale}
            onDelete={removeSale}
            onSell={handleSell}
          />
        </div>
      )}

      {/* 🔥 ASSIGNMENTS */}
      {activeTab ===
        "assignments" && (
        <div>
          <h2>Assignments</h2>

          <AssignmentList
            assignments={
              assignments
            }
            items={items}
            sales={sales}
          />
        </div>
      )}
    </div>
  );
}