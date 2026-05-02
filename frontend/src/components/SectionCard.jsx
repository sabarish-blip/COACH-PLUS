export default function SectionCard({ title, children, defaultOpen = true }) {
  return (
    <details className="section-card" open={defaultOpen}>
      <summary>{title}</summary>
      <div className="section-content">{children}</div>
    </details>
  );
}
