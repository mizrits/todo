import { tagDialog } from './domRefs.js';

let detailValue = '';
 const TAG_OPTIONS = [
  { label: '重要', id: 'tagImportant', value: '重要' },
  { label: '日常', id: 'tagDaily', value: '日常' },
  { label: '緊急', id: 'tagUrgent', value: '緊急' },
  { label: '私用', id: 'tagPersonal', value: '私用' }
];

function renderTagCheckboxes() {
  const container = document.getElementById('tagCheckboxContainer');
  container.innerHTML = ''; // 前のチェックボックスを削除

  TAG_OPTIONS.forEach(opt => {
    const wrapper = document.createElement('label');
    wrapper.className = 'taglabel';

    const cb = document.createElement('md-checkbox');
    cb.setAttribute('name', 'tag');
    cb.setAttribute('value', opt.value);
    cb.setAttribute('id', opt.id);
    cb.setAttribute('touch-target', 'wrapper');
    cb.innerHTML = opt.label;

    cb.checked = false;

    wrapper.appendChild(cb);
    wrapper.appendChild(document.createTextNode(opt.label));
    container.appendChild(wrapper);
  });
}
// タグダイアログ
export function setupTagDialog() {
  customElements.whenDefined('md-dialog').then(() => {
    renderTagCheckboxes(); // ← ここで初回描画

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
  if (document.getElementById('tagImportant').checked) tags.push('重要');
  if (document.getElementById('tagDaily').checked) tags.push('日常');
  if (document.getElementById('tagUrgent').checked) tags.push('緊急');
  if (document.getElementById('tagPersonal').checked) tags.push('私用');
  return tags;
}

export function getDetail() {
  return detailValue;
}

export function clearSelectedTagsAndDetail() {
  const checkboxes = tagDialog.querySelectorAll('md-checkbox[name="tag"]');
  checkboxes.forEach(cb => (cb.checked = false));

  const detailInput = document.getElementById('detailInput');
  if (detailInput) {
    detailInput.value = '';
    detailValue = '';
  }
}
