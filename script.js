const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

menuToggle?.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

mainNav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const runDemo = document.getElementById('runDemo');
const codeStatus = document.getElementById('codeStatus');
runDemo?.addEventListener('click', () => {
  runDemo.textContent = 'Running…';
  codeStatus.textContent = 'Processing spatial features → classifying → preparing visualization…';
  setTimeout(() => {
    codeStatus.textContent = '✓ Demo complete: spatial prediction layer ready.';
    runDemo.textContent = '▶ Run';
  }, 900);
});

if (window.L && document.getElementById('liveMap')) {
  const mapNode = document.getElementById('liveMap');
  mapNode.innerHTML = '';

  const map = L.map('liveMap', {
    zoomControl: true,
    scrollWheelZoom: true
  }).setView([-1.20, 36.85], 10);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const pinIcon = L.divIcon({
    className: 'portfolio-pin',
    html: '<div class="portfolio-pin-dot"></div>',
    iconSize: [18, 18],
    iconAnchor: [9, 18]
  });

  const layerGroups = {
    boundaries: L.layerGroup().addTo(map),
    landuse: L.layerGroup().addTo(map),
    survey: L.layerGroup().addTo(map),
    roads: L.layerGroup().addTo(map),
    buffers: L.layerGroup()
  };

  L.polygon([
    [-1.36, 36.68],
    [-1.34, 36.93],
    [-1.20, 37.02],
    [-1.02, 36.96],
    [-0.99, 36.77],
    [-1.12, 36.64]
  ], {
    color: '#f1cf58',
    weight: 2,
    fillColor: '#f1cf58',
    fillOpacity: 0.04
  }).bindPopup('<b>Illustrative analysis boundary</b><br>Portfolio demonstration layer.')
    .addTo(layerGroups.boundaries);

  L.polygon([
    [-1.29,36.74],[-1.28,36.91],[-1.17,36.95],[-1.10,36.84],[-1.18,36.70]
  ], {
    color: '#65efbe',
    weight: 1,
    fillColor: '#65efbe',
    fillOpacity: 0.12
  }).bindPopup('<b>Land-use sample zone</b><br>Illustrative portfolio overlay.')
    .addTo(layerGroups.landuse);

  [
    {name:'Nairobi', coords:[-1.286389,36.817223], note:'Urban mapping and spatial analysis'},
    {name:'Kiambu', coords:[-1.1714,36.8356], note:'Surveying and GIS project context'},
    {name:'Ndumberi', coords:[-1.157,36.82], note:'Crime prediction study area'}
  ].forEach(point => {
    L.marker(point.coords, {icon: pinIcon})
      .bindPopup('<b>' + point.name + '</b><br>' + point.note)
      .addTo(layerGroups.survey);
  });

  L.polyline([
    [-1.286,36.817],
    [-1.24,36.83],
    [-1.19,36.84],
    [-1.14,36.87],
    [-1.08,36.94]
  ], {
    color:'#f0cb56',
    weight:3,
    opacity:.9,
    dashArray:'8,7'
  }).bindPopup('Illustrative field / road corridor')
    .addTo(layerGroups.roads);

  [
    [-1.22,36.79],
    [-1.15,36.87],
    [-1.09,36.94]
  ].forEach(coords => {
    L.circle(coords, {
      radius:1800,
      color:'#77cfe8',
      fillColor:'#77cfe8',
      fillOpacity:.07,
      weight:1
    }).addTo(layerGroups.buffers);
  });

  document.querySelectorAll('[data-layer-toggle]').forEach(input => {
    input.addEventListener('change', () => {
      const layer = layerGroups[input.dataset.layerToggle];
      if (!layer) return;
      if (input.checked) layer.addTo(map);
      else map.removeLayer(layer);
    });
  });

  setTimeout(() => map.invalidateSize(), 250);
}

const navLinks = [...document.querySelectorAll('#mainNav a:not(.nav-connect)')];
const sections = [...document.querySelectorAll('section[id]')];
const updateActive = () => {
  const y = window.scrollY + 110;
  let current = 'home';
  sections.forEach(section => {
    if (section.offsetTop <= y) current = section.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
};
window.addEventListener('scroll', updateActive, { passive: true });
updateActive();

const items = document.querySelectorAll('.project-card,.stats article,.ai-list article,.research-card,.experience-grid article');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('reveal');
  });
}, { threshold: .1 });
items.forEach(el => observer.observe(el));

const style = document.createElement('style');
style.textContent = '.project-card,.stats article,.ai-list article,.research-card,.experience-grid article{opacity:0;transform:translateY(12px);transition:.45s ease}.reveal{opacity:1!important;transform:none!important}';
document.head.appendChild(style);