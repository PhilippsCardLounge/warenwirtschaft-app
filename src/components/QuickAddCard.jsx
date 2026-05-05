import { useState } from "react";

export default function QuickAddCard({ onAdd }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("NM");
  const [language, setLanguage] = useState("DE");
  const [type, setType] = useState("Einzelkarte");
  const [storageType, setStorageType] = useState("weiß");

  function handleSubmit() {
    if (!name) {
      alert("Bitte Kartenname eingeben");
      return;
    }

    onAdd({
      name,
      price: 0,
      purchasePrice: parseFloat(price) || 0,
      condition,
      language,
      type,
      storageType
    });

    setName("");
    setPrice("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div style={{ border: "1px solid #ccc", padding: "15px", marginTop: "10px" }}>
      <h3>Karte manuell hinzufügen</h3>

      <input
        placeholder="Kartenname"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <input
        type="number"
        placeholder="Einkaufspreis"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        onKeyDown={handleKeyDown}
      />

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

      <button onClick={handleSubmit} style={{ marginTop: "10px" }}>
        Karte hinzufügen
      </button>
    </div>
  );
}