// ===== Tus proyectos: edita textos, colores (ac) y orden aquí. Imágenes en /assets =====
// Cada imagen: [archivo, pie de foto, true si es pequeña (icono)]
const P = [
  { id:"mixet", title:"Mixet", sub:"Identidad y piezas para sushi a domicilio", tags:["Branding","Cartelería"], ac:"#6ec6d6", g:1, cover:"mupi.jpg",
    desc:"Logotipo de letras burbuja, sistema de color, folletos de platos, mupi de reparto, vasos, pegatina y rótulo circular.",
    imgs:[["mupi.jpg","Mupi de reparto"],["mixet-1.jpg","Folleto de platos: classics"],["mixet-2.jpg","Folleto de platos: premium y spicy"],["vasos.jpg","Diseño de vasos"],["pegatina.jpg","Pegatina"],["rotulo.jpg","Rótulo circular"],
      ["destacada-13.jpg","Portadas de destacadas y foto de perfil",1],["destacada-14.jpg","",1],["destacada-15.jpg","",1],["destacada-16.jpg","",1],["mixet-perfil.jpg","",1]] },
  { id:"loscarmenes", title:"Los Carmenes", sub:"Carta de tapas, vitrina y brioches", tags:["Cartas"], ac:"#d08a45", g:2, cover:"carmenes-2.jpg",
    desc:"Portada y carta para un gastrobar, con la ilustración de la pita como fondo y una paleta cálida de color miel.",
    imgs:[["carmenes-1.jpg","Portada"],["carmenes-2.jpg","Carta"]] },
  { id:"barberlopez", title:"Barber López", sub:"Logotipo, rótulo y vinilo", tags:["Branding","Cartelería"], ac:"#e6e6ea", g:3, cover:"barber-logo-2.jpg", pos:"center",
    desc:"Logotipo con navaja barbera, con y sin descriptor, y el vinilo para el escaparate de la peluquería.",
    imgs:[["barber-logo-2.jpg","Logotipo con descriptor"],["barber-logo-1.jpg","Logotipo"],["vinilo.jpg","Vinilo de escaparate"]] },
  { id:"ginesperegrin", title:"Ginés Peregrín", sub:"Carta de restaurante de autor", tags:["Cartas"], ac:"#c9a15a", g:4, cover:"gines-3.jpg",
    desc:"Carta con ilustraciones de ojo, nariz y boca que invitan a mirar, oler y degustar. Disponible en español, inglés y alemán.",
    imgs:[["gines-3.jpg","Menú degustación y entrantes"],["gines-4.jpg","Carnes, pescados y postres"]] },
  { id:"civitas", title:"Residencia Cívitas", sub:"Folleto de bienvenida y precios", tags:["Editorial"], ac:"#f26a2e", g:5, cover:"civitas-1.jpg", pos:"center",
    desc:"Díptico con calendario académico, plano universitario, precios del curso y actividades de cada mes.",
    imgs:[["civitas-1.jpg","Cara exterior"],["civitas-2.jpg","Cara interior"]] },
  { id:"experimenta96", title:"Experimenta 96", sub:"Revista de cultura del diseño", tags:["Editorial"], ac:"#e0313a", g:6, cover:"rev-2.jpg", pos:"center",
    desc:"Maquetación de un reportaje sobre René Magritte: portada, aperturas a doble página y tipografía con fuerte jerarquía.",
    imgs:[["rev-1.jpg","Portada"],["rev-2.jpg","Apertura del reportaje"],["rev-3.jpg","Magritte, mucho más que surrealista"],["rev-4.jpg","Analizamos sus obras"]] }
];

const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = matchMedia("(prefers-reduced-motion:reduce)").matches, FINE = matchMedia("(pointer:fine)").matches, LITE = innerWidth < 820;
const A = f => "assets/" + f, HOME_AC = "#c8ff3d";
const wait = ms => new Promise(r => setTimeout(r, RM ? 0 : ms));
const hash = () => location.hash.slice(1) || "/";
const mouse = { x: 0, y: 0 };
let R = "", busy = false, pend = null, T = [], lastY = 0;
history.scrollRestoration = "manual";

// Texto en letras para animar
function split(el, o = 0) {
  const t = el.textContent; el.setAttribute("aria-label", t); el.textContent = ""; let i = 0;
  t.split(" ").forEach((w, wi, a) => {
    const s = document.createElement("span"); s.className = "w"; s.setAttribute("aria-hidden", "true");
    [...w].forEach(ch => { const l = document.createElement("span"); l.className = "lt"; l.textContent = ch; l.style.setProperty("--i", i++); s.append(l); });
    el.append(s); if (wi < a.length - 1) el.append(" ");
  });
  el.style.setProperty("--o", o + "ms");
}

