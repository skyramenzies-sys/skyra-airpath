import { useState, useCallback } from "react";
import Dashboard from "./components/Dashboard.jsx";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [flightActive, setFlightActive] = useState(false);
  const [token] = useState(localStorage.getItem("skyra_token") || "demo-token");

  const toggleFlight = useCallback(async () => {
    if (flightActive) {
      setFlightActive(false);
      try {
        await fetch(`${API}/api/flight/stop`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (e) { console.error("Stop flight failed:", e); }
    } else {
      setFlightActive(true);
      try {
        await fetch(`${API}/api/flight/start`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (e) { console.error("Start flight failed:", e); }
    }
  }, [flightActive, token]);

  return (
    <div className={flightActive ? "flight-active" : ""}>
      <Dashboard
        api={API}
        token={token}
        flightActive={flightActive}
        toggleFlight={toggleFlight}
      />
    </div>
  );
}