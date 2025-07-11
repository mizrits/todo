import { addButton, taskInput } from './domRefs.js';

export function setInputEnabled(enabled) {
  addButton.disabled = !enabled;
  taskInput.disabled = !enabled;
}

export function triggerSplash(event) {
  const btn = event.currentTarget;
  const rect = btn.getBoundingClientRect();
  const offsetX = -4;
  const offsetY = -7;
  const originX = rect.left + rect.width / 2 + offsetX;
  const originY = rect.top + rect.height / 2 + offsetY;
  const container = document.querySelector('.splash-container');
  const count = 30;

  for (let i = 0; i < count; i++) {
    const splash = document.createElement('div');
    splash.className = 'splash';
    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 60;
    const dx = Math.cos(angle) * distance + 'px';
    const dy = Math.sin(angle) * distance + 'px';
    const size = 5 + Math.random() * 8;
    splash.style.width = `${size}px`;
    splash.style.height = `${size}px`;
    splash.style.left = `${originX}px`;
    splash.style.top = `${originY}px`;
    splash.style.setProperty('--dx', dx);
    splash.style.setProperty('--dy', dy);
    container.appendChild(splash);
    setTimeout(() => splash.remove(), 1000);
  }
}
