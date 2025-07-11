import {
  scriptURL, taskList, archivedList,
  archivedSectionWrapper, taskInput
} from './domRefs.js';
import { setInputEnabled, triggerSplash } from './ui.js';

let archivedOpen = false;
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
  showSkeletonLoader();
  try {
    const res = await fetch(`${scriptURL}?method=list`);
    const data = await res.json();

    taskList.innerHTML = '';
    archivedList.innerHTML = '';
    archivedSectionWrapper.style.display = '';
    archivedList.style.maxHeight = archivedOpen ? archivedList.scrollHeight + 'px' : '0';

data.active.forEach(taskObj => {
  const div = document.createElement('div');
  div.className = 'task';

  // タスク名
  const span = document.createElement('span');
  span.textContent = taskObj.task;
  div.appendChild(span);

  // タグ（Material Chips）
  if (taskObj.tags && taskObj.tags.length > 0) {
    const tagContainer = document.createElement('div');
    tagContainer.style.display = 'inline-flex';
    tagContainer.style.gap = '6px';
    tagContainer.style.marginLeft = '12px';

    taskObj.tags.forEach(tag => {
      const chip = document.createElement('md-assist-chip');
      chip.setAttribute('label', tag);
      tagContainer.appendChild(chip);
    });

    div.appendChild(tagContainer);
  }

  // 完了ボタン
  const checkBtn = document.createElement('md-fab');
  checkBtn.className = 'check-button';
  checkBtn.setAttribute('aria-label', '完了');
  checkBtn.innerHTML = '<md-icon slot="icon">task_alt</md-icon>';
  checkBtn.addEventListener('click', (e) => {
    triggerSplash(e);
    div.classList.add('fade-out');
    div.addEventListener('transitionend', async () => {
      await archiveTask(taskObj.task);
    }, { once: true });
  });

  div.appendChild(checkBtn);
  taskList.appendChild(div);
});

    // アーカイブ済みタスク表示
    data.archived.forEach(taskObj => {
      const div = document.createElement('div');
      div.className = 'taskArchived';

      // タスク名
      const span = document.createElement('span');
      span.textContent = taskObj.task;

      // タグ表示
      if (taskObj.tags && taskObj.tags.length > 0) {
        const tagSpan = document.createElement('span');
        tagSpan.textContent = '[' + taskObj.tags.join(', ') + ']';
        tagSpan.style.marginLeft = '8px';
        tagSpan.style.color = '#555';
        div.appendChild(tagSpan);
      }

      // アイコン操作欄
      const iconRow = document.createElement('div');
      iconRow.className = 'icon-row';

      // 復元ボタン
      const restoreBtn = document.createElement('md-outlined-icon-button');
      restoreBtn.className = 'restore-button';
      restoreBtn.setAttribute('aria-label', '復元');
      restoreBtn.innerHTML = '<md-icon>undo</md-icon>';
      restoreBtn.addEventListener('click', async () => {
        await restoreTask(taskObj.task);
      });

      // 削除ボタン
      const deleteBtn = document.createElement('md-outlined-icon-button');
      deleteBtn.className = 'delete-button';
      deleteBtn.setAttribute('aria-label', '削除');
      deleteBtn.innerHTML = '<md-icon>delete</md-icon>';
      deleteBtn.addEventListener('click', (e) => {
        div.classList.add('fade-out');
        div.addEventListener('transitionend', async () => {
          await deleteTask(taskObj.task);
        }, { once: true });
      });

      iconRow.appendChild(restoreBtn);
      iconRow.appendChild(deleteBtn);
      div.appendChild(span);
      div.appendChild(iconRow);
      archivedList.appendChild(div);
    });
  } catch (err) {
    taskList.innerHTML = '読み込みに失敗しました';
    console.error(err);
  }
}

export async function addTask(task, tags = []) {
  if (!task) return;
  setInputEnabled(false);

  try {
const params = new URLSearchParams({
  method: 'add',
  task,
  tags: tags.join(',')
});

    const res = await fetch(`${scriptURL}?${params.toString()}`);
    const json = await res.json();

    if (json.status === 'error' && json.message === 'duplicate') {
      alert('同じタスクが既に存在します');
    } else {
      document.getElementById('taskInput').value = '';
      await loadTasks();
    }
  } catch (err) {
    console.error('追加失敗', err);
  } finally {
    setInputEnabled(true);
  }
}


export async function archiveTask(task) {
  await fetch(`${scriptURL}?method=archive&task=${encodeURIComponent(task)}`);
  await loadTasks();
}

export async function restoreTask(task) {
  await fetch(`${scriptURL}?method=restore&task=${encodeURIComponent(task)}`);
  await loadTasks();
}

export async function deleteTask(task) {
  await fetch(`${scriptURL}?method=delete&task=${encodeURIComponent(task)}`);
  await loadTasks();
}
