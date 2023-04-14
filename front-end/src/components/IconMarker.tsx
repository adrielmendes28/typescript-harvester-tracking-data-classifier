import L from "leaflet";
import { Marker, Popup, Tooltip } from "react-leaflet";
import { IconMarkerProps } from "../interfaces/IconMarkerProps";

const IconMarker: React.FC<IconMarkerProps> = ({
  position,
  data,
  getIcon,
  handleClick,
  handleCloseTooltip,
  showTooltip,
}) => {
  const customIcon = L.icon({
    iconUrl: getIcon(data.categoria),
    iconSize: [60, 32],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
  });

  return (
    <>
      <Marker
        position={position}
        icon={customIcon}
        eventHandlers={{
          click: handleClick,
          popupclose: handleCloseTooltip,
        }}
      >
        <Popup>{data.frota}</Popup>
        {showTooltip && (
          <Tooltip permanent direction="right" offset={[20, 0]}>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </Tooltip>
        )}
      </Marker>
    </>
  );
};

export default IconMarker;
