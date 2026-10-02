import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import API from "../services/api";
import { STATUS } from "../constants/options";

const Ctx = createContext(null);
export const useParticipants = () => useContext(Ctx);

export function ParticipantsProvider({ children }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    try {
      setRows((await API.get("/api/participants")).data);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const add = async (d) => {
    await API.post("/api/participants", d);
    await load();
  };
  const update = async (id, d) => {
    await API.put(`/api/participants/${id}`, d);
    await load();
  };
  const remove = async (id) => {
    await API.delete(`/api/participants/${id}`);
    await load();
  };
  const counts = {
    Semua: rows.length,
    ...Object.fromEntries(
      STATUS.map((s) => [s, rows.filter((r) => r.status === s).length]),
    ),
  };
  return (
    <Ctx.Provider value={{ rows, loading, counts, add, update, remove }}>
      {children}
    </Ctx.Provider>
  );
}
