import { DataPoint } from "./DataPoint";
import L from "leaflet";

export type LabelMarkerProps = {
  position: L.LatLngExpression;
  data: DataPoint;
  handleClick: () => void;
  handleCloseTooltip: () => void;
};