// ===== Vistas =====
function home() {
  const names = P.map(p => `<span>${p.title}</span>`).join(""), half = names + names;
  const cards = P.map((p, i) => `<a class="cell rv" href="#/p/${p.id}" style="--dl:${(i % 2) * 90}ms"><div class="tilt"><img src="${A(p.cover)}" alt="${p.title}: ${p.sub}" loading="lazy" style="object-position:${p.pos || "top"}"><div class="cap"><b>${p.title}</b><span>${p.sub}</span></div></div></a>`).join("");
  const tags = ["Todo", ...new Set(P.flatMap(p => p.tags))];
  const btns = tags.map((t, i) => `<button data-t="${t}" aria-selected="${i === 0}">${t}</button>`).join("");
  const words = "Del logotipo al vaso, de la carta a la fachada. Cada pieza se diseña como parte de un mismo sistema.".split(" ").map(w => `<span class="sw">${w} </span>`).join("");
  return `<section class="hero" id="top"><h1 class="disp sp">Diseño gráfico</h1><p class="cyc">Hago <em id="cyc"></em></p>
  <p class="sub">Identidades, cartas, cartelería y piezas editoriales para negocios con carácter.</p><i class="cue"></i></section>
  <div class="band" aria-hidden="true"><div class="track">${half}${half}</div></div>
  <section class="top" id="trabajos"><div class="wrap"><div class="hdr"><h2 class="disp sp">Trabajos</h2><div class="seg" id="flt"><i class="ind"></i>${btns}</div></div><div class="grid">${cards}</div></div></section>
  <section class="msg"><div class="wrap"><p id="st">${words}</p></div></section>
  <footer class="ft wrap"><p class="disp rv">Gracias por mirar</p><a href="#/" data-go="top">Volver arriba</a></footer>`;
}
function proj(p) {
  const n = P[(P.indexOf(p) + 1) % P.length]; let g = "", row = "", rc = "";
  const flush = () => { if (row) { g += `<div class="row">${row}</div><p>${rc}</p>`; row = rc = ""; } };
  p.imgs.forEach(([f, c, s]) => {
    const im = `<img src="${A(f)}" alt="${p.title}: ${c || rc}">`;
    if (s) { row += `<figure class="fig sm">${im}</figure>`; rc = rc || c; }
    else { flush(); g += `<figure class="fig">${im}<figcaption>${c}</figcaption></figure>`; }
  });
  flush();
  return `<section class="pt wrap"><a class="back" href="#/" data-go="trabajos">Todos los trabajos</a><h1 class="disp sp">${p.title}</h1>
  <div class="meta rv"><p class="lead">${p.desc}</p><ul class="tags">${p.tags.map(t => `<li>${t}</li>`).join("")}</ul></div></section>
  <section class="gal wrap">${g}</section>
  <a class="next" href="#/p/${n.id}"><small>Siguiente proyecto</small><span class="disp">${n.title}</span></a>`;
}

// ===== Interacciones de la portada =====
function initHome() {
  const f = $("#flt"), ind = $(".ind", f), cells = $$(".cell");
  const lay = () => cells.filter(c => !c.hidden).forEach((c, i) => c.style.gridColumn = "span " + [7, 5, 5, 7][i % 4]);
  f.onclick = e => {
    const b = e.target.closest("button"); if (!b) return;
    $$("button", f).forEach(x => x.setAttribute("aria-selected", x === b));
    ind.style.left = b.offsetLeft + "px"; ind.style.width = b.offsetWidth + "px";
    cells.forEach((c, i) => { c.hidden = !(b.dataset.t === "Todo" || P[i].tags.includes(b.dataset.t)); c.classList.remove("in"); });
    lay(); cells.filter(c => !c.hidden).forEach((c, i) => setTimeout(() => c.classList.add("in"), 60 + i * 90));
  };
  lay();
  $$(".tilt").forEach(t => {
    t.onpointermove = e => {
      const r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      t.style.transform = `perspective(900px) rotateY(${(x - .5) * 14}deg) rotateX(${(.5 - y) * 14}deg) scale(1.02)`;
      t.style.setProperty("--px", x * 2 - 1); t.style.setProperty("--py", y * 2 - 1);
      t.style.setProperty("--gx", x * 100 + "%"); t.style.setProperty("--gy", y * 100 + "%");
    };
    t.onpointerleave = () => { t.style.transform = ""; t.style.setProperty("--px", 0); t.style.setProperty("--py", 0); };
  });
  const el = $("#cyc"), W = ["identidades", "cartas", "cartelería", "revistas"]; let k = 0;
  const put = () => { const w = W[k++ % W.length]; el.textContent = ""; [...w].forEach((ch, j) => { const l = document.createElement("span"); l.className = "lt"; l.textContent = ch; l.style.setProperty("--i", j); el.append(l); }); };
  put(); T.push(setInterval(put, 2600));
}

