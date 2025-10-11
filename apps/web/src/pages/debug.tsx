import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

/**
 * Debug page to check Convex connection and data
 */
export default function Debug() {
  const runs = useQuery(api.runs.listRuns, { limit: 20 });

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>Debug Page</h1>

      <h2>Environment Variables:</h2>
      <pre>{JSON.stringify({
        NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
      }, null, 2)}</pre>

      <h2>Query State:</h2>
      <p>runs === undefined: {String(runs === undefined)}</p>
      <p>runs === null: {String(runs === null)}</p>
      <p>Array.isArray(runs): {String(Array.isArray(runs))}</p>

      <h2>Runs Data:</h2>
      <pre>{JSON.stringify(runs, null, 2)}</pre>

      <h2>Raw Data:</h2>
      <p>{typeof runs}</p>
    </div>
  );
}
