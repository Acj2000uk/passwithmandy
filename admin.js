const loginPanel = document.querySelector('#login-panel');
const editorPanel = document.querySelector('#editor-panel');
const loginForm = document.querySelector('#login-form');
const availabilityForm = document.querySelector('#availability-form');
const loginMessage = document.querySelector('#login-message');
const saveMessage = document.querySelector('#save-message');
const currentValue = document.querySelector('#current-value');
const monthSelect = document.querySelector('#month');
const yearSelect = document.querySelector('#booking-year');
let adminPassword = '';

const currentYear = new Date().getFullYear();
for (let year = currentYear; year <= currentYear + 4; year += 1) {
  const option = document.createElement('option');
  option.value = String(year);
  option.textContent = String(year);
  if (year === 2026) option.selected = true;
  yearSelect.append(option);
}

function setMessage(element, text, type = '') {
  element.textContent = text;
  element.className = `admin-message ${type}`.trim();
}

async function callAvailability(body) {
  return fetch('/api/availability', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

async function loadCurrent() {
  const response = await fetch('/api/availability', { cache: 'no-store' });
  if (!response.ok) return;
  const data = await response.json();
  if (data.month && data.year) {
    currentValue.textContent = `${data.month} ${data.year}`;
    monthSelect.value = data.month;
    yearSelect.value = String(data.year);
  }
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const password = new FormData(loginForm).get('password');
  setMessage(loginMessage, 'Checking password...');

  try {
    const response = await callAvailability({ action: 'verify', password });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setMessage(loginMessage, data.error || 'Unable to sign in.', 'error');
      return;
    }
    adminPassword = password;
    loginForm.reset();
    loginPanel.hidden = true;
    editorPanel.hidden = false;
    await loadCurrent();
  } catch {
    setMessage(loginMessage, 'Unable to reach the website service. Try again.', 'error');
  }
});

availabilityForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage(saveMessage, 'Saving...');

  try {
    const response = await callAvailability({
      action: 'update',
      password: adminPassword,
      month: monthSelect.value,
      year: Number(yearSelect.value)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(saveMessage, data.error || 'The update failed. Sign in again.', 'error');
      return;
    }
    currentValue.textContent = `${data.month} ${data.year}`;
    setMessage(saveMessage, 'Availability updated.', 'success');
  } catch {
    setMessage(saveMessage, 'Unable to save. Try again.', 'error');
  }
});

document.querySelector('#logout-button').addEventListener('click', () => {
  adminPassword = '';
  editorPanel.hidden = true;
  loginPanel.hidden = false;
  setMessage(loginMessage, '');
  setMessage(saveMessage, '');
  document.querySelector('#password').focus();
});
