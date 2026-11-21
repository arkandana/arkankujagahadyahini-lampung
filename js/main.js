const $ = (s, r = document) => r.querySelector(s);
const C = CONFIG;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

document.querySelectorAll("[data-cfg]").forEach(e => {
  if (C[e.dataset.cfg] !== undefined) e.textContent = C[e.dataset.cfg];
});
document.querySelectorAll("[data-cfg-img]").forEach(e => {
  if (C[e.dataset.cfgImg]) e.src = C[e.dataset.cfgImg];
});
document.querySelectorAll("[data-cfg-href]").forEach(e => {
  if (C[e.dataset.cfgHref]) e.href = C[e.dataset.cfgHref];
});

// Penyesuaian ukuran font nama mempelai agar pas 1 baris
function fitCoupleNames() {
  document.querySelectorAll(".couple-name").forEach(el => {
    let size = 26;
    el.style.fontSize = size + "px";
    const parentW = el.parentElement ? el.parentElement.clientWidth : 340;
    const maxW = Math.max(parentW - 12, 200);
    while (el.scrollWidth > maxW && size > 13) {
      size -= 0.5;
      el.style.fontSize = size + "px";
    }
  });
}
fitCoupleNames();
window.addEventListener("resize", fitCoupleNames);

$("#events").innerHTML = C.events.map(e => `<div class="card reveal"><h3 class="script">${e.title}</h3><p>${e.date}</p><p>${e.time}</p><b>${e.place}</b><p>${e.address}</p></div>`).join("");
$("#mapBtn").href = C.mapUrl;
$("#bank").innerHTML = C.bank.map(b => `
  <div class="card bank-card reveal">
    <div class="bank-logo-wrap">
      ${b.logo ? `<img src="${b.logo}" alt="${b.bank}" class="bank-logo">` : `<h3>${b.bank}</h3>`}
    </div>
    <p class="num">${b.number}</p>
    <p class="bank-name">${b.name}</p>
    <button class="btn sm" data-copy="${b.number}">Salin</button>
  </div>
`).join("");
const addrEl = $("#addr");
if (addrEl && C.giftAddress) {
  addrEl.innerHTML = `<h3>Kirim Hadiah</h3><p>${C.giftAddress}</p><button class="btn sm" data-copy="${C.giftAddress}">Salin Alamat</button>`;
}
document.addEventListener("click", e => {
  const t = e.target.closest("[data-copy]"); if (!t) return;
  const old = t.textContent;
  navigator.clipboard.writeText(t.dataset.copy); t.textContent = "Tersalin ✓";
  setTimeout(() => t.textContent = old, 1500);
});

const to = new URLSearchParams(location.search).get("to");
if (to) $("#guest").textContent = to;

// Cover countdown (pills DD / MM / YY)
(function buildCoverCountdown() {
  const d = new Date(C.weddingDate);
  const day = String(d.getDate()).padStart(2, "0");
  const mon = String(d.getMonth() + 1).padStart(2, "0");
  const yr = String(d.getFullYear()).slice(-2);
  const el = $("#coverCountdown");
  if (el) el.innerHTML = [day, mon, yr].map(v => `<div class="cd-pill">${v}</div>`).join("");
})();

// Staggered fade-in untuk elemen cover
document.querySelectorAll("#cover .fade").forEach((el, i) => {
  el.style.animationDelay = (0.2 + i * 0.2) + "s";
});

// musik
const bgm = $("#bgm"), mbtn = $("#musicBtn");

function setMusic(on) {
  if (on) {
    bgm.play().then(() => {
      mbtn.classList.add("spin");
    }).catch((e) => {
      console.log("Autoplay dicegah oleh browser:", e);
    });
  } else {
    bgm.pause();
    mbtn.classList.remove("spin");
  }
}

// 1. Coba putar musik secara otomatis saat halaman selesai dimuat
window.addEventListener("DOMContentLoaded", () => {
  setMusic(true);
});

