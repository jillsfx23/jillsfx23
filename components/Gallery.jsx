"use client";

import { useCallback, useEffect, useState } from "react";

function PlayBadge() {
  return (
    <span className="play" aria-hidden="true">
      <i>
        <svg viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </i>
    </span>
  );
}

function Card({ project, onOpen }) {
  const isVideo = Boolean(project.video_url);
  const poster = project.thumbnail_url || project.image_url;

  return (
    <div
      className="card"
      role="button"
      tabIndex={0}
      aria-label={`Open ${project.title}`}
      onClick={() => onOpen(project)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(project);
        }
      }}
    >
      <div className="card-face">
        <div className="card-media">
        {poster ? (
          <img
            src={poster}
            alt={project.title}
            loading="lazy"
            decoding="async"
          />
        ) : (
            <span className="card-empty">{isVideo ? "Video" : "No preview"}</span>
          )}
          {isVideo && <PlayBadge />}
        </div>
        <div className="card-body">
          <h3 className="card-title">{project.title}</h3>
          {project.description && <p className="card-desc">{project.description}</p>}
          {project.software && <p className="card-soft">{project.software}</p>}
        </div>
      </div>
    </div>
  );
}

function Lightbox({ project, onClose }) {
  const onKey = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onKey]);

  const isVideo = Boolean(project.video_url);

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      onClick={onClose}
    >
      <button className="lightbox-close" onClick={onClose} aria-label="Close">
        ✕
      </button>
      <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
        {isVideo ? (
          <video
            className="lightbox-media"
            src={project.video_url}
            poster={project.thumbnail_url || project.image_url || undefined}
            controls
            autoPlay
            playsInline
            preload="metadata"
            controlsList="nodownload"
          />
        ) : project.image_url ? (
          <img className="lightbox-media" src={project.image_url} alt={project.title} />
        ) : (
          <div className="empty-state">No media attached to this project yet.</div>
        )}

        <div className="lightbox-caption">
          <h3>{project.title}</h3>
          {project.description && <p>{project.description}</p>}
          {project.software && <p className="card-soft">{project.software}</p>}
        </div>
      </div>
    </div>
  );
}

export default function Gallery({ projects }) {
  const [active, setActive] = useState(null);

  if (!projects || projects.length === 0) {
    return (
      <div className="empty-state">
        <h3>Nothing published here yet</h3>
        <p>New work lands in this category as soon as it is published.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid">
        {projects.map((p) => (
          <Card key={p.id} project={p} onOpen={setActive} />
        ))}
      </div>
      {active && <Lightbox project={active} onClose={() => setActive(null)} />}
    </>
  );
}
