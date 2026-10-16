// Motion stays optional, respects system preferences, and pauses off screen.
const root = document.documentElement;
const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
const toggle = document.querySelector('.motion-toggle');
let manualPreference;
try { manualPreference = localStorage.getItem('portfolio-motion'); } catch { /* Storage can be unavailable. */ }
function applyMotion() {
  const enabled = !preference.matches && manualPreference !== 'off';
  root.dataset.motion = enabled ? 'on' : 'off';
  toggle.setAttribute('aria-pressed', String(enabled));
  toggle.setAttribute('aria-label', enabled ? 'Pause motion' : 'Enable motion');
  toggle.querySelector('.motion-label').textContent = enabled ? 'Motion on' : 'Motion off';
  toggle.disabled = preference.matches;
  toggle.title = preference.matches ? 'Motion is off to respect your device’s reduced-motion preference' : '';
}
applyMotion();
toggle.hidden = false;
toggle.addEventListener('click', () => {
  manualPreference = root.dataset.motion === 'on' ? 'off' : 'on';
  try { localStorage.setItem('portfolio-motion', manualPreference); } catch { /* Preference still applies this visit. */ }
  applyMotion();
});
preference.addEventListener('change', applyMotion);

document.addEventListener('visibilitychange', () => {
  root.classList.toggle('page-hidden', document.hidden);
});
const movingSections = document.querySelectorAll('.hero-stage, .creative');
const motionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => entry.target.classList.toggle('motion-visible', entry.isIntersecting));
}, { rootMargin: '100px' });
movingSections.forEach(section => motionObserver.observe(section));

// Content is visible without JavaScript and is revealed once as it enters view.
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.section-intro, .about-copy, .section-heading, .career-card, .communication-grid article, .creative-card, .contact > div').forEach((item, index) => {
  item.classList.add('reveal');
  item.style.setProperty('--reveal-delay', `${index % 2 * 90}ms`);
  revealObserver.observe(item);
});

const hero = document.querySelector('.hero-stage');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
let pointerFrame = 0;
hero.addEventListener('pointermove', event => {
  if (root.dataset.motion !== 'on' || !finePointer.matches || pointerFrame) return;
  const x = event.clientX / window.innerWidth - .5;
  const rect = hero.getBoundingClientRect();
  const y = (event.clientY - rect.top) / rect.height - .5;
  pointerFrame = requestAnimationFrame(() => {
    hero.style.setProperty('--pointer-x', `${x * 28}px`);
    hero.style.setProperty('--pointer-y', `${y * 20}px`);
    hero.style.setProperty('--tilt-x', `${-y * 3}deg`);
    hero.style.setProperty('--tilt-y', `${x * 4}deg`);
    pointerFrame = 0;
  });
}, { passive: true });
hero.addEventListener('pointerleave', () => {
  cancelAnimationFrame(pointerFrame); pointerFrame = 0;
  ['--pointer-x', '--pointer-y', '--tilt-x', '--tilt-y'].forEach(key => hero.style.removeProperty(key));
});

const progress = document.querySelector('.reading-progress');
let scrollFrame = 0;
function updateProgress() {
  const length = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${length > 0 ? window.scrollY / length : 0})`;
  scrollFrame = 0;
}
window.addEventListener('scroll', () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateProgress);
}, { passive: true });
window.addEventListener('resize', updateProgress, { passive: true });
updateProgress();
