import L from "leaflet";
import { Marker } from "react-leaflet";
import {
  colh0,
  colh135,
  colh180,
  colh225,
  colh270,
  colh315,
  colh45,
  colh90,
  trbd0,
  trbd135,
  trbd180,
  trbd225,
  trbd270,
  trbd315,
  trbd45,
  trbd90,
} from "../css";
import { ArrowMarkerProps } from "../interfaces/ArrowMarkerProps";

const ArrowMarker: React.FC<ArrowMarkerProps> = ({
  position,
  data,
  arrowMarkerStyle,
  handleClick,
}) => {
  const getModel = (head: number, categoria: string) => {
    let icone;
    const angulos = [0, 45, 90, 135, 180, 225, 270, 315];
    const anguloMaisProximo = angulos.reduce((prev, curr) => {
      return Math.abs(curr - head) < Math.abs(prev - head) ? curr : prev;
    });

    switch (anguloMaisProximo) {
      case 0:
        icone = categoria === "COLH" ? colh0 : trbd0;
        break;
      case 45:
        icone = categoria === "COLH" ? colh45 : trbd45;
        break;
      case 90:
        icone = categoria === "COLH" ? colh90 : trbd90;
        break;
      case 135:
        icone = categoria === "COLH" ? colh135 : trbd135;
        break;
      case 180:
        icone = categoria === "COLH" ? colh180 : trbd180;
        break;
      case 225:
        icone = categoria === "COLH" ? colh225 : trbd225;
        break;
      case 270:
        icone = categoria === "COLH" ? colh270 : trbd270;
        break;
      case 315:
        icone = categoria === "COLH" ? colh315 : trbd315;
        break;
      default:
        icone = categoria === "COLH" ? colh0 : trbd0;
        break;
    }

    return icone;
  };

  const createIconHTML = (
    categoria: string,
    arrowMarkerStyle: { transform: string },
    iconUrl: string
  ) => {
    const tratorSize = {
      width: 44, // Diminuímos o tamanho do trator
      height: 68, // Diminuímos o tamanho do trator
    };
    const colhedoraSize = {
      width: 74,
      height: 115,
    };

    const iconSize = categoria === "COLH" ? colhedoraSize : tratorSize;

    return `<div class="icon-container" style="transform: ${arrowMarkerStyle.transform};">
              <div class="icon-shape" style="width: ${iconSize.width}px; height: ${iconSize.height}px; background-image: url('${iconUrl}'); background-repeat: no; background-size: ${iconSize.width}px ${iconSize.height}px;">
              </div>
            </div>`;
  };

  const arrowIcon = L.divIcon({
    className: "custom-icon",
    iconSize: data.categoria === "COLH" ? [74, 115] : [44, 68], // Diminuímos o tamanho do trator
    html: createIconHTML(
      data.categoria,
      arrowMarkerStyle,
      getModel(data.head, data.categoria)
    ),
  });

  return (
    <Marker
      position={position}
      icon={arrowIcon}
      zIndexOffset={9999}
      eventHandlers={{ click: handleClick }}
    ></Marker>
  );
};

export default ArrowMarker;
