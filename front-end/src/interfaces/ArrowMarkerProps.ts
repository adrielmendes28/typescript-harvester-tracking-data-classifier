import { DataPoint } from "./DataPoint";
import L from "leaflet";

export type ArrowMarkerProps = {
  position: L.LatLngExpression;
  data: DataPoint;
  arrowMarkerStyle: {
    transform: string;
  };
  handleClick: () => void;
};
