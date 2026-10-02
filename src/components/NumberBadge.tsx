export default function NumberBadge({
  value,
  size = "md",
  hollow = false,
}: {
  value: React.ReactNode;
  size?: "sm" | "md" | "lg";
  hollow?: boolean;
}) {
  const classes = [
    "num-badge",
    size === "sm" ? "num-badge-sm" : "",
    size === "lg" ? "num-badge-lg" : "",
    hollow ? "num-badge-hollow" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={classes}>{value}</span>;
}
