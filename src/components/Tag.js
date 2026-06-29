export default function Tag({ children, tone = "default" }) {
  const tones = {
    default: "bg-background text-muted",
    brand:   "brand-gradient text-white",
    blue:    "bg-blue-600 text-white",
    green:   "bg-green-600 text-white",
    amber:   "bg-amber-500 text-white",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone] ?? tones.default}`}
    >
      {children}
    </span>
  );
}
