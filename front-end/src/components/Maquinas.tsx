import React, { useState, useEffect } from "react";
import { DataPoint } from "../interfaces/DataPoint";
import { FilterProps } from "../interfaces/FilterProps";
import { fetchMaquinas } from "../services/maquinas";
import CustomMarker from "./CustomMarker";

const Maquinas: React.FC<FilterProps> = ({
  frota,
  frente,
  startDate,
  endDate,
}) => {
  const [maquinas, setMaquinas] = useState<DataPoint[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchMaquinas(frota, frente, startDate, endDate);
      setMaquinas(data);
      fetchData();
    };

    fetchData();
  }, [frota, endDate, frente, startDate]);

  return (
    <>
      {maquinas.map((maquina, index) => (
        <CustomMarker
          key={index}
          position={{ lat: maquina.lat, lng: maquina.lon }}
          data={maquina}
        />
      ))}
    </>
  );
};

export default Maquinas;
