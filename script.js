const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#site-nav');

menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();

async function loadAvailability() {
  const label = document.querySelector('#availability-label');
  if (!label) return;

  try {
    const response = await fetch('/api/availability', {
      headers: { Accept: 'application/json' },
      cache: 'no-store'
    });
    if (!response.ok) return;
    const data = await response.json();
    if (data.month && data.year) {
      label.textContent = `Currently booking for ${data.month} ${data.year}`;
    }
  } catch {
    // Keep the published fallback when the service is unavailable.
  }
}

loadAvailability();

document.querySelector('#enquiry-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const message = [
    'Hi Mandy, I would like to ask about automatic driving lessons.',
    '',
    `Name: ${data.get('name')}`,
    `Area: ${data.get('area')}`,
    `Experience: ${data.get('experience')}`
  ].join('\n');
  window.open(`https://wa.me/447449374221?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});
