"use client";
export default function LogoImg({ src, alt, size, className = "", wrapperClass }) {
  if (!src) return null;

  const handleError = (e) => {
    // If wrapped, hide the whole column; otherwise just hide the img
    const target = wrapperClass ? e.currentTarget.parentElement : e.currentTarget;
    if (target) target.style.display = "none";
  };

  const img = (
    <img
      src={src}
      alt={alt}
      style={size ? { width: size, height: size } : undefined}
      className={`object-contain rounded ${className}`}
      onError={handleError}
    />
  );

  if (wrapperClass) {
    return <div className={wrapperClass}>{img}</div>;
  }
  return img;
}
