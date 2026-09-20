import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <div className="shell">
      <div className="footer">
        <span>
          © {new Date().getFullYear()} {SITE.brand} — {SITE.owner}
        </span>
        <a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer">
          {SITE.instagramHandle}
        </a>
      </div>
    </div>
  );
}
