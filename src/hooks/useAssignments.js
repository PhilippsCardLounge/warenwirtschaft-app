import {
  useEffect,
  useState
} from "react";

import {
  getAssignments
} from "../services/assignmentService";

export function useAssignments() {
  const [
    assignments,
    setAssignments
  ] = useState([]);

  async function loadAssignments() {
    const data =
      await getAssignments();

    setAssignments(data);
  }

  useEffect(() => {
    loadAssignments();
  }, []);

  return {
    assignments,
    reloadAssignments:
      loadAssignments
  };
}