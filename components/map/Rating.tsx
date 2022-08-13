import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";

export default function Rating({
  rating,
  className = "",
}: {
  rating: number;
  className?: string;
}) {
  return (
    <div className={`flex text-amber-400 ${className}`}>
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
