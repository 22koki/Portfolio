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

  const defaultView = { center: [-1.20, 36.85], zoom: 10 };
  const map = L.map('liveMap', {
    zoomControl: true,
    scrollWheelZoom: true
  }).setView(defaultView.center, defaultView.zoom);

  window.portfolioMap = map;
  window.portfolioMapDefault = defaultView;

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

  const coordinateLabel = document.getElementById('mapCoordinates');
  map.on('click', (event) => {
    if (coordinateLabel) {
      coordinateLabel.textContent = event.latlng.lat.toFixed(5) + '°, ' + event.latlng.lng.toFixed(5) + '°';
    }
  });

  document.getElementById('resetMap')?.addEventListener('click', () => {
    map.setView(defaultView.center, defaultView.zoom);
    if (coordinateLabel) coordinateLabel.textContent = 'Click the map to inspect coordinates';
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

document.querySelectorAll('.project-filter').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.project-filter').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
    });
  });
});

document.querySelectorAll('.case-link').forEach(button => {
  button.addEventListener('click', () => {
    document.getElementById('case-' + button.dataset.case)?.showModal();
  });
});
document.querySelectorAll('.case-study').forEach(dialog => {
  dialog.querySelector('.case-close')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (outside) dialog.close();
  });
});

const yearNode = document.getElementById('year');
if (yearNode) yearNode.textContent = new Date().getFullYear();

document.getElementById('downloadCv')?.addEventListener('click', () => {
  if (!window.jspdf) return;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit:'pt', format:'a4' });
  const left = 52;
  let y = 56;

  doc.setFont('helvetica','bold');
  doc.setFontSize(22);
  doc.text('Christine Wairimu Wahome', left, y);
  y += 22;
  doc.setFont('helvetica','normal');
  doc.setFontSize(11);
  doc.text('Geospatial & Geomatic Engineer | GIS | Remote Sensing | Data | AI', left, y);
  y += 16;
  doc.text('Nairobi, Kenya | +254 717 396 334 | christine.wahome@students.jkuat.ac.ke', left, y);
  y += 28;

  const section = (title) => {
    doc.setFont('helvetica','bold'); doc.setFontSize(12); doc.text(title.toUpperCase(), left, y); y += 16;
    doc.setDrawColor(20,110,85); doc.line(left, y, 545, y); y += 14;
  };
  const body = (text, indent=0) => {
    doc.setFont('helvetica','normal'); doc.setFontSize(9.5);
    const lines = doc.splitTextToSize(text, 493-indent);
    doc.text(lines, left+indent, y); y += lines.length*12 + 7;
  };
  const role = (title, meta) => {
    doc.setFont('helvetica','bold'); doc.setFontSize(10.5); doc.text(title, left, y);
    doc.setFont('helvetica','normal'); doc.setFontSize(8.5); doc.text(meta, 545, y, {align:'right'}); y += 14;
  };

  section('Professional Profile');
  body('Geospatial and Geomatic Engineer with field and office experience across surveying, GIS, remote sensing, spatial data analysis, research, data analytics and AI-related workflows. Experienced in turning raw spatial information into maps, reports, dashboards and decision-support outputs.');

  section('Selected Experience');
  role('Earthscope Company Limited - Geomatic / Geospatial Engineer Intern', 'Sep 2024 - May 2025');
  body('Supported cadastral, topographic, boundary, subdivision, amalgamation, utility and environmental surveys; worked with survey documentation, mutations, deed plans and map data.');
  role('AI Model Training', 'May - June');
  body('Worked on structured evaluation, annotation review, guideline consistency and data-quality workflows for AI model training.');
  role('Papercorp Limited - Researcher & Editor', 'Sep 2020 - Oct 2022');
  body('Conducted quantitative and qualitative research, analyzed findings, prepared presentations and produced clear technical and research content.');
  role('SS Mehta & Sons / Lexis International - Project Work', 'Project-based');
  body('Supported road and construction surveying, benchmarks, control points, profiles, leveling, earthworks and project/database coordination.');

  section('Selected Projects');
  role('Prediction of Crime Based on GIS - Ndumberi, Kiambu', 'JKUAT Final Year Project');
  body('Combined GIS and machine-learning methods using land use/land cover, accessibility, population, terrain and satellite data to analyze spatial crime-risk patterns.');
  role('Spatial APIs & Dashboards', 'Geospatial Development');
  body('Worked with GeoJSON, Python, SQL, data cleaning, spatial retrieval and dashboard-oriented workflows.');
  role('Riparian & Utility Buffer Mapping', 'Earthscope');
  body('Supported spatial data collection and buffer mapping for riparian areas, pipelines, sewer lines, power lines and waterbodies.');

  section('Skills');
  body('GIS & Mapping: QGIS, ArcGIS, GeoServer, Google Earth Engine, AutoCAD, Civil 3D\nSurveying: GNSS, RTK, Total Station, Leveling, Topographic and Cadastral Workflows\nData & Programming: Python, GeoPandas, Pandas, SQL, R, PostgreSQL, MySQL\nRemote Sensing: Landsat, Sentinel, MODIS, Earth Observation, Photogrammetry, Drone Imagery\nData Products: Power BI, Tableau, GeoJSON, Spatial APIs, Dashboards, React');

  doc.save('Christine_Wairimu_Wahome_CV.pdf');
});
