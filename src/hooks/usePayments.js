import {
  useEffect,
  useState
} from "react";

import {
  getPayments
} from "../services/paymentService";

export function usePayments() {
  const [payments, setPayments] =
    useState([]);

  async function loadPayments() {
    const data =
      await getPayments();

    setPayments(data);
  }

  useEffect(() => {
    loadPayments();
  }, []);

  return {
    payments,
    reloadPayments:
      loadPayments
  };
}