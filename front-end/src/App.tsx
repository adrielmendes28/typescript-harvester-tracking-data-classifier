import React from "react";
import "./App.css";
import "./index.css";
import DraggableTable from "./components/DraggableTable";
import Map from "./components/Map";

const App: React.FC = () => {
  return (
    <div className="App" style={{ height: "100vh", width: "100vw" }}>
      <DraggableTable />
      <Map />
    </div>
  );
};

export default App;
