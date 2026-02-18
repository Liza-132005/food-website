import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

export default function RiderMap() {
  const [position, setPosition] = useState([28.6139, 77.2090]); // Delhi default

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => [
        prev[0] + (Math.random() - 0.5) * 0.001,
        prev[1] + (Math.random() - 0.5) * 0.001,
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <MapContainer center={position} zoom={15} style={{ height: "250px", width: "100%", borderRadius: "12px" }}>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} />
    </MapContainer>
  );
}
