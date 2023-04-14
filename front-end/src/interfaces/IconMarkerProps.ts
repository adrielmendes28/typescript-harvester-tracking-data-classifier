import { DataPoint } from "./DataPoint";
import L from "leaflet";

export type IconMarkerProps = {
  position: L.LatLngExpression;
  data: DataPoint;
  getIcon: (categoria: string) => string;
  handleClick: () => void;
  handleCloseTooltip: () => void;
  showTooltip: boolean;
};
