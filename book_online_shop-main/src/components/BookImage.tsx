"use client";

import { useState } from "react";

interface BookImageProps {
  src: string;
  alt: string;
  title: string;
  className?: string;
}

export default function BookImage({
  src,
  alt,
  title,
  className = "w-full h-full object-cover",
}: BookImageProps) {
  const [imageSrc, setImageSrc] = useState(src);

  const handleError = () => {
    setImageSrc(
      `https://via.placeholder.com/500x600?text=${encodeURIComponent(title)}`,
    );
  };

  return (
    <img src={imageSrc} alt={alt} className={className} onError={handleError} />
  );
}
