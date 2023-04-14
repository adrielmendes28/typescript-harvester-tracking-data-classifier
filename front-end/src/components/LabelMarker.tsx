import L from "leaflet";
import { Marker } from "react-leaflet";
import { LabelMarkerProps } from "../interfaces/LabelMarkerProps";

const LabelMarker: React.FC<LabelMarkerProps> = ({
  position,
  data,
  handleClick,
  handleCloseTooltip,
}) => {
  const label = L.divIcon({
    className: "marker-label",
    html: `<span>${data.frota}</span>`,
    iconSize: [80, 85],
  });

  return (
    <Marker
      position={position}
      zIndexOffset={999}
      icon={label}
      eventHandlers={{ click: handleClick, popupclose: handleCloseTooltip }}
    ></Marker>
  );
};

export default LabelMarker;
