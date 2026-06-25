export default function PageHeader({ eyebrow, title, description, meta }) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
          {eyebrow}
        </p>
      )}
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h1>
      {description && (
        <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p>
      )}
      {meta && <p className="mt-3 text-xs text-muted">{meta}</p>}
    </div>
  );
}
