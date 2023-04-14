// Map.tsx
import React, { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Talhoes from "./Talhoes";
import Rastros from "./Rastros";
import Maquinas from "./Maquinas";

const Map: React.FC = () => {
  const [position, setPosition] = useState<[number, number]>([
    -18.10243103, -49.75529447,
  ]);
  const [zoom, setZoom] = useState<number>(13);

  const frota = undefined;
  const frente = undefined;
  const startDate = undefined;
  const endDate = undefined;

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
        subdomains={["mt0", "mt1", "mt2", "mt3"]}
        maxZoom={99}
        attribution='&copy; <a href="https://www.google.com/intl/en_US/help/terms_maps.html">Google Maps</a>'
      />
      <Talhoes />
      <Rastros
        frota={frota}
        frente={frente}
        startDate={startDate}
        endDate={endDate}
      />
      <Maquinas
        frota={frota}
        frente={frente}
        startDate={startDate}
        endDate={endDate}
      />
    </MapContainer>
  );
};

export default Map;
