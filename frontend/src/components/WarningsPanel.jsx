export default function WarningsPanel({ warnings }) {
  return (
    <div className="card" style={{ gridColumn: "2 / 3" }}>
      <div className="card-header">
        <span className="card-title">Warnings & Alerts</span>
        <span className={`card-badge ${warnings.length > 0 ? "warning" : "online"}`}>
          {warnings.length} ACTIVE
        </span>
      </div>

      {warnings.length === 0 ? (
        <div style={{ fontSize: 13, color: "var(--text-muted)", fontStyle: "italic" }}>
          No active warnings. Systems clear.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {warnings.slice(-5).reverse().map((w) => (
            <div key={w.id} className={`warning-item ${w.type === "info" ? "amber" : ""}`}>
              <span className="warning-icon">{w.type === "warning" ? "⚠" : "ℹ"}</span>
              <span>{w.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}