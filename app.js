// Clause & Effect, a lease reader prototype.
// Every word on the page comes from content.json and clause-types.json.
// Lease text comes from the uploaded PDF, read here in the browser.
// The PDF is never sent anywhere or kept.

// pdf.js, Mozilla's free PDF reader, at a fixed version.
const PDFJS_URL = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs";
const PDFJS_WORKER_URL = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs";

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

// ---------- Page frame ----------

// Shows the app name with its "&" set apart, so the stylesheet can highlight it.
function renderAppName(name) {
  const element = document.getElementById("app-name");
  const [before, ...rest] = name.split("&");
  if (rest.length === 0) {
    element.textContent = name;
    return;
  }
  const amp = make("span", "amp", "&");
  element.replaceChildren(before, amp, rest.join("&"));
}

function renderFrame(page) {
  document.title = page.appName;
  renderAppName(page.appName);
  setText("title", page.title);
  setText("intro", page.intro);
  setText("footer-note", page.footer);
}

// ---------- Reading the PDF ----------

// Joins words split by a hyphen at the end of a line, and turns line
// breaks and runs of spaces into single spaces.
function tidyText(raw) {
  return raw
    .replace(/(\w)-[ \t]*\n\s*(\w)/g, "$1$2")
    .replace(/\s+/g, " ")
    .trim();
}

// A copy of the text for matching only: straight quotes, lower case.
// Each character maps to one character, so positions line up with the tidy text.
function matchingForm(text) {
  return text
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .toLowerCase();
}

async function readPdfText(file) {
  const pdfjs = await import(PDFJS_URL);
  pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
  const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  let raw = "";
  for (let number = 1; number <= doc.numPages; number++) {
    const page = await doc.getPage(number);
    const content = await page.getTextContent();
    for (const item of content.items) raw += item.str + (item.hasEOL ? "\n" : "");
    raw += "\n";
  }
  await doc.destroy();
  return tidyText(raw);
}

// Finds each clause's excerpt in the lease text, from its first words
// (findStart) to the next place its last words (findEnd) appear.
function findClauses(clauses, leaseText) {
  const haystack = matchingForm(leaseText);
  const found = [];
  const notFound = [];
  for (const clause of clauses) {
    const start = haystack.indexOf(matchingForm(tidyText(clause.findStart || "")));
    const endWords = matchingForm(tidyText(clause.findEnd || ""));
    const end = start >= 0 && endWords ? haystack.indexOf(endWords, start) : -1;
    if (!clause.findStart || start < 0 || end < 0) {
      notFound.push(clause);
    } else {
      found.push({ ...clause, legalText: leaseText.slice(start, end + endWords.length) });
    }
  }
  return { found, notFound };
}

// ---------- Versions ----------

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

function renderVersion(content, clauses, letter, number) {
  const version = content.versions[letter];
  const headingId = `version-${number}-heading`;

  const section = make("section", "version");
  section.setAttribute("aria-labelledby", headingId);

  const heading = make("h2", "version-heading", `${content.page.versionLabel} ${number}`);
  heading.id = headingId;
  section.append(heading);

  const list = make("div", "clause-list");
  for (const clause of inLeaseOrder(clauses)) {
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

function renderNotFound(page, clauses) {
  const section = make("section", "not-found");
  section.append(make("h2", "not-found-title", page.notFoundTitle));
  section.append(make("p", "not-found-note", page.notFoundNote));
  const list = make("ul", "not-found-list");
  for (const clause of inLeaseOrder(clauses)) list.append(make("li", "", clause.heading));
  section.append(list);
  return section;
}

// Until the version switcher exists (step 6), every finished version is
// shown one after another, numbered by the default order.
const FINISHED_VERSIONS = ["A"];

function showResults(content, found, notFound) {
  const results = document.getElementById("results");
  const startOver = make("button", "button button-secondary", content.page.startOver);
  startOver.type = "button";
  startOver.addEventListener("click", () => showUploadScreen());
  results.replaceChildren(startOver);

  const order = content.page.defaultOrder.split("");
  order.forEach((letter, index) => {
    if (FINISHED_VERSIONS.includes(letter) && found.length) {
      results.append(renderVersion(content, found, letter, index + 1));
    }
  });
  if (notFound.length) results.append(renderNotFound(content.page, notFound));

  document.getElementById("upload-screen").hidden = true;
  results.hidden = false;
  window.scrollTo(0, 0);
  startOver.focus();
}

// ---------- Upload screen ----------

function renderUploadScreen(content) {
  const page = content.page;
  const screen = document.getElementById("upload-screen");

  const fileInput = make("input", "visually-hidden");
  fileInput.type = "file";
  fileInput.accept = "application/pdf,.pdf";
  fileInput.id = "lease-file";
  fileInput.tabIndex = -1;
  fileInput.setAttribute("aria-hidden", "true");

  const chooseButton = make("button", "button button-primary", page.uploadButton);
  chooseButton.type = "button";
  chooseButton.id = "choose-button";
  chooseButton.addEventListener("click", () => fileInput.click());

  const sampleButton = make("button", "button button-secondary", page.sampleButton);
  sampleButton.type = "button";
  sampleButton.addEventListener("click", () => showResults(content, content.clauses, []));

  const status = make("p", "upload-status");
  status.id = "upload-status";
  status.setAttribute("role", "status");

  const error = make("p", "upload-error");
  error.id = "upload-error";
  error.setAttribute("role", "alert");

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    fileInput.value = "";
    if (!file) return;
    error.textContent = "";
    status.textContent = page.reading;
    chooseButton.disabled = true;
    sampleButton.disabled = true;
    try {
      const leaseText = await readPdfText(file);
      if (!leaseText) throw new Error("The PDF has no text to read.");
      const { found, notFound } = findClauses(content.clauses, leaseText);
      status.textContent = "";
      showResults(content, found, notFound);
    } catch (problem) {
      console.error("The lease could not be read.", problem);
      status.textContent = "";
      error.textContent = page.error;
    } finally {
      chooseButton.disabled = false;
      sampleButton.disabled = false;
    }
  });

  const buttons = make("div", "upload-buttons");
  buttons.append(chooseButton, sampleButton);

  const card = make("div", "upload-card");
  card.append(
    make("h2", "upload-title", page.uploadTitle),
    make("p", "upload-intro", page.uploadIntro),
    buttons,
    status,
    error,
    fileInput,
  );
  // page.privacyNote is left off until its wording matches how the page works.
  screen.replaceChildren(card);
}

function showUploadScreen() {
  const results = document.getElementById("results");
  results.hidden = true;
  results.replaceChildren();
  document.getElementById("upload-screen").hidden = false;
  window.scrollTo(0, 0);
  document.getElementById("choose-button").focus();
}

// ---------- Start ----------

async function start() {
  try {
    const [content, clauseTypes] = await Promise.all([
      loadJson("content.json"),
      loadJson("clause-types.json"),
    ]);
    renderFrame(content.page);
    renderUploadScreen(content);
  } catch (error) {
    // No error wording exists in content.json for this, so the page stays blank.
    // This usually means a typo in a JSON file, such as a missing comma.
    console.error("The page could not start.", error);
  }
}

start();
