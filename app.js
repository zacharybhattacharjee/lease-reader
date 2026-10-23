// Lease reader prototype.
// Every word on the page comes from content.json and clause-types.json.

async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load ${path} (status ${response.status})`);
  return response.json();
}

function setText(id, text) {
  document.getElementById(id).textContent = text;
}

// Makes an element with an optional class and text.
function make(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

// Shows the app name with its "&" set apart, so the stylesheet can highlight it.
// The words still come from content.json.
function renderAppName(name) {
  const element = document.getElementById("app-name");
  const [before, ...rest] = name.split("&");
  if (rest.length === 0) {
    element.textContent = name;
    return;
  }
  const amp = document.createElement("span");
  amp.className = "amp";
  amp.textContent = "&";
  element.replaceChildren(before, amp, rest.join("&"));
}

function renderFrame(page) {
  document.title = page.appName;
  renderAppName(page.appName);
  setText("title", page.title);
  setText("intro", page.intro);
  setText("footer-note", page.footer);
}

// One builder for each item a version can list in its "shows" list in
// content.json. Items without a builder yet are skipped.
const clauseParts = {
  heading(clause) {
    return make("h3", "clause-heading", clause.heading);
  },

  legalText(clause, page) {
    const panel = make("div", "lease-text");
    if (clause.legalText) {
      panel.append(make("p", "", clause.legalText));
    } else {
      panel.append(make("p", "empty-excerpt", page.emptyExcerpt));
    }
    return panel;
  },
};

function inLeaseOrder(clauses) {
  return [...clauses].sort((a, b) => a.leaseOrder - b.leaseOrder);
}

function renderVersion(content, letter, number) {
  const version = content.versions[letter];
  const headingId = `version-${number}-heading`;

  const section = make("section", "version");
  section.setAttribute("aria-labelledby", headingId);

  const heading = make("h2", "version-heading", `${content.page.versionLabel} ${number}`);
  heading.id = headingId;
  section.append(heading);

  const list = make("div", "clause-list");
  for (const clause of inLeaseOrder(content.clauses)) {
    const article = make("article", "clause");
    for (const item of version.shows) {
      const build = clauseParts[item];
      if (build) article.append(build(clause, content.page));
    }
    list.append(article);
  }
  section.append(list);
  return section;
}

// Until the version switcher exists (step 5), every finished version is
// shown one after another, numbered by the default order.
const FINISHED_VERSIONS = ["A"];

function renderVersions(content) {
  const order = content.page.defaultOrder.split("");
  const main = document.getElementById("main");
  order.forEach((letter, index) => {
    if (FINISHED_VERSIONS.includes(letter)) {
      main.append(renderVersion(content, letter, index + 1));
    }
  });
}

async function start() {
  try {
    const [content, clauseTypes] = await Promise.all([
      loadJson("content.json"),
      loadJson("clause-types.json"),
    ]);
    renderFrame(content.page);
    renderVersions(content);
  } catch (error) {
    // No error wording exists in content.json for this, so the page stays blank.
    // This usually means a typo in a JSON file, such as a missing comma.
    console.error("The page could not start.", error);
  }
}

start();
