import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { fetchSummary } from "../services/summary";
import "./DraggableTable.css";

interface EquipmentSummary {
  frota: string;
  frente: string;
  tsd: string;
  status: string;
  paired: string;
}

const DraggableTable: React.FC = () => {
  const [summaryData, setSummaryData] = useState<EquipmentSummary[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        const data = await fetchSummary();
        setSummaryData(data);
        fetchData();
      };
  
      fetchData();
  }, []);

  return (
    <Draggable>
      <div className="table-container">
        <table className="summary-table">
          <thead>
            <tr>
              <th>Frota</th>
              <th>Frente</th>
              <th>Timestamp</th>
              <th>Status</th>
              <th>Paired</th>
            </tr>
          </thead>
          <tbody>
            {summaryData.map((item, index) => (
              <tr key={index}>
                <td>{item.frota}</td>
                <td>{item.frente}</td>
                <td>{item.tsd}</td>
                <td>{item.status ?? 'Sem informação'}</td>
                <td>{item.paired ?? 'Sozinho'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Draggable>
  );
};

export default DraggableTable;
