"use client";

import { useState } from "react";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { InstagramIcon, MenuIcon } from "@/components/Icons";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="nav">
      <div className="shell nav-inner">
        <Link href="/" className="nav-brand" onClick={close} aria-label="Jills Effects home">
          <img src="/logo-wordmark.png" alt="Jills Effects" width="420" height="87" />
        </Link>

        <nav className={`nav-links${open ? " open" : ""}`}>
          <Link href="/#works" onClick={close}>
            My Works
          </Link>
          <Link href="/#about" onClick={close}>
            About
          </Link>
          <Link href="/#contact" onClick={close}>
            Contact
          </Link>
        </nav>

        <div className="nav-right">
          <a
            className="icon-btn"
            href={SITE.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <InstagramIcon />
          </a>
          <span className="divider" />
          <button
            className="icon-btn menu-btn"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </div>
    </header>
  );
}
