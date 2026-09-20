import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell" style={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <h1 className="cat-title">Page not found</h1>
        <p className="cat-sub" style={{ margin: "1rem auto 2rem" }}>
          That page does not exist.
        </p>
        <Link className="btn" href="/">
          Back to the portfolio
        </Link>
      </div>
    </div>
  );
}
