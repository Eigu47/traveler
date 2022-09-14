import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";

interface Props {
  rating: number;
}

export function Rating({ rating }: Props) {
  return (
    <div className="flex justify-center text-base text-amber-400 md:text-xl">
      {rating < 1 ? <BsStarHalf /> : <BsStarFill />}
      {rating < 2 ? <BsStar /> : rating < 1.5 ? <BsStarHalf /> : <BsStarFill />}
      {rating < 3 ? <BsStar /> : rating < 3.5 ? <BsStarHalf /> : <BsStarFill />}
      {rating < 4 ? <BsStar /> : rating < 4.5 ? <BsStarHalf /> : <BsStarFill />}
      {rating < 5 ? (
        <BsStar />
      ) : rating < 4.75 ? (
        <BsStarHalf />
      ) : (
        <BsStarFill />
      )}
    </div>
  );
}
