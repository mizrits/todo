import {
  addButton,
  archivedToggle,
  tagDialog,
  tagSelectButton,
} from './domRefs.js';

import { setupAssistBox } from './assistBox.js';
import { setupChipInsertion } from './chipInsert.js';
import { setupArchiveToggle, addTask, loadTasks } from './taskHandlers.js';
import { setupTagDialog, getSelectedTags } from './tagDialog.js';

setupAssistBox();
setupChipInsertion();
setupArchiveToggle(archivedToggle);
setupTagDialog();

// タグ選択ボタン押下でダイアログ表示
tagSelectButton.addEventListener('click', () => {
  tagDialog.show();
});
const closeTagDialogButton = document.getElementById('closeTagDialog');
closeTagDialogButton.addEventListener('click', () => {
  tagDialog.close();
});
// 追加ボタン押下でタグも含めてタスク追加
addButton.addEventListener('click', async () => {
  const task = document.getElementById('taskInput').value.trim();
  if (!task) return;
  const tags = getSelectedTags();
  await addTask(task, tags);
  tagDialog.close();
});

window.addEventListener('DOMContentLoaded', loadTasks);
