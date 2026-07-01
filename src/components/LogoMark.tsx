import Image from "next/image";
import { assets } from "@/lib/content";

// Spinning gear ring with two chevrons (Λ + V) that converge into an X and part again.
export default function LogoMark() {
  return (
    <span className="relative grid size-[68px] shrink-0 place-items-center">
      <Image src={assets.gear} alt="" width={68} height={68} className="logo-gear size-[68px]" />
      <span className="absolute inset-0 grid place-items-center">
        {/* ∨ on top */}
        <Image
          src={assets.monogramV}
          alt=""
          width={22}
          height={16}
          className="logo-chev-top w-[22px] [grid-area:1/1]"
        />
        {/* ∧ on bottom */}
        <Image
          src={assets.monogramA}
          alt=""
          width={22}
          height={16}
          className="logo-chev-bot w-[22px] [grid-area:1/1]"
        />
      </span>
    </span>
  );
}
