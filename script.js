const menuToggle = document.getElementById('menuToggle');
const siteNav = document.getElementById('siteNav');

menuToggle.addEventListener('click', () => {
  const open = siteNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.site-nav a').forEach(link => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const navLinks = [...document.querySelectorAll('.site-nav a:not(.nav-cta)')];
const sections = [...document.querySelectorAll('main section[id]')];

const setActiveNav = () => {
  const y = window.scrollY + 140;
  let current = 'home';
  sections.forEach(section => {
    if (section.offsetTop <= y) current = section.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
};
window.addEventListener('scroll', setActiveNav, { passive: true });
setActiveNav();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.project-card,.timeline-card,.skills-grid article,.research-grid article,.ai-stack article,.fact-stack div').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

const cartoDark = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const cartoLight = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const tileOptions = {
  maxZoom: 20,
  attribution: '&copy; OpenStreetMap &copy; CARTO'
};

function createPinIcon() {
  return L.divIcon({
    className: '',
    html: '<div class="map-pin"></div>',
    iconSize: [22, 22],
    iconAnchor: [11, 22]
  });
}

if (window.L) {
  const heroMap = L.map('heroMap', {
    zoomControl: false,
    attributionControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false
  }).setView([-1.196, 36.835], 10.2);

  L.tileLayer(cartoDark, tileOptions).addTo(heroMap);

  const pin = createPinIcon();
  L.marker([-1.286389, 36.817223], { icon: pin }).addTo(heroMap).bindTooltip('Nairobi', { permanent: true, direction: 'right', offset: [12, -10] });
  L.marker([-1.1714, 36.8356], { icon: pin }).addTo(heroMap).bindTooltip('Kiambu', { permanent: true, direction: 'right', offset: [12, -10] });

  L.polygon([
    [-1.39, 36.67], [-1.38, 36.94], [-1.23, 37.04], [-1.04, 36.97],
    [-0.98, 36.79], [-1.11, 36.64]
  ], {
    color: '#55e7b5', weight: 1.4, fillColor: '#55e7b5', fillOpacity: 0.05
  }).addTo(heroMap);

  const detailMap = L.map('detailMap', { zoomControl: true }).setView([-1.18, 36.84], 10);
  L.tileLayer(cartoDark, tileOptions).addTo(detailMap);

  const analysisLayer = L.layerGroup().addTo(detailMap);
  const surveyLayer = L.layerGroup().addTo(detailMap);
  const routeLayer = L.layerGroup().addTo(detailMap);
  const bufferLayer = L.layerGroup();

  L.polygon([
    [-1.34,36.69],[-1.37,36.89],[-1.24,37.02],[-1.05,36.96],[-1.02,36.76],[-1.16,36.65]
  ], { color:'#55e7b5', weight:2, fillColor:'#55e7b5', fillOpacity:.08 })
    .bindPopup('<strong>Illustrative analysis zone</strong><br>Portfolio demonstration layer.')
    .addTo(analysisLayer);

  const points = [
    { name:'Nairobi', coords:[-1.286389,36.817223], note:'Urban data & mapping hub' },
    { name:'Kiambu', coords:[-1.1714,36.8356], note:'Survey & research context' },
    { name:'Ndumberi', coords:[-1.157,36.82], note:'GIS crime-analysis study area' },
    { name:'Thika corridor', coords:[-1.05,37.07], note:'Infrastructure mapping context' }
  ];

  points.forEach(point => {
    L.marker(point.coords, { icon:createPinIcon() })
      .bindPopup('<strong>' + point.name + '</strong><br>' + point.note)
      .addTo(surveyLayer);
  });

  L.polyline([
    [-1.286,36.817],[-1.23,36.83],[-1.171,36.836],[-1.11,36.93],[-1.05,37.07]
  ], { color:'#f1bd62', weight:3, opacity:.85, dashArray:'8,8' })
    .bindPopup('Illustrative field route')
    .addTo(routeLayer);

  [
    [-1.215,36.79],[-1.14,36.87],[-1.08,36.96]
  ].forEach(c => {
    L.circle(c, { radius:2200, color:'#78c4e5', fillColor:'#78c4e5', fillOpacity:.06, weight:1 })
      .addTo(bufferLayer);
  });

  document.querySelectorAll('[data-layer]').forEach(input => {
    input.addEventListener('change', () => {
      const mapLayers = { analysis:analysisLayer, survey:surveyLayer, route:routeLayer, buffers:bufferLayer };
      const layer = mapLayers[input.dataset.layer];
      if (!layer) return;
      if (input.checked) layer.addTo(detailMap);
      else detailMap.removeLayer(layer);
    });
  });

  setTimeout(() => {
    heroMap.invalidateSize();
    detailMap.invalidateSize();
  }, 250);
}

const runCode = document.getElementById('runCode');
const codeOutput = document.getElementById('codeOutput');
if (runCode && codeOutput) {
  runCode.addEventListener('click', () => {
    runCode.textContent = 'Running…';
    codeOutput.textContent = 'Validating features → fitting model → generating spatial predictions…';
    setTimeout(() => {
      codeOutput.textContent = '✓ Demo complete: prediction layer ready for visualization.';
      runCode.textContent = '▶ Run';
    }, 850);
  });
}
