export default function ApiTesterUI({ defaults }) {
  return (
    <section className="tool-page">
      <h1>API Tester</h1>
      <p>
        Send requests and inspect responses from a single place. Default method:
        {" "}
        {defaults.method}
      </p>
    </section>
  );
}
