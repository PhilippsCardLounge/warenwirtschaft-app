import { useState } from "react";

export default function AddItemForm({ onAdd }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("NM");
  const [language, setLanguage] = useState("DE");
  const [type, setType] = useState("Einzelkarte"); // 🔥 NEU
  const [storageType, setStorageType] = useState("weiß"); // 🔥 falls noch nicht vorhanden

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
      type,           // 🔥 WICHTIG
      storageType     // 🔥 WICHTIG
    });

    setName("");
    setPrice("");
  }

  // 🔥 ENTER SUPPORT
  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div style={{ marginTop: "10px" }}>
      <input
        placeholder="Kartenname"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown} // 🔥 NEU
      />

      <input
        type="number"
        placeholder="Einkaufspreis (€)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        onKeyDown={handleKeyDown} // 🔥 NEU
      />

      <br />

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

      <br />

      <button onClick={handleSubmit}>Speichern</button>
    </div>
  );
}