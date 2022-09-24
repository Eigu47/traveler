import { showResultsAtom } from "@/utils/store";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { MdGpsFixed } from "react-icons/md";
import { getCurrentPosition } from "./MapCanvasUtil";

interface Props {}

export default function MapCanvasGpsButton({}: Props) {
  const router = useRouter();
  const [showResults] = useAtom(showResultsAtom);

  return (
    <button
      onClick={() => getCurrentPosition(router)}
      className={`fixed right-4 rounded-lg bg-white p-1 text-4xl text-gray-600 shadow-md ring-1 ring-black/20 duration-300 hover:text-black lg:bottom-6 lg:transition-none ${
        showResults ? "bottom-72" : "bottom-12"
      }`}
    >
      <MdGpsFixed />
    </button>
  );
}
