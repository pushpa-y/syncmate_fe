import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/Authcontext";
import { getEntries } from "../services/Entry";
import type { Entry } from "../services/Entry";
import ChartsSection from "../components/charts/ChartsSection";

const Analytics = () => {
  const auth = useContext(AuthContext);
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    if (!auth?.token) return;
    const token = auth.token; 
    const fetchAllEntries = async () => {
      try {
        const res = await getEntries(token, {
          page: 1,
          limit: 1000, 
        });
        setEntries(res.data.entries);
      } catch (err) {
        console.error("Error fetching analytics data:", err);
      }
    };

    fetchAllEntries();
  }, [auth?.token]);

  return <ChartsSection entries={entries} />;
};

export default Analytics;