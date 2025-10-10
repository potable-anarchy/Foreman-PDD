import { Id } from "../../convex/_generated/dataModel";

/**
 * Interface representing a run record with execution details
 */
interface Run {
  _id: Id<"runs">;
  specName: string;
  startedAt: number;
  endedAt?: number;
  status: "planning" | "building" | "testing" | "done" | "error";
  summary: string;
  totalCost?: number;
  attempts?: number;
}

/**
 * Props interface for the RunList component
 */
interface RunListProps {
  runs: Run[];
}

/**
 * RunList component displays a list of runs with their status, duration, cost, and other details
 * @param runs - Array of Run objects to display
 * @returns JSX element containing the formatted run list
 */
export default function RunList({ runs }: RunListProps) {
  /**
   * Formats a timestamp into a human-readable date string
   * @param timestamp - Unix timestamp in milliseconds
   * @returns Formatted date string
   */
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  /**
   * Calculates and formats the duration between start and end times
   * @param startedAt - Start timestamp in milliseconds
   * @param endedAt - Optional end timestamp in milliseconds
   * @returns Formatted duration string or "Running..." if still in progress
   */
  const formatDuration = (startedAt: number, endedAt?: number): string => {
    if (!endedAt) return "Running...";
    const duration = endedAt - startedAt;
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  /**
   * Formats cost value into a currency string
   * @param cost - Optional cost value
   * @returns Formatted cost string or "Free" if no cost
   */
  const formatCost = (cost?: number): string => {
    if (!cost || cost === 0) return "Free";
    return `$${cost.toFixed(4)}`;
  };

  /**
   * Returns styling configuration for different run statuses
   * @param status - The current status of the run
   * @returns Object containing color, background, and emoji for the status
   */
  const getStatusConfig = (status: Run["status"]) => {
    const configs = {
      planning: { color: "#3b82f6", bg: "#eff6ff", emoji: "📋" },
      building: { color: "#f59e0b", bg: "#fffbeb", emoji: "🔨" },
      testing: { color: "#8b5cf6", bg: "#f5f3ff", emoji: "🧪" },
      done: { color: "#10b981", bg: "#ecfdf5", emoji: "✅" },
      error: { color: "#ef4444", bg: "#fef2f2", emoji: "❌" },
    };
    return configs[status];
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {runs.map((run) => {
        const statusConfig = getStatusConfig(run.status);

        return (
          <div
            key={run._id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "16px",
              backgroundColor: "#ffffff",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "12px",
              }}
            >
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#111827",
                  }}
                >
                  {run.specName}
                </h3>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "500",
                      color: statusConfig.color,
                      backgroundColor: statusConfig.bg,
                      textTransform: "capitalize",
                    }}
                  >
                    {statusConfig.emoji} {run.status}
                  </span>
                  {run.attempts && run.attempts > 1 && (
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>
                      Attempt {run.attempts}
                    </span>
                  )}
                </div>
              </div>
              <div
                style={{
                  textAlign: "right",
                  fontSize: "14px",
                  color: "#374151",
                }}
              >
                <div style={{ marginBottom: "4px" }}>
                  {formatDuration(run.startedAt, run.endedAt)}
                </div>
                <div style={{ fontWeight: "500" }}>
                  {formatCost(run.totalCost)}
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "12px",
                backgroundColor: "#f9fafb",
                borderRadius: "6px",
                marginBottom: "12px",
                fontSize: "14px",
                color: "#6b7280",
                lineHeight: "1.5",
              }}
            >
              {run.summary}
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "#9ca3af",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Started: {formatDate(run.startedAt)}</span>
              {run.endedAt && <span>Ended: {formatDate(run.endedAt)}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
