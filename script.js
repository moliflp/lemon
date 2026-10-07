// Edita aquí tus proyectos. Las imágenes viven en la carpeta /assets
const A = f => `assets/${f}`;
const projects = [
  { title:"Mixet", sub:"Identidad y piezas para sushi a domicilio", tags:["Branding","Cartelería"], cover:"mupi.jpg",
    desc:"Logotipo de letras burbuja, sistema de iconos, folleto de platos, cartel de reparto, vasos, pegatina y rótulo circular.",
    imgs:["mupi.jpg","mixet-1.jpg","mixet-2.jpg","vasos.jpg","pegatina.jpg","rotulo.jpg","destacada-13.jpg","destacada-14.jpg","destacada-15.jpg","destacada-16.jpg","mixet-perfil.jpg"] },
  { title:"Los Carmenes", sub:"Carta de tapas, vitrina y brioches", tags:["Cartas"], cover:"carmenes-2.jpg",
    desc:"Portada y carta para un gastrobar, con la ilustración de la pita como fondo y una paleta cálida de color miel.",
    imgs:["carmenes-1.jpg","carmenes-2.jpg"] },
  { title:"Barber López", sub:"Logotipo, rótulo y vinilo", tags:["Branding","Cartelería"], cover:"barber-logo-2.jpg",
    desc:"Logotipo con navaja barbera, versiones con y sin descriptor, y el vinilo para el escaparate de la peluquería.",
    imgs:["barber-logo-2.jpg","barber-logo-1.jpg","vinilo.jpg"] },
  { title:"Ginés Peregrín", sub:"Carta de restaurante de autor", tags:["Cartas"], cover:"gines-3.jpg",
    desc:"Carta con ilustraciones de ojo, nariz y boca para invitar a mirar, oler y degustar. Disponible en español, inglés y alemán.",
    imgs:["gines-3.jpg","gines-4.jpg"] },
  { title:"Residencia Cívitas", sub:"Folleto de bienvenida y precios", tags:["Editorial"], cover:"civitas-1.jpg",
    desc:"Díptico con calendario académico, plano universitario, precios del curso y actividades mensuales.",
    imgs:["civitas-1.jpg","civitas-2.jpg"] },
  { title:"Experimenta 96", sub:"Revista de cultura del diseño", tags:["Editorial"], cover:"rev-2.jpg",
    desc:"Maquetación de un reportaje sobre René Magritte: portada, aperturas a doble página y tipografía con fuerte jerarquía.",
    imgs:["rev-1.jpg","rev-2.jpg","rev-3.jpg","rev-4.jpg"] }
];

const $ = s => document.querySelector(s);
const grid = $("#grid"), seg = $(".seg"), sheet = $("#sheet");
let cur = null, idx = 0;

// Filtros
const cats = ["Todo", ...new Set(projects.flatMap(p => p.tags))];
seg.innerHTML = cats.map((c, i) => `<button role="tab" aria-selected="${i === 0}">${c}</button>`).join("");
seg.addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  seg.querySelectorAll("button").forEach(x => x.setAttribute("aria-selected", x === b));
  const c = b.textContent;
  grid.querySelectorAll(".tile").forEach((t, i) => { t.hidden = !(c === "Todo" || projects[i].tags.includes(c)); });
});

// Tarjetas
grid.innerHTML = projects.map((p, i) => `
  <button class="tile" data-i="${i}" aria-label="Abrir ${p.title}">
    <img src="${A(p.cover)}" alt="${p.title}: ${p.sub}" loading="lazy">
    <div class="cap"><b>${p.title}</b><span>${p.sub}</span></div>
  </button>`).join("");
grid.addEventListener("click", e => { const t = e.target.closest(".tile"); if (t) open(+t.dataset.i); });
grid.addEventListener("pointermove", e => {
  const t = e.target.closest(".tile"); if (!t) return;
  const r = t.getBoundingClientRect();
  t.style.setProperty("--mx", (e.clientX - r.left) + "px");
  t.style.setProperty("--my", (e.clientY - r.top) + "px");
});

// Hoja de detalle
function open(i) {
  cur = projects[i]; idx = 0;
  $("#s-title").textContent = cur.title;
  $("#s-desc").textContent = cur.desc;
  $("#s-thumbs").innerHTML = cur.imgs.map((f, k) =>
    `<button data-k="${k}" aria-label="Imagen ${k + 1}"><img src="${A(f)}" alt="" loading="lazy"></button>`).join("");
  show(0); sheet.showModal();
}
function show(k) {
  idx = (k + cur.imgs.length) % cur.imgs.length;
  const img = $("#s-img"); img.src = A(cur.imgs[idx]); img.alt = `${cur.title}, imagen ${idx + 1} de ${cur.imgs.length}`;
  [...$("#s-thumbs").children].forEach((b, j) => b.toggleAttribute("aria-current", j === idx));
  $("#s-thumbs").children[idx].scrollIntoView({ inline: "center", block: "nearest" });
  sheet.querySelectorAll(".nav").forEach(n => n.hidden = cur.imgs.length < 2);
}
sheet.addEventListener("click", e => {
  if (e.target === sheet || e.target.closest("[data-close]")) sheet.close();
  else if (e.target.closest(".prev")) show(idx - 1);
  else if (e.target.closest(".next")) show(idx + 1);
  else { const b = e.target.closest("[data-k]"); if (b) show(+b.dataset.k); }
});
sheet.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") show(idx - 1);
  if (e.key === "ArrowRight") show(idx + 1);
});

// Dock: marca la sección visible
const links = [...document.querySelectorAll(".dock a")];
const io = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) links.forEach(a => a.classList.toggle("on", a.hash === "#" + en.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section").forEach(s => io.observe(s));

$("#y").textContent = new Date().getFullYear();
