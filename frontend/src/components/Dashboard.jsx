import { useState, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar.jsx";
import LiveMap from "./LiveMap.jsx";
import TelemetryPanel from "./TelemetryPanel.jsx";
import SystemHealth from "./SystemHealth.jsx";
import RoutePlanner from "./RoutePlanner.jsx";
import HelmetSync from "./HelmetSync.jsx";
import WarningsPanel from "./WarningsPanel.jsx";

export default function Dashboard({ api, token, flightActive, toggleFlight }) {
  const [view, setView] = useState("command");
  const [telemetry, setTelemetry] = useState({
    altitude: 0,
    speed: 0,
    heading: 0,
    battery: 100,
    temperature: 22,
    signalStrength: 98,
    latitude: 52.3676,
    longitude: 4.9041,
  });
  const [systemStatus, setSystemStatus] = useState({
    helm: { online: true, status: "Nominal", battery: 92 },
    jas: { online: true, status: "Nominal", battery: 88 },
    handschoenen: { online: true, status: "Nominal", battery: 95 },
    schoenen: { online: true, status: "Nominal", battery: 90 },
  });
  const [warnings, setWarnings] = useState([]);
  const [route, setRoute] = useState(null);
  const [time, setTime] = useState("");

  const authFetch = useCallback(
    async (url, options = {}) => {
      return fetch(api + url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      });
    },
    [api, token]
  );

  // Live clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate telemetry updates (replace with real socket.io later)
  useEffect(() => {
    if (!flightActive) return;
    const interval = setInterval(() => {
      setTelemetry((prev) => ({
        ...prev,
        altitude: Math.max(0, prev.altitude + (Math.random() - 0.5) * 10),
        speed: Math.max(0, prev.speed + (Math.random() - 0.5) * 5),
        heading: (prev.heading + (Math.random() - 0.5) * 2) % 360,
        battery: Math.max(0, prev.battery - 0.01),
        latitude: prev.latitude + (Math.random() - 0.5) * 0.001,
        longitude: prev.longitude + (Math.random() - 0.5) * 0.001,
      }));

      // Random warnings for demo
      if (Math.random() < 0.02) {
        setWarnings((prev) => [
          ...prev.slice(-4),
          {
            id: Date.now(),
            type: Math.random() > 0.5 ? "warning" : "info",
            message: Math.random() > 0.5
              ? "Wind shift detected — adjust heading"
              : "No-fly zone approaching — 2.4 km ahead",
          },
        ]);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [flightActive]);

  const handleRoutePlan = useCallback(
    async (origin, destination) => {
      try {
        const res = await authFetch("/api/routes/plan", {
          method: "POST",
          body: JSON.stringify({ origin, destination }),
        });
        const data = await res.json();
        if (data.success) setRoute(data.route);
      } catch (e) {
        console.error("Route plan failed:", e);
      }
    },
    [authFetch]
  );

  const syncToHelmet = useCallback(async () => {
    if (!route) return;
    try {
      const res = await authFetch("/api/helmet/sync", {
        method: "POST",
        body: JSON.stringify({ route }),
      });
      const data = await res.json();
      if (data.success) {
        setWarnings((prev) => [
          ...prev.slice(-4),
          { id: Date.now(), type: "info", message: "✅ Route synced to helmet HUD" },
        ]);
      }
    } catch (e) {
      console.error("Helmet sync failed:", e);
    }
  }, [authFetch, route]);

  return (
    <div className="shell">
      <Sidebar
        view={view}
        setView={setView}
        flightActive={flightActive}
        systemStatus={systemStatus}
      />

      <div className="main">
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-title">
            AIRPATH <span>COMMAND</span> — {view === "command" ? "DASHBOARD" : view.toUpperCase()}
          </div>
          <div className="topbar-time">{time} ZULU</div>
        </div>

        <div className="content">
          {view === "command" && (
            <div className="dashboard-grid">
              {/* 3D Map */}
              <div className="map-area scan-effect">
                <LiveMap
                  telemetry={telemetry}
                  route={route}
                  flightActive={flightActive}
                />
                {flightActive && (
                  <div className="map-overlay">
                    FLIGHT ACTIVE — ALT: {telemetry.altitude.toFixed(0)}m
                  </div>
                )}
                {warnings.length > 0 && warnings[warnings.length - 1].type === "warning" && (
                  <div className="map-overlay warning" style={{ top: 50 }}>
                    ⚠ {warnings[warnings.length - 1].message}
                  </div>
                )}
              </div>

              {/* Telemetry */}
              <TelemetryPanel
                telemetry={telemetry}
                flightActive={flightActive}
                toggleFlight={toggleFlight}
              />

              {/* System Health */}
              <SystemHealth systemStatus={systemStatus} />

              {/* Warnings */}
              <WarningsPanel warnings={warnings} />
            </div>
          )}

          {view === "route" && (
            <RoutePlanner
              onRoutePlan={handleRoutePlan}
              route={route}
              syncToHelmet={syncToHelmet}
            />
          )}

          {view === "helmet" && (
            <HelmetSync route={route} syncToHelmet={syncToHelmet} />
          )}
        </div>
      </div>
    </div>
  );
}