import Image from "next/image";
import { Result } from "../../types/nearbySearchResult";

interface Props {
  place: Result;
}

export default function ResultCard({ place }: Props) {
  return (
    <article className="m-2 my-5 flex h-60 flex-col rounded-xl bg-slate-100 shadow">
      <div className="h-4/6 rounded-xl bg-slate-200">
        <div className="h-full w-40 p-2">
          <Image
            className="rounded bg-slate-300"
            src={`https://maps.googleapis.com/maps/api/place/photo?photo_reference=${place.photos[0].photo_reference}&maxheight=200&maxwidth=200&key=${process.env.NEXT_PUBLIC_MAP_API_KEY}`}
            alt={place.name}
            width={160}
            height={160}
          />
        </div>
      </div>
      <div className=""></div>
    </article>
  );
}