// ===== Escena 3D de fondo =====
const scene = (() => {
  const nop = { set() {}, frame() {}, size() {} };
  if (!window.THREE) return nop;
  let rd; try { rd = new THREE.WebGLRenderer({ canvas: $("#gl"), antialias: !LITE, alpha: true }); } catch (e) { return nop; }
  rd.setPixelRatio(Math.min(devicePixelRatio, LITE ? 1.5 : 2));
  const sc = new THREE.Scene(), cam = new THREE.PerspectiveCamera(50, 1, .1, 100); cam.position.z = 7;
  const c = document.createElement("canvas"); c.width = 256; c.height = 128; const g = c.getContext("2d"), gr = g.createLinearGradient(0, 0, 0, 128);
  gr.addColorStop(0, "#fff"); gr.addColorStop(.5, "#445"); gr.addColorStop(1, "#99a"); g.fillStyle = gr; g.fillRect(0, 0, 256, 128);
  g.fillStyle = "#fff"; g.fillRect(30, 24, 40, 10); g.fillRect(160, 40, 60, 8);
  const env = new THREE.CanvasTexture(c); env.mapping = THREE.EquirectangularReflectionMapping;
  const G = [new THREE.DodecahedronGeometry(1.7, 0), new THREE.TorusKnotGeometry(1.1, .32, 120, 14), new THREE.IcosahedronGeometry(1.7, 1), new THREE.BoxGeometry(2, 2, 2, 3, 3, 3), new THREE.TorusGeometry(1.3, .5, 14, 40), new THREE.CylinderGeometry(1, 1.3, 2.2, 8, 3), new THREE.OctahedronGeometry(1.8)];
  const tg = new THREE.Color(HOME_AC), pv = new THREE.Group(); sc.add(pv);
  const wire = new THREE.Mesh(G[0], new THREE.MeshBasicMaterial({ wireframe: true, transparent: true, opacity: .5, color: HOME_AC }));
  const shell = new THREE.Mesh(G[0], new THREE.MeshPhysicalMaterial({ color: HOME_AC, metalness: .2, roughness: .05, transparent: true, opacity: .22, envMap: env, envMapIntensity: 2, clearcoat: 1, side: THREE.DoubleSide, depthWrite: false }));
  const core = new THREE.Mesh(new THREE.OctahedronGeometry(.7), new THREE.MeshStandardMaterial({ color: 0xe9e9ee, metalness: 1, roughness: .12, envMap: env, flatShading: true }));
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.6, .025, 12, 140), new THREE.MeshBasicMaterial({ color: HOME_AC })); ring.rotation.x = 1.2;
  pv.add(wire, shell, core, ring);
  const N = LITE ? 200 : 500, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { const r = 4 + Math.random() * 6, a = Math.random() * 6.28, b = Math.random() * 3.14; pos.set([r * Math.sin(b) * Math.cos(a), r * Math.cos(b) * .7, r * Math.sin(b) * Math.sin(a) - 2], i * 3); }
  const pg = new THREE.BufferGeometry(); pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const pts = new THREE.Points(pg, new THREE.PointsMaterial({ size: .05, color: HOME_AC, transparent: true, opacity: .7, depthWrite: false })); sc.add(pts);
  sc.add(new THREE.AmbientLight(0xffffff, .4)); const key = new THREE.DirectionalLight(0xffffff, 1); key.position.set(3, 4, 5); sc.add(key);
  const mats = [wire.material, shell.material, ring.material, pts.material];
  let pop = 0, proj = 0, tmx = 0, tmy = 0, ly = 0;
  const size = () => { rd.setSize(innerWidth, innerHeight, false); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); };
  size();
  return {
    size,
    set(i, color, isProj) { wire.geometry = shell.geometry = G[i]; tg.set(color); proj = isProj ? 1 : 0; pop = 1; if (RM) { mats.forEach(m => m.color.copy(tg)); this.frame(0); } },
    frame(t) {
      const y = scrollY, p = Math.min(y / innerHeight, 1.4), wide = innerWidth > 820, dv = (y - ly) * .0015; ly = y;
      tmx += (mouse.x - tmx) * .05; tmy += (mouse.y - tmy) * .05;
      pv.position.x += ((proj ? (wide ? 3 : 0) : (wide ? p * 2.8 : 0)) - pv.position.x) * .06;
      pv.position.y += ((proj ? .3 : p * 1.1) - pv.position.y) * .06;
      const s = pv.scale.x + (((proj ? .8 : 1 - .3 * Math.min(p, 1)) * (1 + pop * .6)) - pv.scale.x) * .08; pv.scale.setScalar(s);
      if (!RM) { pv.rotation.y += .004 + pop * .08 + dv; core.rotation.y -= .01; core.rotation.x += .006; ring.rotation.z += .004; pts.rotation.y += .0006; }
      pv.rotation.x = tmy * .5 + Math.sin(t * .0004) * .2; pop *= .94;
      cam.position.x = tmx * .6; cam.position.y = -tmy * .4; cam.lookAt(0, 0, 0);
      if (!RM) mats.forEach(m => m.color.lerp(tg, .06));
      rd.render(sc, cam);
    }
  };
})();

