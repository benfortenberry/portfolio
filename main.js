// Set a copyright/footer year if present (kept for compatibility).
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function link(className, label, href) {
  const a = el("a", className, label);
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener";
  return a;
}

function renderProjects(projects) {
  const container = document.getElementById("projects");
  container.innerHTML = "";

  if (!projects.length) {
    container.appendChild(el("div", "out", "projects/ is empty."));
    return;
  }

  projects.forEach((p, i) => {
    const panel = el("article", "panel");
    panel.style.setProperty("--i", i);

    // ---- title bar ----
    const num = String(i + 1).padStart(2, "0");
    const bar = el("div", "panel-bar");
    bar.appendChild(el("span", "panel-num", num));
    bar.appendChild(el("span", "panel-title", p.title));
    if (p.year) bar.appendChild(el("span", "panel-year", p.year));
    panel.appendChild(bar);

    // ---- body ----
    const body = el("div", "panel-body");

    if (p.tech) {
      const row = el("div", "field");
      row.appendChild(el("span", "key", "stack "));
      row.appendChild(el("span", "val", p.tech));
      body.appendChild(row);
    }

    if (p.description) {
      const row = el("div", "field");
      row.appendChild(el("span", "key", "about "));
      row.appendChild(el("span", "val", p.description));
      body.appendChild(row);
    }

    if (Array.isArray(p.tags) && p.tags.length) {
      const row = el("div", "field");
      row.appendChild(el("span", "key", "tags  "));
      const tagWrap = el("span", "val tags");
      for (const t of p.tags) {
        tagWrap.appendChild(el("span", "tag", "#" + String(t).replace(/_/g, "-")));
      }
      row.appendChild(tagWrap);
      body.appendChild(row);
    }

    // ---- actions as commands ----
    const actions = el("div", "panel-actions");
    if (p.liveUrl) {
      actions.appendChild(link("run", "> view live", p.liveUrl));
    }
    if (p.repoUrl && !p.repoPrivate) {
      actions.appendChild(link("run", "> view code", p.repoUrl));
    }
    body.appendChild(actions);

    panel.appendChild(body);
    container.appendChild(panel);
  });
}

fetch("projects.json")
  .then((res) => {
    if (!res.ok) throw new Error("Failed to load projects.json");
    return res.json();
  })
  .then(renderProjects)
  .catch((err) => {
    console.error(err);
    const c = document.getElementById("projects");
    if (c) c.innerHTML = '<div class="out err">error: could not load projects.json</div>';
  });
