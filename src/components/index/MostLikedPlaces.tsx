import { useGetMostFavorites } from "@/utils/useQueryMostFavorites";

interface Props {}

export default function MostLikedPlaces({}: Props) {
  const { data: mostFavData } = useGetMostFavorites();

  return (
    <div className="container mx-auto bg-slate-100 py-20 text-center">
      <h3 className="py-5 text-4xl">Most liked places</h3>
      <div></div>
    </div>
  );
}
