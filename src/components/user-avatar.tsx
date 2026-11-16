"use client";

import { useState } from "react";

export function UserAvatar({ src, className = "" }: { src?: string | null; className?: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const imageSrc = src && failedSrc !== src ? src : null;

  return (
    <span className={`user-avatar ${className}`} aria-hidden="true">
      {imageSrc ? (
        <img src={imageSrc} alt="" onError={() => setFailedSrc(imageSrc)} />
      ) : (
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M3.5 6.5h17v11h-17z" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      )}
    </span>
  );
}
