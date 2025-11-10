import React from "react";
import config from "../generated/config";

function runtimeConfig() {
  try {
    const w = window as any;
    if (w && w.__GDPS_CONFIG) return w.__GDPS_CONFIG;
  } catch (e) {}
  return config;
}

export default function Footer() {
  return (
    <footer style={{ background: "#f3f4f6", padding: 12, textAlign: "center" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", color: "#6b7280" }}>
        © {new Date().getFullYear()} {runtimeConfig()?.gdpsName ?? "GDPS"} - Website/servers made by OmgRod
      </div>
    </footer>
  );
}
