export default function ToolLayout({ title, description, children }) {
  return (
    <section className="tool-page">
      <header className="tool-header">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </header>
      {children}
    </section>
  );
}

