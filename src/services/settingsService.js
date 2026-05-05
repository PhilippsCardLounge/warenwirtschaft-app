import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const SETTINGS_DOC = doc(db, "settings", "inventory");

// 🔑 Mapping Typ → Counter-Key
const TYPE_KEYS = {
  "Einzelkarte": "single",
  "Slab": "slab",
  "Sealed Promos": "sealed",
  "Booster/Box": "booster",
  "Merch": "merch"
};

// 🆕 Default-Werte (wird einmal erstellt)
const DEFAULT_SETTINGS = {
  single: 1,
  slab: 1,
  sealed: 1,
  booster: 1,
  merch: 1
};

// 📥 Settings laden oder erstellen
export async function getInventorySettings() {
  const snap = await getDoc(SETTINGS_DOC);

  if (!snap.exists()) {
    await setDoc(SETTINGS_DOC, DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }

  return snap.data();
}

// 🔢 Nummer generieren (FORMAT!)
export function generateInventoryNumber(type, settings) {
  const key = TYPE_KEYS[type];

  // ❗ Absicherung gegen falsche Typen / fehlende Settings
  if (!key || settings[key] === undefined) {
    console.error("❌ Ungültiger Typ oder Settings:", type, settings);
    return "ERROR";
  }

  const current = settings[key];

  // 🔷 Einzelkarte (#0001)
  if (type === "Einzelkarte") {
    return `#${String(current).padStart(4, "0")}`;
  }

  // 🔷 andere Typen
  if (type === "Slab") return `G${current}`;
  if (type === "Sealed Promos") return `S${current}`;
  if (type === "Booster/Box") return `B${current}`;
  if (type === "Merch") return `M${current}`;

  // ❗ Fallback (sollte nie passieren)
  console.error("❌ Fallback erreicht:", type);
  return "ERROR";
}

// ➕ Counter erhöhen
export async function incrementInventoryNumber(type, settings) {
  const key = TYPE_KEYS[type];

  if (!key || settings[key] === undefined) {
    console.error("❌ Increment Fehler:", type, settings);
    return settings;
  }

  const newValue = settings[key] + 1;

  await updateDoc(SETTINGS_DOC, {
    [key]: newValue
  });

  return {
    ...settings,
    [key]: newValue
  };
}