// 2. Cadangan: Jika diblokir browser, musik akan langsung menyala 
// saat tamu melakukan klik/sentuhan pertama di mana saja pada halaman
document.body.addEventListener("click", function handleFirstClick() {
  if (bgm.paused) {
    setMusic(true);
  }
  // Hapus listener setelah klik pertama agar tidak terpanggil terus
  document.body.removeEventListener("click", handleFirstClick);
}, { once: true });

mbtn.onclick = () => setMusic(bgm.paused);

// buka undangan (klik = izin autoplay browser)
$("#openBtn").onclick = () => {
  $("#cover").classList.add("hide");
  $("#main").hidden = false;
  document.body.classList.remove("locked");

  // UBAH DARI false MENJADI true AGAR MUSIK NYALA SAAT DIBUKA
  setMusic(true);

  observe();
  setTimeout(fitCoupleNames, 50);
  window.scrollTo(0, 0);
  setTimeout(() => $("#cover").remove(), 1200);
};

function observe() {
  const io = new IntersectionObserver(es => es.forEach(x => x.isIntersecting && x.target.classList.add("show")), { threshold: .15 });
  document.querySelectorAll(".reveal").forEach(e => io.observe(e));
}

// countdown
const cd = $("#countdown");
setInterval(() => {
  const d = new Date(C.weddingDate) - Date.now();
  if (d <= 0) return cd.textContent = "Hari bahagia telah tiba";
  const days = Math.floor(d / 864e5), h = Math.floor(d / 36e5) % 24, m = Math.floor(d / 6e4) % 60, s = Math.floor(d / 1e3) % 60;
  cd.innerHTML = [["Hari", days], ["Jam", h], ["Menit", m], ["Detik", s]].map(([l, v]) => `<div><b>${v}</b><span>${l}</span></div>`).join("");
}, 1000);

// kelopak bunga jatuh
const cv = $("#petals"), cx = cv.getContext("2d"); const P = [];
function rs() { cv.width = innerWidth; cv.height = innerHeight; } rs(); onresize = rs;
const N = innerWidth < 600 ? 14 : 28;
for (let i = 0; i < N; i++) P.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: 5 + Math.random() * 7, s: .4 + Math.random(), w: Math.random() * 6, a: Math.random() * 6 });
(function loop() {
  cx.clearRect(0, 0, cv.width, cv.height);
  P.forEach(p => {
    p.y += p.s; p.w += .02; p.x += Math.sin(p.w); p.a += .02;
    if (p.y > cv.height + 10) { p.y = -10; p.x = Math.random() * cv.width; }
    cx.save(); cx.translate(p.x, p.y); cx.rotate(p.a); cx.fillStyle = "rgba(214,140,150,.55)";
    cx.beginPath(); cx.ellipse(0, 0, p.r, p.r / 2, 0, 0, 7); cx.fill(); cx.restore();
  });
  requestAnimationFrame(loop);
})();

// RSVP -> Google Sheets
const form = $("#rsvpForm"), st = $("#status");
form.onsubmit = async e => {
  e.preventDefault();
  if (!C.scriptUrl) return st.textContent = "Isi scriptUrl di js/config.js terlebih dahulu.";
  st.textContent = "Mengirim...";
  try {
    await fetch(C.scriptUrl, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
    st.textContent = "Terima kasih, data terkirim ✓"; form.reset(); setTimeout(loadWishes, 1500);
  } catch { st.textContent = "Gagal mengirim, coba lagi."; }
};
async function loadWishes() {
  if (!C.scriptUrl) return;
  try {
    const r = await (await fetch(C.scriptUrl)).json();
    $("#wishes").innerHTML = r.reverse().filter(x => x.ucapan).map(x => {
      // Cek status kehadiran untuk menentukan class warna
      const statusLower = (x.kehadiran || '').toLowerCase();
      const badgeClass = statusLower.includes('tidak') ? 'badge-tidak-hadir' : 'badge-hadir';

      return `<div class="wish">
        <b>${esc(x.nama)}</b> 
        <small class="${badgeClass}">${esc(x.kehadiran)}</small>
        <p>${esc(x.ucapan)}</p>
      </div>`;
    }).join("");
  } catch { }
}
loadWishes();
