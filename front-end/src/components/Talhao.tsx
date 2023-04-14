import React from 'react';
import { Polygon } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';

export interface Ponto {
  lat: number;
  lng: number;
}

export interface TalhaoType {
  C: string;
  pontos: Ponto[];
}

interface TalhaoProps {
  talhao: TalhaoType;
}

const Talhao: React.FC<TalhaoProps> = ({ talhao }) => {
  const { pontos } = talhao;
  const coordinates: LatLngTuple[] = pontos.map((ponto) => [ponto.lat, ponto.lng]);

  return (
    <Polygon
      positions={coordinates}
      color="green"
      fillColor="green"
      fillOpacity={0.2}
    />
  );
};

export default Talhao;