"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowser, STORAGE_BUCKET } from "@/lib/supabaseClient";
import { CATEGORIES, getCategory } from "@/lib/categories";

const EMPTY_FORM = {
  title: "",
  category: "graphic-design",
  description: "",
  software: "",
};

function safeName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(-80);
}

export default function AdminDashboard({ session }) {
  const router = useRouter();
  const supabase = getSupabaseBrowser();

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState(0); // 0–100, upload progress
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const thumbRef = useRef(null);
  const formTop = useRef(null);

  // ---------------------------------------------------------------- load
  async function loadProjects() {
    setLoading(true);
    const { data, error: loadError } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (loadError) setError(loadError.message);
    else setProjects(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------------- helpers
  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function clearFileInputs() {
    [imageRef, videoRef, thumbRef].forEach((r) => {
      if (r.current) r.current.value = "";
    });
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    clearFileInputs();
    setStep(0);
  }

  async function uploadFile(file, folder) {
    const path = `${folder}/${Date.now()}-${safeName(file.name)}`;
    const { error: upError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, { cacheControl: "31536000", upsert: false });

    if (upError) throw new Error(`${folder} upload failed: ${upError.message}`);

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  // ---------------------------------------------------------------- save
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setOk("");

    if (!form.title.trim()) {
      setError("Give the project a title.");
      return;
    }

    const imageFile = imageRef.current?.files?.[0] || null;
    const videoFile = videoRef.current?.files?.[0] || null;
    const thumbFile = thumbRef.current?.files?.[0] || null;

    if (!editingId && !imageFile && !videoFile) {
      setError("Add an image or a video before publishing.");
      return;
    }

    setBusy(true);
    setStep(8);

    try {
      const payload = {
        title: form.title.trim(),
        category: form.category,
        description: form.description.trim() || null,
        software: form.software.trim() || null,
      };

      const files = [
        [imageFile, "images", "image_url"],
        [videoFile, "videos", "video_url"],
        [thumbFile, "thumbnails", "thumbnail_url"],
      ].filter(([f]) => Boolean(f));

      let done = 0;
      for (const [file, folder, column] of files) {
        payload[column] = await uploadFile(file, folder);
        done += 1;
        setStep(8 + Math.round((done / files.length) * 82));
      }

      if (editingId) {
        const { error: updateError } = await supabase
          .from("projects")
          .update(payload)
          .eq("id", editingId);
        if (updateError) throw new Error(updateError.message);
        setOk("Project updated.");
      } else {
        const { error: insertError } = await supabase
          .from("projects")
          .insert({ ...payload, published: true });
        if (insertError) throw new Error(insertError.message);
        setOk(`Published to ${getCategory(form.category)?.name}.`);
      }

      setStep(100);
      resetForm();
      await loadProjects();
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setStep(0);
    } finally {
      setBusy(false);
    }
  }

  // ---------------------------------------------------------------- row actions
  function startEdit(project) {
    setEditingId(project.id);
    setForm({
      title: project.title || "",
      category: project.category || "graphic-design",
      description: project.description || "",
      software: project.software || "",
    });
    clearFileInputs();
    setOk("");
    setError("");
    formTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function togglePublished(project) {
    const { error: toggleError } = await supabase
      .from("projects")
      .update({ published: !project.published })
      .eq("id", project.id);

    if (toggleError) setError(toggleError.message);
    else {
      setOk(project.published ? "Project hidden from the site." : "Project is live.");
      loadProjects();
    }
  }

  async function remove(project) {
    if (!window.confirm(`Delete “${project.title}” permanently?`)) return;

    const { error: deleteError } = await supabase
      .from("projects")
      .delete()
      .eq("id", project.id);

    if (deleteError) setError(deleteError.message);
    else {
      setOk("Project deleted.");
      loadProjects();
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  // ---------------------------------------------------------------- render
  return (
    <div className="shell admin-wrap">
      <div className="admin-head" ref={formTop}>
        <div>
          <h1>Portfolio manager</h1>
          <p className="who">Signed in as {session?.user?.email}</p>
        </div>
        <div className="row-actions">
          <Link className="btn ghost small" href="/">
            View site
          </Link>
          <button className="btn ghost small" onClick={signOut} type="button">
            Sign out
          </button>
        </div>
      </div>

      {error && <div className="notice error">{error}</div>}
      {ok && <div className="notice ok">{ok}</div>}

      {/* ------------------------------ upload / edit form */}
      <form className="panel" onSubmit={handleSubmit}>
        <h2>{editingId ? "Edit project" : "Upload new work"}</h2>

        {busy && (
          <div className="progress">
            <i style={{ width: `${step}%` }} />
          </div>
        )}

        <div className="form-grid">
          <div className="field">
            <label htmlFor="title">Project title</label>
            <input
              id="title"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Avengers VFX Edit"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.index}. {c.name}
                </option>
              ))}
            </select>
            <span className="hint">The project appears in this category on the site.</span>
          </div>

          <div className="field wide">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Short line about the project."
            />
          </div>

          <div className="field wide">
            <label htmlFor="software">Software used</label>
            <input
              id="software"
              value={form.software}
              onChange={(e) => update("software", e.target.value)}
              placeholder="After Effects, Nuke"
            />
          </div>

          <div className="field">
            <label htmlFor="image">Image</label>
            <input id="image" type="file" accept="image/*" ref={imageRef} />
            <span className="hint">JPG, PNG or WebP.</span>
          </div>

          <div className="field">
            <label htmlFor="video">Video</label>
            <input id="video" type="file" accept="video/mp4,video/*" ref={videoRef} />
            <span className="hint">MP4 works best in every browser.</span>
          </div>

          <div className="field">
            <label htmlFor="thumb">Video thumbnail</label>
            <input id="thumb" type="file" accept="image/*" ref={thumbRef} />
            <span className="hint">Shown on the card before the video plays.</span>
          </div>
        </div>

        {editingId && (
          <p className="hint" style={{ marginBottom: "1.2rem", color: "var(--ash)" }}>
            Leave a file empty to keep the current one. Choosing a file replaces it.
          </p>
        )}

        <div className="row-actions" style={{ justifyContent: "flex-start" }}>
          <button className="btn" type="submit" disabled={busy}>
            {busy ? "Uploading…" : editingId ? "Save changes" : "Publish project"}
          </button>
          {editingId && (
            <button className="btn ghost" type="button" onClick={resetForm} disabled={busy}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ------------------------------ project list */}
      <div className="panel">
        <h2>Your projects ({projects.length})</h2>

        {loading ? (
          <p style={{ color: "var(--ash)" }}>Loading…</p>
        ) : projects.length === 0 ? (
          <p style={{ color: "var(--ash)" }}>
            Nothing uploaded yet. Add your first project above.
          </p>
        ) : (
          <div className="row-list">
            {projects.map((p) => {
              const cat = getCategory(p.category);
              const poster = p.thumbnail_url || p.image_url;
              return (
                <div className="row-item" key={p.id}>
                  <div className="row-thumb">
                    {poster ? <img src={poster} alt="" /> : <span>VIDEO</span>}
                  </div>

                  <div className="row-info">
                    <h4>{p.title}</h4>
                    <p>
                      <span className="tag">{cat ? cat.name : p.category}</span>
                      <span className={`tag${p.published ? "" : " off"}`}>
                        {p.published ? "Live" : "Hidden"}
                      </span>
                      {p.software}
                    </p>
                  </div>

                  <div className="row-actions">
                    <button
                      className="btn ghost small"
                      type="button"
                      onClick={() => startEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn ghost small"
                      type="button"
                      onClick={() => togglePublished(p)}
                    >
                      {p.published ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      className="btn danger small"
                      type="button"
                      onClick={() => remove(p)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
