// Small interactions: mobile navigation, rotating role text, reveal animations and score count-up.
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const roles = ['Data Engineering', 'Data Analytics', 'Web Development'];
const roleElement = document.getElementById('typed-role');
let roleIndex = 0;
let letterIndex = roles[0].length;
let deleting = true;
function typeRole() {
  const current = roles[roleIndex];
  if (deleting) {
    letterIndex--;
    roleElement.textContent = current.slice(0, Math.max(0, letterIndex));
    if (letterIndex <= 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typeRole, 350);
      return;
    }
    setTimeout(typeRole, 45);
  } else {
    const next = roles[roleIndex];
    letterIndex++;
    roleElement.textContent = next.slice(0, letterIndex);
    if (letterIndex >= next.length) {
      deleting = true;
      setTimeout(typeRole, 1700);
      return;
    }
    setTimeout(typeRole, 75);
  }
}
setTimeout(typeRole, 1800);

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

const scoreObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const card = entry.target;
    card.querySelectorAll('.score').forEach(score => {
      const target = Number(score.dataset.count);
      const decimals = Number(score.dataset.decimals || 0);
      const duration = 1300;
      const start = performance.now();
      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        score.textContent = (target * eased).toFixed(decimals);
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
    card.querySelectorAll('.score-track span').forEach(bar => {
      requestAnimationFrame(() => { bar.style.width = getComputedStyle(bar).getPropertyValue('--score'); });
    });
    observer.unobserve(card);
  });
}, { threshold: 0.35 });
document.querySelectorAll('.education-card').forEach(card => scoreObserver.observe(card));

document.getElementById('year').textContent = new Date().getFullYear();
