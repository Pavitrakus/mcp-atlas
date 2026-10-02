import Image from "next/image";
import type { Plate } from "@/data/plates";

export function PlateImage({ plate, priority = false, className = "" }: { plate: Plate; priority?: boolean; className?: string }) {
  return (
    <Image
      src={plate.src}
      alt={plate.alt}
      width={plate.width}
      height={plate.height}
      priority={priority}
      className={`h-auto w-full ${className}`}
      sizes="(min-width: 1180px) 1100px, 100vw"
    />
  );
}
