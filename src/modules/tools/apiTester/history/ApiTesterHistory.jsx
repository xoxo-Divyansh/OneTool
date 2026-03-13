"use client";

import LoadingSpinner, { InlineSpinner } from "@/components/UI/LoadingSpinner";
import ErrorAlert from "@/components/UI/ErrorAlert";

function formatTimestamp(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

export default function ApiTesterHistory({ entries, isLoading, error, onRefresh, onReplay }) {
  return (
    <section className="api-history-panel">
      <div className="api-history-head">
        <h3>Recent Runs</h3>
        <button type="button" className="cmd-btn flex items-center gap-2" onClick={onRefresh} disabled={isLoading}>
          {isLoading && <InlineSpinner />}
          {isLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <ErrorAlert
          type="error"
          message={error}
          onDismiss={() => {}}
          action={{
            label: "Retry",
            onClick: onRefresh
          }}
        />
      )}

      {isLoading && entries.length === 0 ? (
        <LoadingSpinner size="md" message="Loading history..." />
      ) : entries.length === 0 ? (
        <p className="api-history-empty">No runs yet. Send a request to start building history.</p>
      ) : (
        <div className="api-history-table-wrap">
          <table className="api-history-table">
            <thead>
              <tr>
                <th>Method</th>
                <th>URL</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry?.request?.method || "-"}</td>
                  <td className="api-history-url">{entry?.request?.url || "-"}</td>
                  <td>{entry?.response?.status || "Error"}</td>
                  <td>{entry?.response?.durationMs ?? entry?.meta?.duration ?? "-"} ms</td>
                  <td>{formatTimestamp(entry.createdAt)}</td>
                  <td>
                    <button type="button" className="cmd-btn" onClick={() => onReplay(entry)}>
                      Replay
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
