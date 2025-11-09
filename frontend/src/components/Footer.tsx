import React from "react";

export default function Footer() {
  return (
    <footer style={{ background: "#f3f4f6", padding: 12, textAlign: "center" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", color: "#6b7280" }}>
        © {new Date().getFullYear()} GDPS — demo frontend
      </div>
    </footer>
  );
}
