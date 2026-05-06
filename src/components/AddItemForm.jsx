import { useState } from "react";

export default function AddItemForm({ onAdd }) {
  const [name, setName] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [condition, setCondition] =
    useState("NM");

  const [language, setLanguage] =
    useState("DE");

  const [type, setType] =
    useState("Einzelkarte");

  const [storageType, setStorageType] =
    useState("weiß");

  // 🔥 Herkunft
  const [
    purchaseSeller,
    setPurchaseSeller
  ] = useState("Altbestand");

  function handleSubmit() {
    if (!name) {
      alert(
        "Bitte Kartenname eingeben"
      );

      return;
    }

    onAdd({
      name,

      price: 0,

      purchasePrice:
        parseFloat(price) || 0,

      condition,

      language,

      type,

      storageType,

      purchaseSeller
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
    <div
      style={{
        marginTop: "10px"
      }}
    >
      <input
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

      <input
        type="number"
        placeholder="Einkaufspreis (€)"
        value={price}
        onChange={(e) =>
          setPrice(
            e.target.value
          )
        }
        onKeyDown={
          handleKeyDown
        }
      />

      <br />

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

      <br />
      <br />

      {/* 🔥 Herkunft */}
      Herkunft / Verkäufer:

      <input
        value={purchaseSeller}
        onChange={(e) =>
          setPurchaseSeller(
            e.target.value
          )
        }
        onKeyDown={
          handleKeyDown
        }
        style={{
          marginLeft: "5px",
          width: "250px"
        }}
      />

      <br />
      <br />

      <button onClick={handleSubmit}>
        Speichern
      </button>
    </div>
  );
}