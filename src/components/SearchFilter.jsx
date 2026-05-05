import { useState } from "react";

export default function SearchFilter({ onFilterChange }) {
  const [search, setSearch] = useState("");
  const [condition, setCondition] = useState("");
  const [language, setLanguage] = useState("");

  function handleChange(newValues) {
    const updated = {
      search,
      condition,
      language,
      ...newValues
    };

    onFilterChange(updated);
  }

  return (
    <div>
      <input
        placeholder="Suche..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          handleChange({ search: e.target.value });
        }}
      />

      <select
        value={condition}
        onChange={(e) => {
          setCondition(e.target.value);
          handleChange({ condition: e.target.value });
        }}
      >
        <option value="">Alle Zustände</option>
        <option value="NM">NM</option>
        <option value="EX">EX</option>
        <option value="GD">GD</option>
        <option value="PL">PL</option>
        <option value="PO">PO</option>
      </select>

      <select
        value={language}
        onChange={(e) => {
          setLanguage(e.target.value);
          handleChange({ language: e.target.value });
        }}
      >
        <option value="">Alle Sprachen</option>
        <option value="DE">DE</option>
        <option value="EN">EN</option>
        <option value="JP">JP</option>
      </select>
    </div>
  );
}