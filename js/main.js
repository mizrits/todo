import {
  addButton,
  archivedToggle,
  tagDialog,
  tagSelectButton,
} from './domRefs.js';

import { setupAssistBox } from './assistBox.js';
import { setupChipInsertion } from './chipInsert.js';
import { setupArchiveToggle, addTask, loadTasks } from './taskHandlers.js';
import {
  setupTagDialog,
  getSelectedTags,
  getDetail,
} from './tagDialog.js';

setupAssistBox();
setupChipInsertion();
setupArchiveToggle(archivedToggle);
setupTagDialog();

// 「その他」ボタン（旧タグ選択ボタン）押下 → ダイアログ表示
tagSelectButton.addEventListener('click', () => {
  tagDialog.show();
});

// ダイアログの「閉じる」ボタンは保存も兼ねている
const closeTagDialogButton = document.getElementById('closeTagDialog');
closeTagDialogButton.addEventListener('click', () => {
  tagDialog.close();
});

// 「追加」ボタン押下 → タスク・タグ・詳細をまとめて送信
addButton.addEventListener('click', async () => {
  const task = document.getElementById('taskInput').value.trim();
  if (!task) return;

  const tags = getSelectedTags();
  const detail = getDetail();

  await addTask(task, tags, detail);
  tagDialog.close();
});

window.addEventListener('DOMContentLoaded', loadTasks);

const sortSelect = document.getElementById('sortSelect');
sortSelect.addEventListener('input', () => {
  loadTasks(); // 並び替え基準が変わったら再描画
});