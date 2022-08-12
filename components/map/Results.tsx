import { useRouter } from "next/router";

interface Props {}

// function fetchResults() {
//   return fetch("dummyData.json").then((res) => res.json());
// }

export default function Results({}: Props) {
  // const { data, isLoading } = useQuery(["results"], fetchReal);
  // console.log(data);

  const router = useRouter();

  return (
    <aside className="z-10 h-full w-2/6 bg-slate-200 shadow-[0_10px_10px_10px_rgba(0,0,0,0.15)]">
      {/* {data?.data?.map((_, id) => {
        <span key={id}>{id}</span>;
      })} */}
      <span>{JSON.stringify(router.query)}</span>
    </aside>
  );
}
