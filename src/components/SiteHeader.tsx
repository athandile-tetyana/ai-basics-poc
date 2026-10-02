import Link from "next/link";

export default function SiteHeader({ role }: { role: "customer" | "seller" }) {
  return (
    <header className="site-header">
      <Link href="/" className="wordmark">
        PreOrder Kasi
      </Link>
      <span className="role-chip">{role}</span>
    </header>
  );
}
