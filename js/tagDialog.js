import { tagDialog } from './domRefs.js';

const selectedTags = new Set();
let detailValue = ''; // 詳細入力値

export function setupTagDialog() {
  customElements.whenDefined('md-dialog').then(() => {
    const checkboxes = tagDialog.querySelectorAll('md-checkbox[name="tag"]');
    checkboxes.forEach(cb => {
      cb.checked = false;
      cb.addEventListener('change', () => {
        if (cb.checked) {
          selectedTags.add(cb.value);
        } else {
          selectedTags.delete(cb.value);
        }
      });
    });

    const detailInput = document.getElementById('detailInput');
    if (detailInput) {
      detailInput.value = '';
      detailInput.addEventListener('input', () => {
        detailValue = detailInput.value.trim();
      });
    }
  });
}

export function getSelectedTags() {
  const tags = [];
  if (document.getElementById('tagImportant').checked) {
    tags.push('重要');
  }
  if (document.getElementById('tagDaily').checked) {
    tags.push('日常');
  }
  if (document.getElementById('tagUrgent').checked) {
    tags.push('緊急');
  }
  if (document.getElementById('tagPersonal').checked) {
    tags.push('私用');
  }
  return tags;
}


export function getDetail() {
  return detailValue;
}

export function clearSelectedTagsAndDetail() {
  selectedTags.clear();
  const checkboxes = tagDialog.querySelectorAll('md-checkbox[name="tag"]');
  checkboxes.forEach(cb => (cb.checked = false));

  const detailInput = document.getElementById('detailInput');
  if (detailInput) {
    detailInput.value = '';
    detailValue = '';
  }
}
