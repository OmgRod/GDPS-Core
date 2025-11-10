import React from "react";
import { Link } from "react-router-dom";
import config from "../generated/config";

function runtimeConfig() {
  try {
    const w = window as any;
    if (w && w.__GDPS_CONFIG) return w.__GDPS_CONFIG;
  } catch (e) {}
  return config;
}

export default function Header() {
  return (
    <header style={{ background: "#111827", color: "white", padding: "12px 16px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", gap: 16 }}>
        <h2 style={{ margin: 0 }}>{runtimeConfig()?.gdpsName ?? "GDPS"}</h2>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link to="/" style={{ color: "#9ca3af", textDecoration: "none" }}>
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}
