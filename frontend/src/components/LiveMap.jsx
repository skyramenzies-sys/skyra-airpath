import { useEffect, useRef } from "react";

// Note: Requires Mapbox GL JS. Install with: npm install mapbox-gl
// Add your Mapbox token in .env: VITE_MAPBOX_TOKEN=pk.xxx...

export default function LiveMap({ telemetry, route, flightActive }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);

  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "YOUR_MAPBOX_TOKEN_HERE";

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Dynamic import to avoid SSR issues
    import("mapbox-gl").then((mapboxgl) => {
      mapboxgl.default.accessToken = MAPBOX_TOKEN;

      map.current = new mapboxgl.default.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [telemetry.longitude, telemetry.latitude],
        zoom: 14,
        pitch: 60,
        bearing: 0,
        antialias: true,
      });

      map.current.on("style.load", () => {
        // Add 3D terrain
        map.current.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
          maxzoom: 14,
        });
        map.current.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

        // Add sky layer
        map.current.addLayer({
          id: "sky",
          type: "sky",
          paint: {
            "sky-type": "atmosphere",
            "sky-atmosphere-sun": [0.0, 0.0],
            "sky-atmosphere-sun-intensity": 15,
          },
        });
      });

      // Create marker
      const el = document.createElement("div");
      el.style.width = "20px";
      el.style.height = "20px";
      el.style.background = "#00E5FF";
      el.style.borderRadius = "50%";
      el.style.boxShadow = "0 0 20px rgba(0, 229, 255, 0.8)";
      el.style.border = "2px solid #fff";

      marker.current = new mapboxgl.default.Marker(el)
        .setLngLat([telemetry.longitude, telemetry.latitude])
        .addTo(map.current);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [MAPBOX_TOKEN]);

  // Update marker position
  useEffect(() => {
    if (marker.current) {
      marker.current.setLngLat([telemetry.longitude, telemetry.latitude]);
    }
    if (map.current) {
      map.current.easeTo({
        center: [telemetry.longitude, telemetry.latitude],
        bearing: telemetry.heading,
        pitch: 60,
        duration: 2000,
      });
    }
  }, [telemetry.latitude, telemetry.longitude, telemetry.heading]);

  return (
    <div
      ref={mapContainer}
      style={{ width: "100%", height: "100%", minHeight: 400 }}
    />
  );
}