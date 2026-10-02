import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import NumberBadge from "@/components/NumberBadge";

export default function Home() {
  return (
    <>
      <SiteHeader role="customer" />
      <main className="home">
        <h1>
          Order ahead.
          <br />
          <span className="accent-text">Collect when ready.</span>
        </h1>
        <p className="home-lede">
          Sellers plan production. Customers get food when they need it — no
          queue, no waste.
        </p>

        <nav className="menu-board">
          <Link href="/customer/order" className="menu-row">
            <NumberBadge value="1" />
            <span className="menu-label">I&apos;m a customer</span>
            <span className="menu-leader" />
            <span className="menu-arrow">→</span>
          </Link>
          <Link href="/seller/dashboard" className="menu-row">
            <NumberBadge value="2" />
            <span className="menu-label">I&apos;m a seller</span>
            <span className="menu-leader" />
            <span className="menu-arrow">→</span>
          </Link>
        </nav>

        <Link href="/customer/lookup" className="lookup-link marker-link">
          Look up my order →
        </Link>

        <p className="hand-note" style={{ marginTop: "2.5rem" }}>
          Cash on collection. No card, no app, no data.
        </p>
      </main>
    </>
  );
}
