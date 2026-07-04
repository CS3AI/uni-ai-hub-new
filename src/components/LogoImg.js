"use client";
import { useState } from "react";

export default function LogoImg({ src, alt, size, className = "", wrapperClass }) {
  const [hidden, setHidden] = useState(false);

  if (!src || hidden) return null;

  const hide = (e) => {
    // Hide the wrapper column (or just the img if no wrapper)
    const target = wrapperClass ? e.currentTarget.parentElement : e.currentTarget;
    if (target) target.style.display = "none";
    setHidden(true);
  };

  // Wikimedia "file not found" pages return HTTP 200 with HTML content,
  // so onError never fires — the img loads but has naturalWidth === 0.
  const handleLoad = (e) => {
    if (e.currentTarget.naturalWidth === 0) hide(e);
  };

  const img = (
    <img
      src={src}
      alt={alt}
      style={size ? { width: size, height: size } : undefined}
      className={`object-contain rounded ${className}`}
      onError={hide}
      onLoad={handleLoad}
    />
  );

  if (wrapperClass) return <div className={wrapperClass}>{img}</div>;
  return img;
}
