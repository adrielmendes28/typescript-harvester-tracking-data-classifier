import React, { useEffect, useState } from "react";
import { Polyline } from "react-leaflet";
import { DataPoint } from "../interfaces/DataPoint";
import { FilterProps } from "../interfaces/FilterProps";
import { fetchRastros } from "../services/rastros";

const Rastros: React.FC<FilterProps> = ({
  frota,
  frente,
  startDate,
  endDate,
}) => {
  const [rastros, setRastros] = useState<DataPoint[][]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const rastrosData = await fetchRastros(frota, frente, startDate, endDate);
      setRastros(rastrosData);
      fetchData();
    }

    fetchData();
  }, [frota, frente, startDate, endDate]);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <>
      {rastros.map((rastro, index) => {
        const coordinates = rastro.map((point) => [point.lat, point.lon]);
        return (
          <Polyline
            key={index}
            positions={coordinates as any} // Casting to `any` as a workaround for type incompatibility
            color={getRandomColor()}
            weight={3}
            opacity={0.8}
          />
        );
      })}
    </>
  );
};

export default Rastros;
