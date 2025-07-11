import { tagDialog } from './domRefs.js';

// ユーザーが選択したタグを管理するSet
const selectedTags = new Set();

// タグチェックボックスを初期化してイベント設定する関数
export function setupTagDialog() {
  // md-dialogが定義されてから処理
  customElements.whenDefined('md-dialog').then(() => {
    const checkboxes = tagDialog.querySelectorAll('md-checkbox[name="tag"]');
    checkboxes.forEach(cb => {
      // 初期値は空（すべて未選択）にしておく
      cb.checked = false;
      cb.addEventListener('change', () => {
        if (cb.checked) {
          selectedTags.add(cb.value);
        } else {
          selectedTags.delete(cb.value);
        }
      });
    });
  });
}

// 選択中のタグ配列を取得する関数
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


// 選択タグをクリアしてダイアログのチェックもリセットする関数（必要に応じて呼ぶ）
export function clearSelectedTags() {
  selectedTags.clear();
  const checkboxes = tagDialog.querySelectorAll('md-checkbox[name="tag"]');
  checkboxes.forEach(cb => (cb.checked = false));
}
