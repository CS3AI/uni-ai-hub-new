"use client";
export default function LogoImg({ src, alt, size = 28 }) {
  if (!src) return null;
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="rounded object-contain flex-shrink-0"
      onError={(e) => { e.target.style.display = "none"; }}
    />
  );
}
