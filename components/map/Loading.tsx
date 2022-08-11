import Image from "next/image";

export default function Loading() {
  return (
    <div className="relative flex w-full items-center justify-center bg-slate-200">
      <div className="absolute h-full w-full blur-sm">
        <Image
          src="/default-map.png"
          alt="Fallback image"
          objectFit="cover"
          layout="fill"
        />
      </div>
      <Image src="/loading.svg" alt="Loading..." height={200} width={200} />
    </div>
  );
}
