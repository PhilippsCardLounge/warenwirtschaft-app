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

// 🆕 Default-Werte
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

// 🔢 Nummer generieren
export function generateInventoryNumber(type, settings) {
  const key = TYPE_KEYS[type];

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

  return "ERROR";
}

// 🔢 Nummernwert extrahieren
export function extractInventoryNumberValue(number) {
  if (!number) return 0;

  const cleaned = number
    .toString()
    .replace(/[^0-9]/g, "");

  return parseInt(cleaned, 10) || 0;
}

// ➕ Counter erhöhen
export async function incrementInventoryNumber(
  type,
  settings,
  inventoryNumber
) {
  const key = TYPE_KEYS[type];

  if (!key || settings[key] === undefined) {
    console.error("❌ Increment Fehler:", type, settings);
    return settings;
  }

  const usedValue =
    extractInventoryNumberValue(inventoryNumber);

  const nextValue = Math.max(
    settings[key],
    usedValue + 1
  );

  await updateDoc(SETTINGS_DOC, {
    [key]: nextValue
  });

  return {
    ...settings,
    [key]: nextValue
  };
}

