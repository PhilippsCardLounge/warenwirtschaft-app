import {
  useEffect,
  useRef,
  useState
} from "react";

import {
  generateInventoryNumber,
  getInventorySettings
} from "../services/settingsService";

export default function CSVRowForm({
  entry,
  onCreate,
  onRemove,
  inputRef,
  registerRef
}) {
  const localInputRef = useRef(null);

  // 🔥 Auto-Fokus Registrierung
  useEffect(() => {
    if (inputRef) {
      inputRef.current =
        localInputRef.current;
    }

    if (registerRef) {
      registerRef();
    }
  }, []);

  const [mode, setMode] =
    useState("single");

  const [count, setCount] =
    useState(2);

  // SINGLE
  const [name, setName] =
    useState("");

  // MULTI
  const [names, setNames] =
    useState([]);

  // gemeinsame Felder
  const [condition, setCondition] =
    useState("NM");

  const [language, setLanguage] =
    useState("DE");

  const [type, setType] =
    useState("Einzelkarte");

  const [storageType, setStorageType] =
    useState("weiß");

  // 🔥 Inventar-Nummer
  const [
    inventoryNumber,
    setInventoryNumber
  ] = useState("");

  // 🔥 nächste Nummer laden
  useEffect(() => {
    async function loadNextNumber() {
      const settings =
        await getInventorySettings();

      const nextNumber =
        generateInventoryNumber(
          type,
          settings
        );

      setInventoryNumber(nextNumber);
    }

    loadNextNumber();
  }, [type]);

  function handleMultiCountChange(value) {
    const num =
      parseInt(value) || 1;

    setCount(num);

    const newNames = [];

    for (let i = 0; i < num; i++) {
      newNames.push(names[i] || "");
    }

    setNames(newNames);
  }

  // 🔥 ENTER SUPPORT
  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();

      if (mode === "single") {
        handleCreateSingle();
      } else {
        handleCreateMultiple();
      }
    }
  }

  async function reloadNextNumber() {
    const settings =
      await getInventorySettings();

    const nextNumber =
      generateInventoryNumber(
        type,
        settings
      );

    setInventoryNumber(nextNumber);
  }

  function handleCreateSingle() {
    if (!name) {
      alert(
        "Bitte Kartenname eingeben"
      );

      return;
    }

    onCreate({
      name,
      price: 0,
      purchasePrice: entry.price,
      condition,
      language,
      type,
      storageType,

      // 🔥 WICHTIG
      inventoryNumber,

      purchaseDate: entry.date,
      purchaseSeller: entry.seller
    });

    setTimeout(() => {
      reloadNextNumber();
    }, 200);
  }

  function handleCreateMultiple() {
    const pricePerCard =
      entry.price / count;

    // 🔥 Nummer extrahieren
    const baseNumber =
      parseInt(
        inventoryNumber
          .replace(/[^0-9]/g, ""),
        10
      ) || 1;

    for (let i = 0; i < count; i++) {
      if (!names[i]) continue;

      let currentNumber =
        inventoryNumber;

      // 🔥 Auto-Hochzählung
      if (
        inventoryNumber.startsWith("#")
      ) {
        currentNumber =
          `#${String(
            baseNumber + i
          ).padStart(4, "0")}`;
      }

      if (
        inventoryNumber.startsWith("G")
      ) {
        currentNumber =
          `G${baseNumber + i}`;
      }

      if (
        inventoryNumber.startsWith("S")
      ) {
        currentNumber =
          `S${baseNumber + i}`;
      }

      if (
        inventoryNumber.startsWith("B")
      ) {
        currentNumber =
          `B${baseNumber + i}`;
      }

      if (
        inventoryNumber.startsWith("M")
      ) {
        currentNumber =
          `M${baseNumber + i}`;
      }

      onCreate({
        name: names[i],
        price: 0,
        purchasePrice:
          pricePerCard,
        condition,
        language,
        type,
        storageType,

        // 🔥 individuelle Nummer
        inventoryNumber:
          currentNumber,

        purchaseDate: entry.date,
        purchaseSeller:
          entry.seller
      });
    }

    setTimeout(() => {
      reloadNextNumber();
    }, 200);
  }

  return (
    <div
      style={{
        borderBottom:
          "1px solid #ccc",
        padding: "10px"
      }}
    >
      {/* INFO */}
      <div>
        Verkäufer: {entry.seller}
        {" | "}
        Preis: {entry.price} €
        {" | "}
        Datum: {entry.date}
      </div>

      {/* MODE SWITCH */}
      <div
        style={{
          marginTop: "5px"
        }}
      >
        <button
          onClick={() =>
            setMode("single")
          }
        >
          1 Karte
        </button>

        <button
          onClick={() =>
            setMode("multi")
          }
          style={{
            marginLeft: "5px"
          }}
        >
          Mehrere Karten
        </button>
      </div>

      {/* SINGLE MODE */}
      {mode === "single" && (
        <div
          style={{
            marginTop: "10px"
          }}
        >
          <input
            ref={localInputRef}
            placeholder="Kartenname"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            onKeyDown={
              handleKeyDown
            }
          />

          <button
            onClick={
              handleCreateSingle
            }
            style={{
              marginLeft: "10px"
            }}
          >
            Erstellen (
            {entry.price.toFixed(
              2
            )}{" "}
            €)
          </button>
        </div>
      )}

      {/* MULTI MODE */}
      {mode === "multi" && (
        <div
          style={{
            marginTop: "10px"
          }}
        >
          <div>
            Anzahl:
            <input
              type="number"
              value={count}
              onChange={(e) =>
                handleMultiCountChange(
                  e.target.value
                )
              }
              style={{
                width: "60px",
                marginLeft: "5px"
              }}
            />
          </div>

          <div
            style={{
              marginTop: "10px"
            }}
          >
            {Array.from({
              length: count
            }).map((_, i) => (
              <div key={i}>
                <input
                  placeholder={`Karte ${
                    i + 1
                  }`}
                  value={
                    names[i] || ""
                  }
                  onChange={(e) => {
                    const updated =
                      [...names];

                    updated[i] =
                      e.target.value;

                    setNames(updated);
                  }}
                  onKeyDown={
                    handleKeyDown
                  }
                />
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "5px"
            }}
          >
            Preis pro Karte:{" "}
            {(
              entry.price /
              count
            ).toFixed(2)}{" "}
            €
          </div>

          <button
            onClick={
              handleCreateMultiple
            }
          >
            Alle erstellen
          </button>
        </div>
      )}

      {/* GEMEINSAME FELDER */}
      <div
        style={{
          marginTop: "10px"
        }}
      >
        Zustand:
        <select
          value={condition}
          onChange={(e) =>
            setCondition(
              e.target.value
            )
          }
        >
          <option>NM</option>
          <option>EX</option>
          <option>GD</option>
          <option>LP</option>
          <option>PL</option>
          <option>PO</option>
        </select>

        Sprache:
        <select
          value={language}
          onChange={(e) =>
            setLanguage(
              e.target.value
            )
          }
        >
          <option>DE</option>
          <option>EN</option>
          <option>JP</option>
          <option>KOR</option>
          <option>CHI</option>
          <option>ITA</option>
          <option>FRA</option>
        </select>

        Art:
        <select
          value={type}
          onChange={(e) =>
            setType(
              e.target.value
            )
          }
        >
          <option>
            Einzelkarte
          </option>

          <option>
            Slab
          </option>

          <option>
            Sealed Promos
          </option>

          <option>
            Booster/Box
          </option>

          <option>
            Merch
          </option>
        </select>

        Lager:
        <select
          value={storageType}
          onChange={(e) =>
            setStorageType(
              e.target.value
            )
          }
        >
          <option>weiß</option>
          <option>grau</option>
        </select>
      </div>

      {/* 🔥 Inventar-Nummer */}
      <div
        style={{
          marginTop: "5px"
        }}
      >
        Inventar-Nummer:

        <input
          value={inventoryNumber}
          onChange={(e) =>
            setInventoryNumber(
              e.target.value
            )
          }
          onKeyDown={
            handleKeyDown
          }
          style={{
            width: "120px",
            marginLeft: "5px"
          }}
        />
      </div>

      {/* REMOVE */}
      <div
        style={{
          marginTop: "10px"
        }}
      >
        <button
          onClick={() => {
            const confirmed =
              window.confirm(
                "Diesen offenen Einkauf wirklich entfernen?"
              );

            if (confirmed) {
              onRemove();
            }
          }}
          style={{
            background:
              "#ff4d4f",
            color: "white",
            border: "none",
            padding:
              "4px 8px",
            cursor: "pointer",
            borderRadius:
              "4px",
            fontSize: "12px"
          }}
        >
          Entfernen
        </button>
      </div>
    </div>
  );
}