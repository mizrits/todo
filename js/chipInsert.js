import { assistBox, taskInput, chips } from './domRefs.js';

export function setupChipInsertion() {
  customElements.whenDefined('md-outlined-text-field').then(() => {
    requestAnimationFrame(() => {
      const inputEl = taskInput.shadowRoot.querySelector('input');
      chips.forEach(chip => {
        chip.addEventListener('click', () => {
          let value = chip.textContent.trim();
          const today = new Date();
          if (value === 'YYYYMMDD') {
            value = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
          } else if (value === 'MMDD') {
            value = `${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
          }
          const cursorPos = inputEl.selectionStart;
          const text = inputEl.value;
          inputEl.value = text.slice(0, cursorPos) + value + text.slice(cursorPos);
          inputEl.setSelectionRange(cursorPos + value.length, cursorPos + value.length);
          taskInput.value = inputEl.value;
          assistBox.classList.remove('visible');
          setTimeout(() => {
            if (!assistBox.classList.contains('visible')) {
              assistBox.style.visibility = 'hidden';
            }
          }, 500);
        });
      });
    });
  });
}