// ===== Montaje, revelado y transición de página =====
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
const pf = h => P.find(p => h === "/p/" + p.id);

function mount(h) {
  T.forEach(clearInterval); T = []; cur.classList.remove("big"); cur.textContent = "";
  const p = pf(h), app = $("#app"); R = h;
  app.classList.remove("go"); app.innerHTML = p ? proj(p) : home();
  document.documentElement.style.setProperty("--ac", p ? p.ac : HOME_AC);
  document.title = (p ? p.title + " · " : "") + "Tu Nombre · Diseño gráfico";
  $$(".sp", app).forEach((e, i) => split(e, i * 120));
  scene.set(p ? p.g : 0, p ? p.ac : HOME_AC, !!p);
  if (!p) initHome();
}
function reveal() {
  const app = $("#app"); app.classList.add("go");
  $$(".rv,.fig", app).forEach(e => io.observe(e));
  const f = $("#flt"); if (f) { const b = $("[aria-selected=true]", f), i = $(".ind", f); i.style.left = b.offsetLeft + "px"; i.style.width = b.offsetWidth + "px"; }
  onScroll();
}
async function nav() {
  if (busy) return; const h = hash(); if (h === R) return; busy = true;
  const p = pf(h), cv = $("#cv");
  cv.style.setProperty("--cvac", p ? p.ac : HOME_AC); $("#cvt").textContent = p ? p.title : "Inicio";
  cv.className = "in"; await wait(950);
  mount(h); scrollTo({ top: 0, behavior: "instant" });
  if (pend) { const t = $("#" + pend); pend = null; if (t) scrollTo({ top: t.getBoundingClientRect().top + scrollY, behavior: "instant" }); }
  cv.className = "out"; reveal(); await wait(950); cv.className = ""; busy = false;
  if (hash() !== R) nav();
}

// ===== Scroll, cursor y bucle =====
function onScroll() {
  const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
  $("#bar").style.transform = `scaleX(${h > 0 ? y / h : 0})`;
  $("#hd").classList.toggle("hide", y > lastY && y > 120); lastY = y;
  const st = $("#st"); if (st) {
    const r = st.getBoundingClientRect(), pr = Math.max(0, Math.min(1, (innerHeight * .8 - r.top) / (r.height + innerHeight * .3))), w = $$(".sw", st), n = Math.round(pr * w.length);
    w.forEach((x, i) => x.classList.toggle("on", i < n));
  }
}
addEventListener("scroll", onScroll, { passive: true });
addEventListener("resize", () => scene.size());
const cur = $("#cursor"); let cx = 0, cy = 0, tx = 0, ty = 0;
addEventListener("pointermove", e => {
  mouse.x = e.clientX / innerWidth * 2 - 1; mouse.y = e.clientY / innerHeight * 2 - 1; tx = e.clientX; ty = e.clientY;
  const h = e.target.closest(".cell"); cur.classList.toggle("big", !!h); cur.textContent = h ? "Ver" : "";
});
document.addEventListener("click", e => {
  const a = e.target.closest("[data-go]"); if (!a) return; const id = a.dataset.go;
  if (R === "/") { e.preventDefault(); id === "top" ? scrollTo({ top: 0, behavior: "smooth" }) : $("#" + id).scrollIntoView({ behavior: "smooth" }); }
  else pend = id === "top" ? null : id;
});
function loop(t) {
  scene.frame(t); cx += (tx - cx) * .2; cy += (ty - cy) * .2; cur.style.transform = `translate(${cx}px,${cy}px)`;
  requestAnimationFrame(loop);
}

// ===== Arranque con pantalla de carga =====
(async function boot() {
  const t = $("#ldt"); t.textContent = "Tu Nombre"; split(t); $("#ld").classList.add("go");
  await Promise.all([document.fonts ? document.fonts.ready : 0, wait(1400)]);
  mount(hash()); $("#ld").classList.add("off"); reveal();
  addEventListener("hashchange", nav);
  if (RM) scene.frame(0); else requestAnimationFrame(loop);
})();
