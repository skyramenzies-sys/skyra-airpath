const COMPONENTS = [
  { id: "helm", icon: "⛑", name: "Helmet", cls: "helm" },
  { id: "jas", icon: "🧥", name: "Flight Jacket", cls: "jas" },
  { id: "handschoenen", icon: "🧤", name: "Gloves", cls: "handschoenen" },
  { id: "schoenen", icon: "👟", name: "Boots", cls: "schoenen" },
];

export default function SystemHealth({ systemStatus }) {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">System Health</span>
        <span className="card-badge online">ALL NOMINAL</span>
      </div>

      <div className="system-grid">
        {COMPONENTS.map((comp) => {
          const status = systemStatus[comp.id];
          return (
            <div key={comp.id} className="system-item">
              <div className={`system-icon ${comp.cls}`}>{comp.icon}</div>
              <div className="system-info">
                <div className="system-name">{comp.name}</div>
                <div className="system-stat">
                  {status.online ? `● Online — ${status.battery}%` : "● Offline"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}