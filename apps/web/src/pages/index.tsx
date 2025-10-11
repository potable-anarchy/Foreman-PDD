import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import RunList from "../components/RunList";

/**
 * Home component that displays the PDD Foreman Agent dashboard
 * Shows build history, loading states, and quick start information
 */
export default function Home() {
  // Query the latest 20 runs from the database
  const runs = useQuery(api.runs.listRuns, { limit: 20 });

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "2rem",
          borderBottom: "1px solid #dddddd",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "2.5rem",
            color: "#333333",
            fontWeight: "bold",
          }}
        >
          🏗️ PDD Foreman Agent
        </h1>
        <p
          style={{
            margin: "0.5rem 0 0 0",
            color: "#666666",
            fontSize: "1.1rem",
          }}
        >
          Build History & Real-time Status
        </p>
      </header>

      {/* Main Content */}
      <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Build History Section */}
        <section style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "1.5rem",
              color: "#333333",
              marginBottom: "1rem",
              fontWeight: "600",
            }}
          >
            Recent Builds
          </h2>

          {runs === undefined ? (
            // Loading state - displayed while data is being fetched
            <div
              style={{
                padding: "3rem",
                textAlign: "center",
                color: "#666666",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  marginBottom: "1rem",
                }}
              >
                ⏳
              </div>
              <p>Loading builds...</p>
            </div>
          ) : runs.length === 0 ? (
            // Empty state - displayed when no builds exist
            <div
              style={{
                padding: "3rem",
                textAlign: "center",
                color: "#666666",
                border: "2px dashed #dddddd",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "3rem",
                  marginBottom: "1rem",
                }}
              >
                🚀
              </div>
              <h3 style={{ margin: "0 0 0.5rem 0", color: "#333333" }}>
                No builds yet
              </h3>
              <p style={{ margin: 0 }}>
                Start your first build to see it here!
              </p>
            </div>
          ) : (
            // Render runs when data is available
            <RunList runs={runs} />
          )}
        </section>

        {/* Quick Start Section */}
        <section
          style={{
            backgroundColor: "#f8f9fa",
            padding: "2rem",
            borderRadius: "8px",
            border: "1px solid #dddddd",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              color: "#333333",
              marginBottom: "1rem",
              fontWeight: "600",
            }}
          >
            🚀 Quick Start
          </h2>
          <p
            style={{
              color: "#666666",
              marginBottom: "1rem",
            }}
          >
            Get started with these example commands:
          </p>
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "1rem",
              borderRadius: "4px",
              border: "1px solid #dddddd",
              fontFamily: "Monaco, Consolas, monospace",
              fontSize: "0.9rem",
            }}
          >
            <div style={{ marginBottom: "0.5rem" }}>
              <code style={{ color: "#0066cc" }}>foreman build</code> - Start a
              new build
            </div>
            <div style={{ marginBottom: "0.5rem" }}>
              <code style={{ color: "#0066cc" }}>foreman status</code> - Check
              current status
            </div>
            <div>
              <code style={{ color: "#0066cc" }}>foreman logs</code> - View
              build logs
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: "2rem",
          textAlign: "center",
          borderTop: "1px solid #dddddd",
          color: "#666666",
          fontSize: "0.9rem",
        }}
      >
        <p style={{ margin: 0 }}>
          Built with ❤️ using{" "}
          <a
            href="https://convex.dev"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#0066cc", textDecoration: "none" }}
          >
            Convex
          </a>{" "}
          and{" "}
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#0066cc", textDecoration: "none" }}
          >
            Next.js
          </a>
        </p>
      </footer>
    </div>
  );
}
