import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// CORS
app.use(cors({
  origin: [FRONTEND_URL, "http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Health
app.get("/api/health", (_, res) => {
  res.json({ success: true, system: "SKYRA AIRPATH", version: "1.0.0", status: "NOMINAL" });
});

// Flight control
app.post("/api/flight/start", (req, res) => {
  console.log("🚀 Flight started");
  res.json({ success: true, mode: "FLIGHT_ACTIVE", timestamp: Date.now() });
});

app.post("/api/flight/stop", (req, res) => {
  console.log("🛬 Flight stopped");
  res.json({ success: true, mode: "STANDBY", timestamp: Date.now() });
});

// Route planning
app.post("/api/routes/plan", (req, res) => {
  const { origin, destination } = req.body;

  if (!origin || !destination) {
    return res.status(400).json({ success: false, error: "Origin and destination required" });
  }

  // Demo route — replace with real AI pathfinding
  const route = {
    origin,
    destination,
    distance: Math.round(50 + Math.random() * 100),
    eta: Math.round(10 + Math.random() * 30),
    altitude: Math.round(200 + Math.random() * 800),
    waypoints: [
      { lat: 51.9244, lng: 4.4777 },
      { lat: 52.0907, lng: 4.3117 },
      { lat: 52.3105, lng: 4.7683 },
    ],
  };

  console.log(`🗺️ Route planned: ${origin} → ${destination}`);
  res.json({ success: true, route });
});

// Helmet sync
app.post("/api/helmet/sync", (req, res) => {
  const { route } = req.body;

  if (!route) {
    return res.status(400).json({ success: false, error: "No route provided" });
  }

  console.log("⚡ Syncing to helmet HUD:", route.origin, "→", route.destination);
  res.json({ success: true, message: "Route synced to helmet HUD" });
});

// Telemetry (placeholder for real socket.io)
app.get("/api/telemetry", (req, res) => {
  res.json({
    success: true,
    telemetry: {
      altitude: Math.random() * 500,
      speed: Math.random() * 80,
      heading: Math.random() * 360,
      battery: 85 + Math.random() * 15,
      temperature: 20 + Math.random() * 10,
      signalStrength: 90 + Math.random() * 10,
    },
  });
});

// Start
app.listen(PORT, () => {
  console.log(`✅ SKYRA AIRPATH backend running on port ${PORT}`);
  console.log(`📍 Frontend: ${FRONTEND_URL}`);
});