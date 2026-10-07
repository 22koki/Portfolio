const menuButton = document.getElementById('menuButton');
const navMenu = document.getElementById('navMenu');

menuButton.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('#navMenu a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('[data-toggle]').forEach(control => {
  control.addEventListener('change', () => {
    const name = control.dataset.toggle;
    document.querySelectorAll('[data-layer="' + name + '"]').forEach(layer => {
      layer.classList.toggle('active', control.checked);
    });
    if (name === 'imagery') {
      const image = document.querySelector('.static-map img');
      image.style.opacity = control.checked ? '1' : '.25';
    }
  });
});

const reveals = document.querySelectorAll('.project-card,.stats-stack article,.analysis-list article,.experience-grid article,.research-cards article');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: .12 });

reveals.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(12px)';
  el.style.transition = 'opacity .45s ease, transform .45s ease';
  observer.observe(el);
});

const style = document.createElement('style');
style.textContent = '.show{opacity:1!important;transform:none!important}';
document.head.appendChild(style);
