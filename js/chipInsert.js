import { chips, assistBox, taskInput } from './domRefs.js';

export function setupChipInsertion() {
  customElements.whenDefined('md-outlined-text-field').then(() => {
    requestAnimationFrame(() => {
      const inputEl = taskInput.shadowRoot.querySelector('input');

      chips.forEach(chip => {
        chip.addEventListener('click', () => {
          let value = chip.textContent.trim();
          const today = new Date();

          if (value === 'YYYYMMDD') {
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            value = `${yyyy}${mm}${dd}`;
          } else if (value === 'MMDD') {
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            value = `${mm}${dd}`;
          }

          const cursorPos = inputEl.selectionStart;
          const text = inputEl.value;
          const newText = text.slice(0, cursorPos) + value + text.slice(cursorPos);
          inputEl.value = newText;
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
