const LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  declined: "Declined",
  collected: "Collected",
  not_collected: "Not collected",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`status-badge status-${status}`}>
      {LABELS[status] ?? status}
    </span>
  );
}
