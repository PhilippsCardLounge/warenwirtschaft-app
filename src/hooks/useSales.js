import { useEffect, useState } from "react";
import { getSales } from "../services/salesService";

export function useSales() {
  const [sales, setSales] = useState([]);

  async function loadSales() {
    const data = await getSales();
    setSales(data);
  }

  useEffect(() => {
    loadSales();
  }, []);

  return {
    sales,
    reloadSales: loadSales
  };
}