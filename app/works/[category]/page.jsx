import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import Reveal from "@/components/Reveal";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { getSupabaseServer } from "@/lib/supabaseClient";

// Always read fresh data so a newly published project shows up immediately.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }) {
  const cat = getCategory(params.category);
  if (!cat) return { title: "Not found | JILLS EFFECTS" };
  return {
    title: `${cat.name} | JILLS EFFECTS – Santhoshkumar`,
    description: `${cat.name} projects by Santhoshkumar. ${cat.blurb}`,
  };
}

async function getProjects(slug) {
  const supabase = getSupabaseServer();
  if (!supabase) return { projects: [], error: "not-configured" };

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("category", slug)
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) return { projects: [], error: error.message };
  return { projects: data || [], error: null };
}

export default async function CategoryPage({ params }) {
  const cat = getCategory(params.category);
  if (!cat) notFound();

  const { projects, error } = await getProjects(cat.slug);

  return (
    <>
      <Nav />

      <main>
        <section className="shell cat-head">
          <Link className="back-link" href="/#works">
            ← Back to my works
          </Link>
          <Reveal>
            <p className="cat-index">{cat.index}</p>
            <h1 className="cat-title">{cat.name}</h1>
            <p className="cat-sub">{cat.blurb}</p>
          </Reveal>
        </section>

        <section className="shell" style={{ paddingBottom: "5rem" }}>
          {error === "not-configured" ? (
            <div className="empty-state">
              <h3>Supabase is not connected yet</h3>
              <p>
                Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local,
                then restart the dev server.
              </p>
            </div>
          ) : error ? (
            <div className="empty-state">
              <h3>Could not load projects</h3>
              <p>{error}</p>
            </div>
          ) : (
            <Gallery projects={projects} />
          )}
        </section>

        <section className="shell" style={{ paddingBottom: "5rem" }}>
          <Link className="back-link" href="/#works">
            ← Back to my works
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
