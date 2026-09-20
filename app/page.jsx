import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { InstagramIcon, MailIcon } from "@/components/Icons";
import { CATEGORIES } from "@/lib/categories";
import { SITE } from "@/lib/site";
import { getSupabaseServer } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Cover art for each category card: the newest published project in that
 * category. Upload work and the cards fill themselves in.
 */
async function getCovers() {
  const supabase = getSupabaseServer();
  if (!supabase) return {};

  const { data, error } = await supabase
    .from("projects")
    .select("category, image_url, thumbnail_url, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error || !data) return {};

  const covers = {};
  for (const row of data) {
    const src = row.thumbnail_url || row.image_url;
    if (src && !covers[row.category]) covers[row.category] = src;
  }
  return covers;
}

function ContactRow({ href, label, value, external }) {
  return (
    <a
      className="contact-row"
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span className="label">{label}</span>
      <span className="value">{value}</span>
    </a>
  );
}

export default async function HomePage() {
  const covers = await getCovers();

  return (
    <>
      <Nav />

      <main>
        {/* ---------------- HERO ---------------- */}
        <section className="hero">
          <div className="shell">
            <Reveal>
              <h1 className="hero-title">
                <img
                  className="hero-logo"
                  src="/logo-wordmark.png"
                  alt="JILLS EFFECTS"
                  width="1400"
                  height="289"
                  fetchPriority="high"
                />
                <span className="sr-only">JILLS EFFECTS</span>
              </h1>
            </Reveal>

            <Reveal delay={140}>
              <p className="hero-name">{SITE.owner}</p>
            </Reveal>

            <Reveal delay={260}>
              <div className="hero-links">
                <a
                  className="hero-link"
                  href={SITE.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InstagramIcon />
                  {SITE.instagramHandle}
                  <span className="arrow">↗</span>
                </a>
                <span className="sep" />
                <a className="hero-link" href={SITE.emailUrl}>
                  <MailIcon />
                  {SITE.email}
                  <span className="arrow">↗</span>
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------------- MY WORKS ---------------- */}
        <section className="works" id="works">
          <div className="shell">
            <Reveal>
              <div className="works-heading">
                <i />
                <h2>My Works</h2>
                <i />
              </div>
            </Reveal>

            <div className="works-grid">
              {CATEGORIES.map((cat, i) => (
                <Reveal key={cat.slug} delay={i * 110}>
                  <Link className="work-card" href={`/works/${cat.slug}`}>
                    <span className="work-face">
                      {covers[cat.slug] && (
                        <img className="work-cover" src={covers[cat.slug]} alt="" loading="lazy" />
                      )}
                      <span className="work-shade" />
                      <span className="work-index">{cat.index}.</span>
                      <span className="work-name">{cat.name}</span>
                      <span className="work-go">→</span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>

            <Reveal delay={320}>
              <div className="scroll-cue">
                <span className="mouse" />
                Scroll down
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------------- ABOUT ---------------- */}
        <section className="section" id="about">
          <div className="shell">
            <Reveal>
              <h2 className="section-title">About Me</h2>
            </Reveal>

            <div className="about-grid">
              <Reveal>
                <div className="about-portrait">
                  <img src="/profile.jpg" alt="JFX — Jills Effects logo" loading="lazy" />
                </div>
                <p className="about-role">{SITE.role}</p>
                <p className="about-lede">
                  I am Santhoshkumar — I cut footage, build shots and make things that were
                  never filmed look like they were.
                </p>
                <p className="about-body">
                  My work runs from graphic design and 3D modelling through to full VFX
                  compositing and finished edits. I like clean frames, good pacing and a
                  finish that holds up on a big screen.
                </p>
              </Reveal>

              <Reveal delay={120}>
                <ul className="skills">
                  {SITE.skills.map((s) => (
                    <li key={s.name}>
                      {s.name}
                      <span>{s.role}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------------- CONTACT ---------------- */}
        <section className="section contact" id="contact">
          <div className="shell">
            <Reveal>
              <h2 className="contact-title">
                Let&rsquo;s work
                <br />
                together
              </h2>
              <p className="contact-note">
                Available for VFX, editing and 3D projects. Send a brief and I will come back
                with a plan and a timeline.
              </p>
            </Reveal>

            <Reveal delay={120}>
              <div className="contact-rows">
                <ContactRow
                  href={SITE.instagramUrl}
                  label="Instagram"
                  value={SITE.instagramHandle}
                  external
                />
                <ContactRow href={SITE.emailUrl} label="Email" value={SITE.email} />
                {SITE.whatsapp && (
                  <ContactRow
                    href={SITE.whatsapp}
                    label="WhatsApp"
                    value="Message on WhatsApp"
                    external
                  />
                )}
                {SITE.phone && (
                  <ContactRow
                    href={`tel:${SITE.phone.replace(/\s+/g, "")}`}
                    label="Phone"
                    value={SITE.phone}
                  />
                )}
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
