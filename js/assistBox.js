import { assistBox, taskInput } from './domRefs.js';

export function setupAssistBox() {
  customElements.whenDefined('md-outlined-text-field').then(() => {
    requestAnimationFrame(() => {
      const inputEl = taskInput.shadowRoot.querySelector('input');
      inputEl.addEventListener('focus', () => {
        assistBox.classList.add('visible');
        assistBox.style.visibility = 'visible';
      });
      inputEl.addEventListener('blur', () => {
        setTimeout(() => {
          assistBox.classList.remove('visible');
          setTimeout(() => {
            if (!assistBox.classList.contains('visible')) {
              assistBox.style.visibility = 'hidden';
            }
          }, 500);
        }, 500);
      });
    });
  });
}
