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

function renderProjects(projects, animate) {
  const container = document.getElementById("projects");
  container.innerHTML = "";

  if (!projects.length) {
    container.appendChild(el("div", "out", "projects/ is empty."));
    return;
  }

  projects.forEach((p, i) => {
    const panel = el("article", "panel" + (animate ? " reveal" : ""));
    panel.style.setProperty("--i", i);

    // ---- title bar ----
    const num = String(i + 1).padStart(2, "0");
    const bar = el("div", "panel-bar");
    bar.appendChild(el("span", "panel-num", num));
    bar.appendChild(el("span", "panel-title", p.title));
    if (p.type) bar.appendChild(el("span", "panel-type", `[${p.type}]`));
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

// ---- boot sequence orchestration ----
const prefersReducedMotion =
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// type a string into a .cmd span, char by char
async function typeInto(cmdEl) {
  const text = cmdEl.dataset.cmd || "";
  cmdEl.classList.add("typing");
  for (let i = 0; i < text.length; i++) {
    cmdEl.textContent += text[i];
    await sleep(22); // fast
  }
  cmdEl.classList.remove("typing");
  await sleep(140); // brief pause after a command, before its output
}

// Run the shell-session boot: reveal each step, typing commands as they appear.
async function boot(projects) {
  const steps = Array.from(document.querySelectorAll("[data-step]"));

  for (const step of steps) {
    step.classList.add("shown");
    const cmd = step.querySelector(".cmd[data-cmd]");
    if (cmd) {
      await typeInto(cmd);
    } else {
      await sleep(90); // output line settles briefly
    }
  }

  // finally, "print" the project list with a staggered reveal
  renderProjects(projects, true);
  document.body.classList.remove("booting");
}

function instant(projects) {
  // reduced-motion / fallback: fill commands and show everything at once
  document.querySelectorAll(".cmd[data-cmd]").forEach((c) => {
    c.textContent = c.dataset.cmd;
  });
  document.querySelectorAll("[data-step]").forEach((s) => s.classList.add("shown"));
  renderProjects(projects, false);
  document.body.classList.remove("booting");
}

document.body.classList.add("booting");

fetch("projects.json")
  .then((res) => {
    if (!res.ok) throw new Error("Failed to load projects.json");
    return res.json();
  })
  .then((projects) => {
    if (prefersReducedMotion) {
      instant(projects);
    } else {
      boot(projects);
    }
  })
  .catch((err) => {
    console.error(err);
    document.body.classList.remove("booting");
    document.querySelectorAll(".cmd[data-cmd]").forEach((c) => {
      c.textContent = c.dataset.cmd;
    });
    const c = document.getElementById("projects");
    if (c) c.innerHTML = '<div class="out err">error: could not load projects.json</div>';
  });
