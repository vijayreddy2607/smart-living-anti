import {
  AlertCircle,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

interface ErrorDetail {
  error_code: string;
  message: string;
  resolution_hint: string;
  invalid_fields?: string[];
}

interface Props {
  error: ErrorDetail | string;
  onRetry: () => void;
}

const ERROR_ICONS: Record<string, string> = {
  VALIDATION_FAILED:       "⚠️",
  MATHEMATICAL_DEFICIT:    "💸",
  NO_VIABLE_AREAS_FOUND:   "🗺️",
};

export function ErrorDisplay({ error, onRetry }: Props) {
  const isStructured = typeof error === "object" && error !== null;

  const errorObj: ErrorDetail = isStructured
    ? error
    : { error_code: "UNKNOWN_ERROR", message: String(error), resolution_hint: "Try again or adjust your inputs." };

  const icon = ERROR_ICONS[errorObj.error_code] ?? "❌";

  return (
    <div className="glass-card p-8 text-center fade-in-up" style={{ borderColor: "rgba(251, 113, 133, 0.3)" }}>
      <div className="text-5xl mb-4">{icon}</div>
      <h2 className="text-xl font-bold mb-2" style={{ color: "var(--accent-rose)" }}>
        {errorObj.error_code.replace(/_/g, " ")}
      </h2>
      <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
        {errorObj.message}
      </p>

      <div
        className="rounded-xl p-4 mb-5 text-left text-sm"
        style={{ background: "var(--bg-elevated)", color: "var(--text-primary)" }}
      >
        <p className="font-semibold mb-1" style={{ color: "var(--accent-amber)" }}>
          💡 Suggestion
        </p>
        <p style={{ color: "var(--text-secondary)" }}>{errorObj.resolution_hint}</p>
      </div>

      {errorObj.invalid_fields && errorObj.invalid_fields.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-5">
          {errorObj.invalid_fields.map((f) => (
            <span key={f} className="badge badge-danger">
              <AlertCircle size={12} /> {f}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-3 justify-center">
        <button onClick={onRetry} className="btn-primary">
          <ArrowLeft size={16} />
          Adjust Inputs
        </button>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
            color: "var(--text-secondary)",
          }}
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    </div>
  );
}
