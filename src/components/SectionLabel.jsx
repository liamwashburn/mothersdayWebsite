export default function SectionLabel({ children }) {
  return (
    <div className="section-label">
      <div className="section-label__line section-label__line--left" />
      <span>{children}</span>
      <div className="section-label__line section-label__line--right" />
    </div>
  );
}
