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

async function start() {
  try {
    const [content, clauseTypes] = await Promise.all([
      loadJson("content.json"),
      loadJson("clause-types.json"),
    ]);
    renderFrame(content.page);
  } catch (error) {
    // No error wording exists in content.json for this, so the page stays blank.
    // This usually means a typo in a JSON file, such as a missing comma.
    console.error("The page could not start.", error);
  }
}

start();
