import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header style={{ background: "#111827", color: "white", padding: "12px 16px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", gap: 16 }}>
        <h2 style={{ margin: 0 }}>GDPS</h2>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link to="/" style={{ color: "#9ca3af", textDecoration: "none" }}>
            Home
          </Link>
          <Link to="/about" style={{ color: "#9ca3af", textDecoration: "none" }}>
            About
          </Link>
          <Link to="/echo" style={{ color: "#9ca3af", textDecoration: "none" }}>
            Echo
          </Link>
        </nav>
      </div>
    </header>
  );
}
