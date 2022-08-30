import { OverlayView } from "@react-google-maps/api";
import { SetStateAction } from "jotai";
import { NextRouter } from "next/router";
import { MdLocationPin } from "react-icons/md";
import { handleCenterMenu } from "./MapCanvasUtil";
import { Dispatch } from "react";

interface Props {
  centerMenu: google.maps.LatLngLiteral;
  router: NextRouter;
  setCenterMenu: Dispatch<
    SetStateAction<google.maps.LatLngLiteral | undefined>
  >;
}

export default function MapCanvasSearchMenu({
  centerMenu,
  router,
  setCenterMenu,
}: Props) {
  return (
    <OverlayView position={centerMenu} mapPaneName="overlayMouseTarget">
      <button
        onClick={() => handleCenterMenu(centerMenu, router, setCenterMenu)}
        className="m-1 flex items-center space-x-1 rounded-md bg-slate-50 px-2 py-2 text-sm shadow ring-1 ring-black/20 hover:bg-blue-200 md:space-x-2 md:py-2 md:px-3 md:text-lg"
      >
        <MdLocationPin className="-mx-1 select-none text-2xl text-blue-900" />
        <span>Search here</span>
      </button>
    </OverlayView>
  );
}
