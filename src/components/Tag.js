export default function Tag({ children, tone = "default" }) {
  const tones = {
    default: "bg-background text-muted",
    brand: "brand-gradient text-white",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
