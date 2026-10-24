// A várólista-űrlap címe: élesítés előtt ide kerül a valódi URL (pl. Tally).
const WAITLIST_URL = "#";

const DAY = 24 * 60 * 60 * 1000;
const STEPS = [1, 3, 7]; // ismétlés ennyi nap múlva
const $ = (id) => document.getElementById(id);
const VIEWS = ["home", "quiz", "result", "print"];

// ---------- segédek ----------
function shuffle(a) {
  for (let k = a.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [a[k], a[j]] = [a[j], a[k]];
  }
  return a;
}
function pick(arr, n) { return shuffle([...arr]).slice(0, n); }
function show(view) {
  VIEWS.forEach((v) => ($(v).hidden = v !== view));
  window.scrollTo(0, 0);
}
function norm(s) { return s.normalize("NFC").trim().toLowerCase(); }
function esc(s) { return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
function store(key, val) {
  try {
    if (val === undefined) return JSON.parse(localStorage.getItem(key) || "null");
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) { return null; }
}

// ---------- ismétlési napló (csak a böngészőben) ----------
function reviews() { return store("rev") || {}; }
function markWrong(topic, w) {
  const r = reviews();
  r[w] = { t: topic, step: 0, due: Date.now() + STEPS[0] * DAY };
  store("rev", r);
}
function markReviewed(w, ok) {
  const r = reviews();
  if (!r[w]) return;
  if (!ok) { r[w].step = 0; r[w].due = Date.now() + STEPS[0] * DAY; }
  else if (r[w].step + 1 >= STEPS.length) delete r[w];
  else { r[w].step++; r[w].due = Date.now() + STEPS[r[w].step] * DAY; }
  store("rev", r);
}
function dueItems() {
  const r = reviews(), now = Date.now(), out = [];
  for (const [w, v] of Object.entries(r)) {
    if (v.due > now || !TOPICS[v.t]) continue;
    const item = TOPICS[v.t].items.find((it) => it.w === w);
    if (item) out.push({ topic: v.t, item });
  }
  return out;
}

// ---------- felolvasás ----------
const canSpeak = "speechSynthesis" in window;
function huVoice() { return canSpeak ? speechSynthesis.getVoices().find((v) => v.lang && v.lang.toLowerCase().startsWith("hu")) : null; }
function speak(text) {
  if (!canSpeak) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "hu-HU";
  const v = huVoice(); if (v) u.voice = v;
  u.rate = document.body.classList.contains("dys") ? 0.65 : 0.85;
  speechSynthesis.cancel(); speechSynthesis.speak(u);
}

// ---------- feladatmenet ----------
// mode: "choice" | "dict"; kind: "practice" | "diag" | "review"
let S = null;

function startSession({ kind, mode, title, list }) {
  S = { kind, mode, title, list, i: 0, results: [] };
  $("qTitle").textContent = title;
  $("total").textContent = list.length;
  $("choiceBox").hidden = mode !== "choice";
  $("dictBox").hidden = mode !== "dict";
  $("voiceWarn").hidden = !(mode === "dict" && (!canSpeak || (speechSynthesis.getVoices().length && !huVoice())));
  show("quiz");
  render();
}
function render() {
  const { topic, item } = S.list[S.i];
  $("pos").textContent = S.i + 1;
  $("feedback").textContent = ""; $("feedback").className = "feedback";
  $("next").hidden = true;
  if (S.mode === "choice") {
    const opts = shuffle([item.w, wrongOf(topic, item)]);
    $("choices").innerHTML = opts.map((o) => `<button class="choice" data-v="${esc(o)}">${esc(o)}</button>`).join("");
    $("choices").querySelectorAll("button").forEach((b) => b.addEventListener("click", () => answer(b.dataset.v, b)));
  } else {
    $("dictInput").value = ""; $("dictInput").disabled = false; $("dictInput").focus();
    setTimeout(() => speak(item.w), 250);
  }
}
function answer(given, btn) {
  const { topic, item } = S.list[S.i];
  const ok = norm(given) === norm(item.w);
  S.results.push({ topic, item, ok });
  if (S.kind === "review") markReviewed(item.w, ok);
  else if (!ok) markWrong(topic, item.w);

  if (S.mode === "choice") {
    $("choices").querySelectorAll("button").forEach((b) => {
      b.disabled = true;
      if (b.dataset.v === item.w) b.classList.add("ok");
    });
    if (!ok && btn) btn.classList.add("bad");
  } else {
    $("dictInput").disabled = true;
  }
  $("feedback").innerHTML = (ok ? "Helyes! " : `Majdnem! A helyes írásmód: <strong>${esc(item.w)}</strong>. `) + esc(item.h);
  $("feedback").className = "feedback " + (ok ? "ok" : "bad");
  $("next").hidden = false; $("next").focus();
}
function next() {
  S.i++;
  if (S.i < S.list.length) return render();
  finish();
}

// ---------- eredmény ----------
function finish() {
  const total = S.results.length, good = S.results.filter((r) => r.ok).length;
  const wrong = S.results.filter((r) => !r.ok);
  $("rTitle").textContent = S.kind === "diag" ? "A felmérés eredménye" : `Eredmény: ${good} / ${total}`;
  $("bars").innerHTML = "";
  $("plan").hidden = true;

  if (S.kind === "diag") {
    const per = Object.keys(TOPICS).map((k) => {
      const rs = S.results.filter((r) => r.topic === k);
      return { k, pct: Math.round((100 * rs.filter((r) => r.ok).length) / rs.length) };
    }).sort((a, b) => a.pct - b.pct);
    $("bars").innerHTML = per.map((p) => `
      <div class="bar"><div class="barlabel">${esc(TOPICS[p.k].name)} <span>${p.pct}%</span></div>
      <div class="bartrack"><div class="barfill ${p.pct < 60 ? "low" : p.pct < 85 ? "mid" : "high"}" style="width:${p.pct}%"></div></div></div>`).join("");
    const weak = per[0];
    S.weak = weak.k;
    $("advice").innerHTML = weak.pct >= 85
      ? "Nagyon szép eredmény minden témában! Érdemes a tollbamondással is kipróbálni magát."
      : `<strong>Ezzel érdemes kezdeni: ${esc(TOPICS[weak.k].name)}.</strong> ${esc(TOPICS[weak.k].tip)} A nyomtatható 7 napos terv ebből indul.`;
    $("plan").hidden = false;
  } else {
    $("advice").textContent = good === total ? "Hibátlan! Igazi betűvadász vagy." : good >= total * 0.7 ? "Szép munka! A rontott szavakat holnap visszahozzuk." : "Jó kezdés! A hibákból tanulunk a legtöbbet: holnap visszahozzuk őket.";
  }
  $("mistakesBox").hidden = wrong.length === 0 || S.kind === "review";
  $("mistakes").innerHTML = wrong.map((r) => `<li><strong>${esc(r.item.w)}</strong>: ${esc(r.item.h)}</li>`).join("");
  show("result");
}

// ---------- nyomtatható lapok ----------
function worksheet(topicKey) {
  const t = TOPICS[topicKey], items = pick(t.items, 14);
  const task = (it) => topicKey === "jly"
    ? `<li>${esc(it.w.includes("ly") ? it.w.replace("ly", "____") : it.w.replace("j", "____"))}</li>`
    : `<li>${shuffle([it.w, wrongOf(topicKey, it)]).map(esc).join("&nbsp;&nbsp;/&nbsp;&nbsp;")}</li>`;
  const instr = topicKey === "jly" ? "Írd be a hiányzó betűt: j vagy ly?" : "Karikázd be a helyes írásmódot!";
  $("sheet").innerHTML = `
    <h1>Betűvadász feladatlap: ${esc(t.name)}</h1>
    <p>Név: ______________________ &nbsp; Dátum: ____________</p>
    <p class="tipbox">${esc(t.tip)}</p>
    <h2>${instr}</h2>
    <ol class="cols2 tasks">${items.map(task).join("")}</ol>
    <h2>Mondj tollba 5 szót a fentiek közül, és írd le őket!</h2>
    <ol class="lines">${"<li></li>".repeat(5)}</ol>
    <div class="pagebreak"></div>
    <h2>Megoldókulcs</h2>
    <ol class="cols2">${items.map((it) => `<li>${esc(it.w)}</li>`).join("")}</ol>
    <p class="small">betuvadasz.hu · ingyenes helyesírás-gyakorló</p>`;
  show("print");
}
function weekPlan(topicKey) {
  const t = TOPICS[topicKey];
  const others = Object.keys(TOPICS).filter((k) => k !== topicKey).map((k) => TOPICS[k].name);
  const days = [
    `${t.name}: 10 feladat a weboldalon (5 perc)`,
    `${t.name}: nyomtatható feladatlap (10 perc)`,
    `Ismétlés: a tegnap rontott szavak + 5 perc tollbamondás`,
    `${t.name}: 10 feladat, utána a hibás szavak hangos betűzése`,
    `${others[0]}: 10 feladat (5 perc)`,
    `Ismétlés: a hét rontott szavai (5 perc)`,
    `Újra a felmérő: mennyit javultunk?`,
  ];
  $("sheet").innerHTML = `
    <h1>7 napos helyesírás-terv</h1>
    <p>Fókusz: <strong>${esc(t.name)}</strong>. Naponta csak 5–10 perc, de minden nap.</p>
    <p class="tipbox">${esc(t.tip)}</p>
    <table class="plan"><thead><tr><th>Nap</th><th>Feladat</th><th>Kész ✓</th></tr></thead>
    <tbody>${days.map((d, n) => `<tr><td>${n + 1}.</td><td>${esc(d)}</td><td></td></tr>`).join("")}</tbody></table>
    <h2>Szülőknek</h2>
    <ul>
      <li>A rövid, napi gyakorlás többet ér, mint a heti egy hosszú alkalom.</li>
      <li>Dicsérd a javítást, ne csak a hibátlan választ.</li>
      <li>A rontott szavakat 1, 3 és 7 nap múlva hozd vissza: a weboldal ezt magától megteszi.</li>
    </ul>
    <p class="small">betuvadasz.hu · ingyenes helyesírás-gyakorló</p>`;
  show("print");
}

// ---------- kezdőlap ----------
function renderHome() {
  $("topics").innerHTML = Object.entries(TOPICS).map(([k, t]) => `
    <div class="card topic">
      <h3>${esc(t.name)}</h3>
      <p class="muted">${esc(t.short)}</p>
      <div class="row wrapbtns">
        <button class="primary" data-act="practice" data-t="${k}">Gyakorlás</button>
        <button class="ghost" data-act="dict" data-t="${k}">🔊 Tollbamondás</button>
        <button class="ghost" data-act="sheet" data-t="${k}">🖨 Feladatlap</button>
      </div>
    </div>`).join("");
  const due = dueItems();
  $("reviewCard").hidden = due.length === 0;
  $("reviewCount").textContent = due.length;
  show("home");
}

// ---------- események ----------
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-act]");
  if (!b) return;
  const t = b.dataset.t, act = b.dataset.act;
  if (act === "home") renderHome();
  if (act === "diag") startSession({
    kind: "diag", mode: "choice", title: "Felmérés",
    list: shuffle(Object.keys(TOPICS).flatMap((k) => pick(TOPICS[k].items, 5).map((item) => ({ topic: k, item })))),
  });
  if (act === "practice") startSession({ kind: "practice", mode: "choice", title: TOPICS[t].name, list: pick(TOPICS[t].items, 10).map((item) => ({ topic: t, item })) });
  if (act === "dict") startSession({ kind: "practice", mode: "dict", title: "Tollbamondás: " + TOPICS[t].name, list: pick(TOPICS[t].items, 8).map((item) => ({ topic: t, item })) });
  if (act === "sheet") worksheet(t);
  if (act === "review") startSession({ kind: "review", mode: "choice", title: "Ismétlés", list: shuffle(dueItems()) });
});
$("next").addEventListener("click", next);
$("play").addEventListener("click", () => speak(S.list[S.i].item.w));
$("dictForm").addEventListener("submit", (e) => { e.preventDefault(); if (!$("dictInput").disabled && $("dictInput").value.trim()) answer($("dictInput").value); });
$("plan").addEventListener("click", () => weekPlan(S.weak));
document.querySelectorAll(".waitlist").forEach((a) => (a.href = WAITLIST_URL));
if (canSpeak) speechSynthesis.onvoiceschanged = () => {
  if (S && S.mode === "dict") $("voiceWarn").hidden = !!huVoice();
};

// diszgráfia-barát nézet
const dys = $("dys");
dys.checked = store("dys") === true;
document.body.classList.toggle("dys", dys.checked);
dys.addEventListener("change", () => { document.body.classList.toggle("dys", dys.checked); store("dys", dys.checked); });

renderHome();
