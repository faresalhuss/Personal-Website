"use client";

/**
 * Replaces the root layout if it throws, so it can't rely on globals.css being
 * applied. Kept minimal with inline styles, on-brand (black + lime).
 */
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
          color: "#fff",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "32rem" }}>
          <p
            style={{
              color: "#dbff00",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            Something broke
          </p>
          <h1 style={{ fontSize: "2.25rem", lineHeight: 1.1, margin: "1rem 0" }}>
            That wasn&rsquo;t supposed to happen
          </h1>
          <p style={{ color: "#a6a6a6", marginBottom: "1.75rem" }}>
            Try again, or reload the page.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              background: "#dbff00",
              color: "#000",
              border: 0,
              borderRadius: "999px",
              padding: "0.85rem 1.5rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
