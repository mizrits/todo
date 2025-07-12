import {
  assistBox,
  taskInput,
  addButton,
  tagSelectButton,
  tagDialog,
  archivedToggle,
  sortSelect,
  configDialog,
  configOpenButton,
  configSaveButton,
  configResetButton,
  configInput,
  getScriptURL,
  setScriptURL
} from './domRefs.js';

import { setupAssistBox } from './assistBox.js';
import { setupChipInsertion } from './chipInsert.js';
import { setupTagDialog, getSelectedTags, getDetail } from './tagDialog.js';
import { setupArchiveToggle, addTask, loadTasks } from './taskHandlers.js';

// 初期化処理
setupAssistBox();
setupChipInsertion();
setupArchiveToggle(archivedToggle);
setupTagDialog();

// タグ選択ダイアログ
tagSelectButton.addEventListener('click', () => tagDialog.show());
document.getElementById('closeTagDialog').addEventListener('click', () => tagDialog.close());

// タスク追加
addButton.addEventListener('click', async () => {
  const task = taskInput.value.trim();
  if (!task) return;
  const tags = getSelectedTags();
  const detail = getDetail();
  await addTask(task, tags, detail);
  tagDialog.close();
});

// 並び順変更
sortSelect.addEventListener('input', () => loadTasks());

// GAS URL設定ダイアログ
configOpenButton.addEventListener('click', () => {
  configInput.value = getScriptURL() || '';
  configDialog.show();
});

configSaveButton.addEventListener('click', () => {
  const url = configInput.value.trim();
  if (url) {
    setScriptURL(url);
    configDialog.close();
    //allTaskData = null;
    location.reload()
    //loadTasks();
  }
});

configResetButton.addEventListener('click', () => {
  localStorage.removeItem('gasScriptURL');
  configInput.value = '';
  configDialog.close();
  location.reload();
  //loadTasks();
});

window.addEventListener('DOMContentLoaded', loadTasks);
