import { useState } from "react";

export default function RoutePlanner({ onRoutePlan, route, syncToHelmet }) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePlan = async () => {
    if (!origin.trim() || !destination.trim()) return;
    setLoading(true);
    await onRoutePlan(origin, destination);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500 }}>
      <div className="card">
        <div className="card-header">
          <span className="card-title">Route Planner</span>
        </div>

        <div className="route-form">
          <input
            className="route-input"
            placeholder="Origin (e.g., Rotterdam)"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
          <input
            className="route-input"
            placeholder="Destination (e.g., Amsterdam)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <button
            className="btn-cyan"
            onClick={handlePlan}
            disabled={loading}
          >
            {loading ? "Calculating..." : "◎ Calculate Route"}
          </button>
        </div>

        {route && (
          <div
            style={{
              marginTop: 12,
              padding: 12,
              background: "rgba(0, 229, 255, 0.05)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              fontSize: 12,
              color: "var(--cyan)",
            }}
          >
            <div>Route: {route.origin} → {route.destination}</div>
            <div>Distance: {route.distance} km</div>
            <div>ETA: {route.eta} min</div>
            <div>Altitude: {route.altitude}m</div>
            <button
              className="btn-violet"
              style={{ marginTop: 10 }}
              onClick={syncToHelmet}
            >
              ⚡ Sync to Helmet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}