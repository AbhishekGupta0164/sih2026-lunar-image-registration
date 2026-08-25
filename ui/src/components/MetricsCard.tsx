// Owner: P4 — renders one metric from metrics.json (RMSE, inlier ratio,
// coverage, etc.) as a scoreboard tile.
import React from "react";

export default function MetricsCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div>{label}</div>
      <div>{value}</div>
    </div>
  );
}
