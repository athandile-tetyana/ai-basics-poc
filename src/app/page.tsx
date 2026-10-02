import Link from "next/link";

export default function Home() {
  return (
    <main className="home">
      <h1>PreOrder Kasi</h1>
      <p className="tagline">
        Order ahead for a specific time. Sellers plan production. Customers get
        food when they need it.
      </p>
      <div className="button-group">
        <Link href="/customer/order" className="btn btn-primary">
          I&apos;m a customer
        </Link>
        <Link href="/seller/dashboard" className="btn btn-secondary">
          I&apos;m a seller
        </Link>
      </div>
      <p className="lookup-link">
        <Link href="/customer/lookup">Look up my order</Link>
      </p>
    </main>
  );
}
