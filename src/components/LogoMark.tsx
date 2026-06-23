import Image from "next/image";
import { assets } from "@/lib/content";

// Spinning gear ring with two chevrons (Λ + V) that converge into an X and part again.
export default function LogoMark() {
  return (
    <span className="relative grid size-14 shrink-0 place-items-center">
      <Image src={assets.gear} alt="" width={56} height={56} className="logo-gear size-14" />
      <span className="absolute inset-0 grid place-items-center">
        <Image
          src={assets.monogramA}
          alt=""
          width={18}
          height={13}
          className="logo-chev-up w-[17px] [grid-area:1/1]"
        />
        <Image
          src={assets.monogramV}
          alt=""
          width={18}
          height={13}
          className="logo-chev-down w-[17px] [grid-area:1/1]"
        />
      </span>
    </span>
  );
}
