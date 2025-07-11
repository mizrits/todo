import {
  addButton,
  archivedToggle
} from './domRefs.js';
import { setupAssistBox } from './assistBox.js';
import { setupChipInsertion } from './chipInsert.js';
import {
  setupArchiveToggle,
  addTask,
  loadTasks
} from './taskHandlers.js';

setupAssistBox();
setupChipInsertion();
setupArchiveToggle(archivedToggle);

addButton.addEventListener('click', addTask);
window.addEventListener('DOMContentLoaded', loadTasks);
