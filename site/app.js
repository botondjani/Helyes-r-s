// A várólista-űrlap címe: élesítés előtt ide kerül a valódi URL (pl. Tally).
const WAITLIST_URL = "#";

// Minden szót tanítónak kell átnéznie élesítés előtt.
const ITEMS = [
  { w: "golyó", hint: "Golyó, golyóstoll: mindkettő ly-os." },
  { w: "tojás", hint: "Tojás: j-vel írjuk." },
  { w: "papagáj", hint: "Papagáj: a szó végén j áll." },
  { w: "király", hint: "Király, királynő, királyság: ly-os szócsalád." },
  { w: "hajó", hint: "Hajó, hajós: j-vel írjuk." },
  { w: "folyosó", hint: "Folyik → folyó → folyosó: ly-os szócsalád." },
  { w: "ajtó", hint: "Ajtó: j-vel írjuk." },
  { w: "sirály", hint: "Sirály: a madárnév végén ly áll." },
  { w: "mosoly", hint: "Mosoly, mosolyog: ly-os szócsalád." },
  { w: "fejsze", hint: "Fejsze: j-vel írjuk." },
];

const $ = (id) => document.getElementById(id);
const canSpeak = "speechSynthesis" in window;
let order = [], i = 0, score = 0, wrong = [];

function shuffle(a) {
  for (let k = a.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [a[k], a[j]] = [a[j], a[k]];
  }
  return a;
}
function answerOf(word) { return word.includes("ly") ? "ly" : "j"; }
function masked(word) { return word.includes("ly") ? word.replace("ly", "_") : word.replace("j", "_"); }

function start() {
  order = shuffle([...ITEMS]); i = 0; score = 0; wrong = [];
  $("total").textContent = order.length;
  $("quiz").hidden = false; $("result").hidden = true;
  show();
}
function show() {
  const it = order[i];
  $("pos").textContent = i + 1;
  $("word").textContent = masked(it.w);
  $("feedback").textContent = ""; $("feedback").className = "feedback";
  $("next").hidden = true; $("speak").hidden = true;
  document.querySelectorAll(".choice").forEach((b) => { b.disabled = false; b.className = "choice"; });
}
function choose(v, btn) {
  const it = order[i], correct = answerOf(it.w);
  document.querySelectorAll(".choice").forEach((b) => {
    b.disabled = true;
    if (b.dataset.v === correct) b.classList.add("ok");
  });
  $("word").textContent = it.w;
  if (v === correct) {
    score++;
    $("feedback").textContent = "Helyes! " + it.hint;
    $("feedback").className = "feedback ok";
  } else {
    btn.classList.add("bad");
    wrong.push(it);
    $("feedback").textContent = "Majdnem! " + it.hint;
    $("feedback").className = "feedback bad";
  }
  $("speak").hidden = !canSpeak;
  $("next").hidden = false;
  $("next").focus();
}
function speak() {
  if (!canSpeak) return;
  const u = new SpeechSynthesisUtterance(order[i].w);
  u.lang = "hu-HU"; u.rate = document.body.classList.contains("dys") ? 0.7 : 0.9;
  speechSynthesis.cancel(); speechSynthesis.speak(u);
}
function next() {
  i++;
  if (i < order.length) return show();
  $("quiz").hidden = true; $("result").hidden = false;
  $("score").textContent = score;
  $("praise").textContent = score >= 9 ? "Szuper, igazi betűvadász vagy!" : score >= 6 ? "Szép munka! Még egy kis gyakorlás, és tökéletes lesz." : "Jó kezdés! A hibákból tanulunk a legtöbbet.";
  $("mistakes").innerHTML = wrong.length
    ? wrong.map((it) => `<li><strong>${it.w}</strong>: ${it.hint}</li>`).join("")
    : "<li>Egy hibád sem volt!</li>";
}

document.querySelectorAll(".choice").forEach((b) => b.addEventListener("click", () => choose(b.dataset.v, b)));
$("next").addEventListener("click", next);
$("speak").addEventListener("click", speak);
$("again").addEventListener("click", start);
$("waitlist").href = WAITLIST_URL;

// A diszgráfia-barát nézet beállítása böngészőnként megmarad.
const dys = $("dys");
try { dys.checked = localStorage.getItem("dys") === "1"; } catch (e) {}
document.body.classList.toggle("dys", dys.checked);
dys.addEventListener("change", () => {
  document.body.classList.toggle("dys", dys.checked);
  try { localStorage.setItem("dys", dys.checked ? "1" : "0"); } catch (e) {}
});

start();
