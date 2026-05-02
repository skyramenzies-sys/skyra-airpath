export default function Sidebar({ view, setView, flightActive, systemStatus }) {
  const allOnline = Object.values(systemStatus).every((s) => s.online);

  const navItems = [
    { id: "command", icon: "◈", label: "Command Center" },
    { id: "route", icon: "◎", label: "Route Planner" },
    { id: "helmet", icon: "◉", label: "Helmet Sync" },
    { id: "logs", icon: "▣", label: "Flight Logs" },
    { id: "settings", icon: "⚙", label: "Settings" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        SKYRA
        <span>AIRPATH OS v1.0</span>
      </div>

      <div className="nav-section">
        <div className="nav-label">Navigation</div>
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-btn ${view === item.id ? "active" : ""}`}
            onClick={() => setView(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="status-dot" style={{ color: allOnline ? "var(--green)" : "var(--red)" }}>
          {allOnline ? "All Systems Nominal" : "System Fault Detected"}
        </div>
        {flightActive && (
          <div
            style={{
              marginTop: 8,
              fontSize: 10,
              color: "var(--cyan)",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.1em",
              textAlign: "center",
            }}
          >
            ◈ FLIGHT ACTIVE ◈
          </div>
        )}
      </div>
    </aside>
  );
}