import React, { useState } from "react";
import {
  cacamba,
  caseii,
  pipa,
  plantadeira,
  trator,
  volvo,
} from "../css";
import { CustomMarkerProps } from "../interfaces/CustomMarkerProps";
import ArrowMarker from "./ArrowMarker";
import IconMarker from "./IconMarker";
import LabelMarker from "./LabelMarker";
import L from "leaflet";

const CustomMarker: React.FC<CustomMarkerProps> = ({ position, data }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    setShowTooltip(true);
  };

  const handleCloseTooltip = () => {
    setShowTooltip(false);
  };

  const arrowMarkerPosition = L.latLng(position);
  const arrowMarkerStyle = {
    transform: `rotate(${data.head}deg)`,
  };

  const getIcon = (categoria: string) => {
    let icone;
    switch (categoria) {
      case "TRBD":
        icone = trator;
        break;
      case "COLH":
        icone = caseii;
        break;
      case "PLAN":
        icone = plantadeira;
        break;
      case "REBOKE":
        icone = volvo;
        break;
      case "PIPAO":
        icone = pipa;
        break;
      case "PIPA":
        icone = pipa;
        break;
      case "CACAMBA":
        icone = cacamba;
        break;
      default:
        icone = trator;
        break;
    }
    return icone;
  };

  return (
    <>
      <IconMarker
        position={position}
        data={data}
        getIcon={getIcon}
        handleClick={handleClick}
        handleCloseTooltip={handleCloseTooltip}
        showTooltip={showTooltip}
      />
      <LabelMarker
        position={position}
        data={data}
        handleClick={handleClick}
        handleCloseTooltip={handleCloseTooltip}
      />
      <ArrowMarker
        position={arrowMarkerPosition}
        data={data}
        arrowMarkerStyle={arrowMarkerStyle}
        handleClick={handleClick}
      />
    </>
  );
};

export default CustomMarker;
