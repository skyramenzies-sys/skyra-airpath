export default function HelmetSync({ route, syncToHelmet }) {
  return (
    <div style={{ maxWidth: 500 }}>
      <div className="card">
        <div className="card-header">
          <span className="card-title">Helmet HUD Sync</span>
          <span className="card-badge online">CONNECTED</span>
        </div>

        <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8 }}>
          <p>Push flight data, routes, and warnings directly to the SKYRA helmet HUD.</p>

          {route ? (
            <div
              style={{
                marginTop: 12,
                padding: 12,
                background: "rgba(123, 47, 255, 0.08)",
                border: "1px solid rgba(123, 47, 255, 0.25)",
                borderRadius: 10,
                fontSize: 12,
              }}
            >
              <div style={{ color: "var(--violet)", fontWeight: 700, marginBottom: 6 }}>
                Current Route Ready
              </div>
              <div style={{ color: "var(--text-secondary)" }}>
                {route.origin} → {route.destination}
              </div>
            </div>
          ) : (
            <div
              style={{
                marginTop: 12,
                padding: 12,
                background: "rgba(255, 184, 0, 0.05)",
                border: "1px solid rgba(255, 184, 0, 0.2)",
                borderRadius: 10,
                fontSize: 12,
                color: "var(--amber)",
              }}
            >
              No route planned. Go to Route Planner first.
            </div>
          )}

          <button
            className="btn-violet"
            style={{ marginTop: 12 }}
            onClick={syncToHelmet}
            disabled={!route}
          >
            ⚡ Sync to Helmet HUD
          </button>

          <div
            style={{
              marginTop: 16,
              padding: 12,
              background: "rgba(0, 255, 136, 0.05)",
              border: "1px solid rgba(0, 255, 136, 0.2)",
              borderRadius: 10,
              fontSize: 11,
              color: "var(--green)",
            }}
          >
            HUD Display Preview: SKYRA ONLINE — MODE: STANDBY — ROUTE: {route ? "INITIALIZED" : "NONE"} — SPEECH: READY
          </div>
        </div>
      </div>
    </div>
  );
}