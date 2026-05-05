import { useState, useRef, useEffect } from "react";

export default function CSVRowForm({
  entry,
  onCreate,
  onRemove,
  inputRef,
  registerRef
}) {
  const [mode, setMode] = useState("single");
  const [count, setCount] = useState(2);

  const [name, setName] = useState("");
  const [names, setNames] = useState([]);

  const [condition, setCondition] = useState("NM");
  const [language, setLanguage] = useState("DE");
  const [type, setType] = useState("Einzelkarte");
  const [storageType, setStorageType] = useState("weiß");

  const [flashSuccess, setFlashSuccess] = useState(false); // 🔥 NEU

  const singleInputRef = useRef(null);
  const multiRefs = useRef([]);

  useEffect(() => {
    if (registerRef) registerRef();
  }, []);

  useEffect(() => {
    if (mode === "single") {
      singleInputRef.current?.focus();
    } else {
      multiRefs.current[0]?.focus();
    }
  }, [mode]);

  function triggerSuccessFlash() {
    setFlashSuccess(true);

    setTimeout(() => {
      setFlashSuccess(false);
    }, 300); // kurze Animation
  }

  function handleMultiCountChange(value) {
    const num = parseInt(value) || 1;
    setCount(num);

    const newNames = [];
    for (let i = 0; i < num; i++) {
      newNames.push(names[i] || "");
    }
    setNames(newNames);
  }

  function handleCreateSingle() {
    if (!name) return;

    triggerSuccessFlash(); // 🔥 NEU

    onCreate({
      name,
      price: 0,
      purchasePrice: entry.price,
      condition,
      language,
      type,
      storageType,
      purchaseDate: entry.date,
      purchaseSeller: entry.seller
    });

    setName("");
  }

  function handleCreateMultiple() {
    const pricePerCard = entry.price / count;

    triggerSuccessFlash(); // 🔥 NEU

    for (let i = 0; i < count; i++) {
      if (!names[i]) continue;

      onCreate({
        name: names[i],
        price: 0,
        purchasePrice: pricePerCard,
        condition,
        language,
        type,
        storageType,
        purchaseDate: entry.date,
        purchaseSeller: entry.seller
      });
    }
  }

  function handleKeyDown(e, index = null) {
    if (e.key !== "Enter") return;

    e.preventDefault();

    if (mode === "single") {
      handleCreateSingle();
      return;
    }

    if (index !== null && index < count - 1) {
      multiRefs.current[index + 1]?.focus();
    } else {
      handleCreateMultiple();
    }
  }

  function handleRemove() {
    if (window.confirm("Wirklich entfernen?")) {
      onRemove();
    }
  }

  return (
    <div
      style={{
        borderBottom: "1px solid #ccc",
        padding: "10px",
        backgroundColor: flashSuccess ? "#d4edda" : "transparent",
        transition: "background-color 0.2s ease"
      }}
    >
      <div>
        Verkäufer: {entry.seller} | Preis: {entry.price} € | Datum: {entry.date}
      </div>

      <div style={{ marginTop: "5px" }}>
        <button onClick={() => setMode("single")}>1 Karte</button>
        <button onClick={() => setMode("multi")} style={{ marginLeft: "5px" }}>
          Mehrere Karten
        </button>
      </div>

      {mode === "single" && (
        <div style={{ marginTop: "10px" }}>
          <input
            ref={(el) => {
              singleInputRef.current = el;
              if (inputRef) inputRef.current = el;
            }}
            placeholder="Kartenname"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button onClick={handleCreateSingle} style={{ marginLeft: "10px" }}>
            Erstellen ({entry.price.toFixed(2)} €)
          </button>
        </div>
      )}

      {mode === "multi" && (
        <div style={{ marginTop: "10px" }}>
          <div>
            Anzahl:
            <input
              type="number"
              value={count}
              onChange={(e) => handleMultiCountChange(e.target.value)}
              style={{ width: "60px", marginLeft: "5px" }}
            />
          </div>

          <div style={{ marginTop: "10px" }}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i}>
                <input
                  ref={(el) => (multiRefs.current[i] = el)}
                  placeholder={`Karte ${i + 1}`}
                  value={names[i] || ""}
                  onChange={(e) => {
                    const updated = [...names];
                    updated[i] = e.target.value;
                    setNames(updated);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                />
              </div>
            ))}
          </div>

          <div style={{ marginTop: "5px" }}>
            Preis pro Karte: {(entry.price / count).toFixed(2)} €
          </div>

          <button onClick={handleCreateMultiple}>
            Alle erstellen
          </button>
        </div>
      )}

      <div style={{ marginTop: "10px" }}>
        Zustand:
        <select value={condition} onChange={(e) => setCondition(e.target.value)}>
          <option>NM</option>
          <option>EX</option>
          <option>GD</option>
          <option>PL</option>
          <option>PO</option>
        </select>

        Sprache:
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option>DE</option>
          <option>EN</option>
          <option>JP</option>
        </select>

        Art:
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option>Einzelkarte</option>
          <option>Slab</option>
          <option>Sealed Promos</option>
          <option>Booster/Box</option>
          <option>Merch</option>
        </select>

        Lager:
        <select value={storageType} onChange={(e) => setStorageType(e.target.value)}>
          <option>weiß</option>
          <option>grau</option>
        </select>
      </div>

      <div style={{ marginTop: "10px" }}>
        <button
          onClick={handleRemove}
          style={{
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            padding: "4px 8px",
            fontSize: "12px",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Entfernen
        </button>
      </div>
    </div>
  );
}