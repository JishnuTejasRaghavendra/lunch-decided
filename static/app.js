const HISTORY_KEY = "lunch-decided-history-v1";
const HISTORY_LIMIT = 12;
const $ = (id) => document.getElementById(id);

let dishes = [];
let history = loadHistory();
let isPicking = false;

function loadHistory() {
  try {
    const value = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    return Array.isArray(value) ? value.filter((item) => item && typeof item.name === "string") : [];
  } catch {
    return [];
  }
}

function saveHistory() {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, HISTORY_LIMIT)));
  } catch {
    showToast("Browser storage is unavailable; history may not persist.");
  }
}

function normalise(value) {
  return value.trim().toLocaleLowerCase();
}

async function loadDishes() {
  const list = $("menu-list");
  try {
    // This relative static-file URL works on Cloudflare Pages and locally.
    const response = await fetch("dishes.txt", { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load dishes.txt (HTTP " + response.status + ")");
    const text = await response.text();
    dishes = [...new Set(text.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("#")))];
    renderMenu();
    if (!dishes.length) {
      list.innerHTML = '<li class="empty-state">Your dish list is empty. Add dishes to data/dishes.txt, then rebuild or refresh.</li>';
      $("dish-name").textContent = "Add your dishes first";
      $("dish-note").textContent = "Add one dish per line in data/dishes.txt, then rebuild or refresh.";
      $("pick-button").disabled = true;
      $("pick-button").style.opacity = ".55";
    }
  } catch (error) {
    list.innerHTML = '<li class="empty-state">Menu could not load. Check that dishes.txt is included in the deployed site.</li>';
    $("dish-name").textContent = "Almost ready.";
    $("dish-note").textContent = "The menu file could not be loaded.";
    $("error-message").hidden = false;
    $("error-message").textContent = error.message;
  }
}

// Recent dishes are less likely, but never permanently excluded.
function chooseDish() {
  const recentCounts = new Map();
  history.slice(0, 7).forEach((entry, index) => {
    const key = normalise(entry.name);
    recentCounts.set(key, (recentCounts.get(key) || 0) + (7 - index));
  });
  const weighted = dishes.map((name) => {
    const recentScore = recentCounts.get(normalise(name)) || 0;
    return { name, weight: 1 / (1 + recentScore * 0.85) };
  });
  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  let target = Math.random() * total;
  for (const item of weighted) {
    target -= item.weight;
    if (target <= 0) return item.name;
  }
  return weighted[weighted.length - 1].name;
}

function pickLunch() {
  if (isPicking || !dishes.length) return;
  isPicking = true;
  const button = $("pick-button");
  const nameNode = $("dish-name");
  const noteNode = $("dish-note");
  button.disabled = true;
  button.querySelector("span:first-child").textContent = "Finding your lunch…";
  const finalDish = chooseDish();
  const pool = dishes.slice();
  let ticks = 0;
  const interval = setInterval(() => {
    nameNode.textContent = pool[Math.floor(Math.random() * pool.length)];
    nameNode.classList.remove("dish-reveal");
    void nameNode.offsetWidth;
    nameNode.classList.add("dish-reveal");
    ticks += 1;
    if (ticks >= 10) {
      clearInterval(interval);
      nameNode.textContent = finalDish;
      nameNode.classList.remove("dish-reveal");
      void nameNode.offsetWidth;
      nameNode.classList.add("dish-reveal");
      noteNode.textContent = "Decision made. Go enjoy your lunch.";
      $("dish-kicker").textContent = "TODAY'S LUNCH IS";
      history.unshift({ name: finalDish, at: Date.now() });
      history = history.slice(0, HISTORY_LIMIT);
      saveHistory();
      renderHistory();
      button.disabled = false;
      button.querySelector("span:first-child").textContent = "Pick another dish";
      isPicking = false;
    }
  }, 75);
}

function renderMenu() {
  $("menu-count").textContent = `${dishes.length} dish${dishes.length === 1 ? "" : "es"}`;
  $("menu-list").innerHTML = dishes.map((name) => `<li><span class="menu-bullet"></span><span class="menu-name">${escapeHTML(name)}</span></li>`).join("") || '<li class="empty-state">No dishes yet.</li>';
}

function renderHistory() {
  $("history-count").textContent = `${history.length} pick${history.length === 1 ? "" : "s"}`;
  const list = $("history-list");
  if (!history.length) {
    list.innerHTML = '<li class="empty-state">Your lunch history will show up here.</li>';
    return;
  }
  list.innerHTML = history.slice(0, 6).map((item, index) => {
    const when = index === 0 ? "Just now" : relativeDate(item.at);
    return `<li><span class="history-number">${String(index + 1).padStart(2, "0")}</span><span class="history-name">${escapeHTML(item.name)}</span><span class="history-time">${when}</span></li>`;
  }).join("");
}

function relativeDate(timestamp) {
  const days = Math.floor((Date.now() - Number(timestamp || Date.now())) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2600);
}

$("pick-button").addEventListener("click", pickLunch);
$("clear-history").addEventListener("click", () => {
  if (!history.length) {
    showToast("Your lunch history is already empty.");
    return;
  }
  history = [];
  saveHistory();
  renderHistory();
  showToast("Lunch history cleared.");
});

renderHistory();
loadDishes();
