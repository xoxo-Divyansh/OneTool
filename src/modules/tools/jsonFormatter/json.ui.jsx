export default function JsonFormatterUI({ defaults }) {
  return (
    <section className="tool-page">
      <h1>JSON Formatter</h1>
      <p>Validate and format JSON payloads quickly.</p>
      <pre>{defaults.input}</pre>
    </section>
  );
}
