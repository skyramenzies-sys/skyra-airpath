export default function TelemetryPanel({ telemetry, flightActive, toggleFlight }) {
  const batteryColor =
    telemetry.battery > 50 ? "green" : telemetry.battery > 20 ? "amber" : "red";

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Flight Telemetry</span>
        <span className={`card-badge ${flightActive ? "online" : "offline"}`}>
          {flightActive ? "ACTIVE" : "STANDBY"}
        </span>
      </div>

      <div className="telemetry-grid">
        <div className="telemetry-item">
          <span className="telemetry-label">Altitude</span>
          <span className="telemetry-value">
            {telemetry.altitude.toFixed(0)}
            <span className="telemetry-unit"> m</span>
          </span>
        </div>

        <div className="telemetry-item">
          <span className="telemetry-label">Speed</span>
          <span className="telemetry-value">
            {telemetry.speed.toFixed(1)}
            <span className="telemetry-unit"> km/h</span>
          </span>
        </div>

        <div className="telemetry-item">
          <span className="telemetry-label">Heading</span>
          <span className="telemetry-value">
            {telemetry.heading.toFixed(0)}
            <span className="telemetry-unit">°</span>
          </span>
        </div>

        <div className="telemetry-item">
          <span className="telemetry-label">Battery</span>
          <span className={`telemetry-value ${batteryColor}`}>
            {telemetry.battery.toFixed(1)}
            <span className="telemetry-unit">%</span>
          </span>
        </div>

        <div className="telemetry-item">
          <span className="telemetry-label">Temperature</span>
          <span className="telemetry-value green">
            {telemetry.temperature.toFixed(0)}
            <span className="telemetry-unit">°C</span>
          </span>
        </div>

        <div className="telemetry-item">
          <span className="telemetry-label">Signal</span>
          <span className="telemetry-value green">
            {telemetry.signalStrength}
            <span className="telemetry-unit"> dBm</span>
          </span>
        </div>
      </div>

      <div className="flight-controls">
        <button
          className={flightActive ? "btn-danger" : "btn-cyan"}
          onClick={toggleFlight}
        >
          {flightActive ? "◼ STOP FLIGHT" : "▶ START FLIGHT"}
        </button>
      </div>
    </div>
  );
}