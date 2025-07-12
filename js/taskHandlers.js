import {
  taskList, archivedList, archivedSectionWrapper,
  taskInput,
  getScriptURL
} from './domRefs.js';
import { setInputEnabled, triggerSplash } from './ui.js';
import { clearSelectedTagsAndDetail } from './tagDialog.js';

let archivedOpen = false;
let allTaskData = null; // フロントキャッシュ

export function setupArchiveToggle(archivedToggle) {
  archivedToggle.addEventListener('click', () => {
    archivedOpen = !archivedOpen;
    archivedList.style.maxHeight = archivedOpen ? archivedList.scrollHeight + 'px' : '0';
  });
}

export function showSkeletonLoader(count = 5) {
  taskList.innerHTML = '';
  archivedList.innerHTML = '';
  archivedSectionWrapper.style.display = 'none';
  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton';
    taskList.appendChild(skeleton);
  }
}

export async function loadTasks() {
  const scriptURL = getScriptURL();
  if (!scriptURL) {
    taskList.innerHTML = `
      <div style="padding: 1em; display: flex; align-items: center; gap: 0.5em;">
       <md-icon>report</md-icon>GASのURLが未設定です
      </div>
    `;
    setInputEnabled(false);
    return;
  }
  showSkeletonLoader();
  try {
    if (!allTaskData) {
      const res = await fetch(`${scriptURL}?method=list`);
      allTaskData = await res.json();
    }

    const sortOrder = document.getElementById('sortSelect')?.value || 'new';
    const activeTasks = [...allTaskData.active];
    if (sortOrder !== 'old') activeTasks.reverse();

    taskList.innerHTML = '';
    archivedList.innerHTML = '';
    archivedSectionWrapper.style.display = '';
    archivedList.style.maxHeight = archivedOpen ? archivedList.scrollHeight + 'px' : '0';

    activeTasks.forEach(taskObj => {
      const div = document.createElement('div');
      div.className = 'list-item';

      // タスク名
      const title = document.createElement('div');
      title.className = 'list-item-title';
      title.textContent = taskObj.task;

      // タグ & 完了ボタンを横並び
      const rightRow = document.createElement('div');
      rightRow.style.display = 'inline-flex';
      rightRow.style.alignItems = 'center';
      rightRow.style.gap = '8px';
      rightRow.style.marginLeft = '12px';

      // タグ一覧
      taskObj.tags?.forEach(tag => {
        const chip = document.createElement('md-assist-chip');
        chip.setAttribute('label', tag);
        chip.classList.add('taglabel');
        rightRow.appendChild(chip);
      });

      // 完了ボタン
      const checkBtn = document.createElement('md-fab');
      checkBtn.className = 'check-button';
      checkBtn.setAttribute('aria-label', '完了');
      checkBtn.innerHTML = '<md-icon slot="icon">task_alt</md-icon>';
      checkBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerSplash(e);
        div.classList.add('fade-out');
        div.addEventListener('transitionend', async () => {
          await archiveTask(taskObj.task);
          allTaskData = null;
          await loadTasks();
        }, { once: true });
      });
      rightRow.appendChild(checkBtn);

      const topRow = document.createElement('div');
      topRow.style.display = 'flex';
      topRow.style.justifyContent = 'space-between';
      topRow.style.alignItems = 'center';
      topRow.appendChild(title);
      topRow.appendChild(rightRow);
      div.appendChild(topRow);

      const detail = document.createElement('div');
      detail.className = 'list-item-details';
      detail.textContent = taskObj.detail || '';
      div.appendChild(detail);

      taskList.appendChild(div);
    });

    allTaskData.archived.forEach(taskObj => {
      const div = document.createElement('div');
      div.className = 'taskArchived';

      const span = document.createElement('span');
      span.textContent = taskObj.task;

      if (taskObj.tags?.length) {
        const tagSpan = document.createElement('span');
        tagSpan.textContent = '[' + taskObj.tags.join(', ') + ']';
        tagSpan.style.marginLeft = '8px';
        tagSpan.style.color = '#555';
        div.appendChild(tagSpan);
      }

      const iconRow = document.createElement('div');
      iconRow.className = 'icon-row';

      const restoreBtn = document.createElement('md-outlined-icon-button');
      restoreBtn.className = 'restore-button';
      restoreBtn.setAttribute('aria-label', '復元');
      restoreBtn.innerHTML = '<md-icon>undo</md-icon>';
      restoreBtn.addEventListener('click', async () => {
        await restoreTask(taskObj.task);
        allTaskData = null;
        await loadTasks();
      });

      const deleteBtn = document.createElement('md-outlined-icon-button');
      deleteBtn.className = 'delete-button';
      deleteBtn.setAttribute('aria-label', '削除');
      deleteBtn.innerHTML = '<md-icon>delete</md-icon>';
      deleteBtn.addEventListener('click', (e) => {
        div.classList.add('fade-out');
        div.addEventListener('transitionend', async () => {
          await deleteTask(taskObj.task);
          allTaskData = null;
          await loadTasks();
        }, { once: true });
      });

      iconRow.appendChild(restoreBtn);
      iconRow.appendChild(deleteBtn);
      div.appendChild(span);
      div.appendChild(iconRow);
      archivedList.appendChild(div);
    });

    document.querySelectorAll('.list-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('.check-button')) return;
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.list-item.open').forEach(i => i.classList.remove('open'));
        item.classList.toggle('open', !isOpen);
      });
    });
    setInputEnabled(true);
  } catch (err) {
    taskList.innerHTML = '読み込みに失敗しました';
    console.error(err);
  }
}

export async function addTask(task, tags = [], detail = '') {
  const scriptURL = getScriptURL();
  if (!task || !scriptURL) return;
  setInputEnabled(false);
  try {
    const params = new URLSearchParams({ method: 'add', task, tags: tags.join(','), detail });
    const res = await fetch(`${scriptURL}?${params.toString()}`);
    const json = await res.json();
    if (json.status === 'error' && json.message === 'duplicate') {
      alert('同じタスクが既に存在します');
    } else {
      taskInput.value = '';
      clearSelectedTagsAndDetail();
      allTaskData = null;
      await loadTasks();
    }
  } catch (err) {
    console.error('追加失敗', err);
  } finally {
    setInputEnabled(true);
  }
}

export async function archiveTask(task) {
  const scriptURL = getScriptURL();
  await fetch(`${scriptURL}?method=archive&task=${encodeURIComponent(task)}`);
  await loadTasks();
}

export async function restoreTask(task) {
  const scriptURL = getScriptURL();
  await fetch(`${scriptURL}?method=restore&task=${encodeURIComponent(task)}`);
  await loadTasks();
}

export async function deleteTask(task) {
  const scriptURL = getScriptURL();
  await fetch(`${scriptURL}?method=delete&task=${encodeURIComponent(task)}`);
  await loadTasks();
}
