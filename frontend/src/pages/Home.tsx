import React from "react";
import config from "../generated/config";

function runtimeConfig() {
  try {
    const w = window as any;
    if (w && w.__GDPS_CONFIG) return w.__GDPS_CONFIG;
  } catch (e) {}
  return config;
}

export default function Home() {
  return (
    <div>
      <h1>Welcome to {runtimeConfig()?.gdpsName ?? "GDPS"}, {"username"}!</h1>
      <p>gonna add more stuff soon!</p>
    </div>
  );
}
