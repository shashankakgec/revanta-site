const dialog = document.querySelector('#login-dialog');
const openButtons = [document.querySelector('#admin-open'), document.querySelector('#admin-open-footer')];
const form = document.querySelector('#login-form');
const message = document.querySelector('#form-message');
const nav = document.querySelector('.nav');
const menuToggle = document.querySelector('#menu-toggle');
document.querySelector('#year').textContent = new Date().getFullYear();

for (const button of openButtons) {
  button?.addEventListener('click', () => {
    message.textContent = '';
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  });
}

menuToggle?.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  nav.classList.toggle('open', !expanded);
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  message.textContent = 'Admin authentication is not connected yet. This form does not sign you in.';
  message.style.color = '#ffd3a4';
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}
