import Image from "next/image";

type SiteLogoMarkProps = {
  className?: string;
  width?: number;
  height?: number;
  alt?: string;
};

export function SiteLogoMark({ className, width = 42, height = 42, alt = "CEO JACK Learning Hub logo" }: SiteLogoMarkProps) {
  return <Image src="/assets/images/logo1.webp" alt={alt} className={className} width={width} height={height} sizes={`${width}px`} />;
}
