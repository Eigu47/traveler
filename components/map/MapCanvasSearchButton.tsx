import { OverlayView } from "@react-google-maps/api";
import { MdLocationPin } from "react-icons/md";

interface Props {
  searchButton: google.maps.LatLngLiteral;
  handleSearchButton: () => void;
}

export default function MapCanvasSearchButton({
  searchButton,
  handleSearchButton,
}: Props) {
  return (
    <OverlayView position={searchButton} mapPaneName="overlayMouseTarget">
      <button
        onClick={() => handleSearchButton()}
        className="m-1 flex items-center space-x-1 rounded-md bg-slate-50 px-2 py-2 text-sm shadow ring-1 ring-black/20 hover:bg-blue-200 md:space-x-2 md:py-2 md:px-3 md:text-lg"
      >
        <MdLocationPin className="-mx-1 select-none text-2xl text-blue-900" />
        <span>Search here</span>
      </button>
    </OverlayView>
  );
}
