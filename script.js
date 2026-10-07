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

document.querySelectorAll('[data-layer-toggle]').forEach(input => {
  input.addEventListener('change', () => {
    const name = input.dataset.layerToggle;
    document.querySelectorAll('[data-layer="' + name + '"]').forEach(layer => {
      layer.classList.toggle('on', input.checked);
    });
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