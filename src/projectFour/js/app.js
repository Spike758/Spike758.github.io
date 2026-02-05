

const AVATAR_SRC = {
  warrior: './assets/images/avatar-warrior.svg',
  mage: './assets/images/avatar-mage.svg',
  rogue: './assets/images/avatar-rogue.svg',
  paladin: './assets/images/avatar-paladin.svg',
};

function $(selector) {
  return document.querySelector(selector);
}

function formatDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('ru-RU', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('ru-RU', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function showToast(title, body) {
  const toasts = $('#toasts');
  const toast = document.createElement('div');
  toast.className = 'rpg-toast';
  toast.innerHTML = `<div class="rpg-toast__title"></div><div class="rpg-toast__body"></div>`;
  toast.querySelector('.rpg-toast__title').textContent = title;
  toast.querySelector('.rpg-toast__body').textContent = body;
  toasts.appendChild(toast);

  window.setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(6px)';
    toast.style.transition = 'opacity 180ms ease, transform 180ms ease';
  }, 2200);

  window.setTimeout(() => {
    toast.remove();
  }, 2600);
}

function openModal() {
  $('#setupModal').classList.remove('hidden');
}

function closeModal() {
  $('#setupModal').classList.add('hidden');
  $('#setupMessage').textContent = '';
}

function anchorSmoothScrollInit() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a.js-anchor');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    if (!href.startsWith('#')) return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function renderCharacter(character) {
  $('#characterName').textContent = character?.name || '—';
  $('#characterLevel').textContent = String(character?.getLevel?.() ?? 1);
  $('#characterCreatedAt').textContent = character ? formatDate(character.createdAt) : '—';

  const avatarId = character?.avatarId || 'warrior';
  $('#characterAvatar').src = AVATAR_SRC[avatarId] || AVATAR_SRC.warrior;

  const xpIn = character?.getXpInLevel?.() ?? 0;
  const xpNext = character?.getXpToNext?.() ?? 100;
  const ratio = character?.getProgressRatio?.() ?? 0;

  $('#xpText').textContent = `${xpIn}/${xpNext} XP`;
  const fill = $('#xpFill');
  fill.style.width = `${Math.round(ratio * 100)}%`;

  const bar = document.querySelector('.rpg-xp__bar');
  bar.setAttribute('aria-valuemax', String(xpNext));
  bar.setAttribute('aria-valuenow', String(xpIn));
}

function taskNode(task) {
  const el = document.createElement('div');
  el.className = 'rpg-task';
  if (task.status === 'completed') el.classList.add('is-completed');
  el.dataset.id = task.id;

  const checked = task.status === 'completed' ? 'checked' : '';

  const desc = task.description ? `<div class="rpg-task__desc"></div>` : '';

  el.innerHTML = `
    <div class="rpg-task__actions">
      <input class="js-toggle" type="checkbox" ${checked} aria-label="Выполнено" />
    </div>
    <div class="rpg-task__main">
      <div class="rpg-task__title"></div>
      ${desc}
      <div class="rpg-task__meta">
        <span class="rpg-badge rpg-badge--${task.getDifficultyBadge()}" title="Сложность">${task.getDifficultyLabel()}</span>
        <span class="rpg-xpTag">+${task.xp} XP</span>
        ${task.status === 'completed' && task.completedAt ? `<span class="muted">${formatDateTime(task.completedAt)}</span>` : ''}
      </div>
    </div>
    <div class="rpg-task__actions">
      <button class="rpg-iconBtn js-delete" type="button" aria-label="Удалить">❌</button>
    </div>
  `;

  el.querySelector('.rpg-task__title').textContent = task.title;
  if (task.description) el.querySelector('.rpg-task__desc').textContent = task.description;

  return el;
}

function renderTasks(manager) {
  const active = manager.getActiveTasks();
  const completed = manager.getCompletedTasks();

  const activeRoot = $('#activeTasks');
  const completedRoot = $('#completedTasks');

  activeRoot.innerHTML = '';
  completedRoot.innerHTML = '';

  active.forEach((t) => activeRoot.appendChild(taskNode(t)));
  completed.forEach((t) => completedRoot.appendChild(taskNode(t)));

  $('#activeEmpty').classList.toggle('hidden', active.length !== 0);
  $('#completedEmpty').classList.toggle('hidden', completed.length !== 0);
}

function renderStats(character, manager) {
  $('#statCompleted').textContent = String(manager.getCompletedCount());
  $('#statTotalXp').textContent = String(manager.getTotalEarnedXp());
  $('#statCreatedAt').textContent = character ? formatDate(character.createdAt) : '—';

  const history = $('#history');
  history.innerHTML = '';

  const completed = manager.getCompletedTasks().slice(0, 12);
  if (completed.length === 0) {
    $('#historyEmpty').classList.remove('hidden');
    return;
  }
  $('#historyEmpty').classList.add('hidden');

  completed.forEach((t) => {
    const item = document.createElement('div');
    item.className = 'rpg-historyItem';
    item.innerHTML = `<strong></strong><div class="muted"></div>`;
    item.querySelector('strong').textContent = `${t.title} (+${t.xp} XP)`;
    item.querySelector('.muted').textContent = t.completedAt ? `Выполнено: ${formatDateTime(t.completedAt)}` : '';
    history.appendChild(item);
  });
}

function persist(character, manager) {
  Storage.save({ character: character ? character.save() : null, tasks: manager.toJSON() });
}

function init() {
  anchorSmoothScrollInit();

  const stored = Storage.load();
  let character = Character.load(stored.character);
  let manager = TaskManager.load(stored.tasks);

  if (!character || !character.name) {
    character = new Character({ name: '', avatarId: 'warrior', totalXp: 0 });
    openModal();
  }

  const computedTotalXp = manager.getTotalEarnedXp();
  if (character.totalXp !== computedTotalXp) character.totalXp = computedTotalXp;

  renderCharacter(character);
  renderTasks(manager);
  renderStats(character, manager);
  persist(character, manager);

  $('#openSetup').addEventListener('click', () => {
    $('#setupName').value = character.name || '';
    const radio = document.querySelector(`#avatarChoices input[value="${character.avatarId}"]`);
    if (radio) radio.checked = true;
    openModal();
  });

  $('#closeSetup').addEventListener('click', () => closeModal());
  $('#setupModal').addEventListener('click', (e) => {
    const close = e.target?.dataset?.close === 'true';
    if (close) closeModal();
  });

  $('#setupForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = $('#setupName').value.trim();
    const avatarId = document.querySelector('#avatarChoices input[name="avatar"]:checked')?.value || 'warrior';

    if (!name) {
      $('#setupMessage').textContent = 'Введите имя героя.';
      return;
    }

    character.name = name;
    character.avatarId = avatarId;
    if (!character.createdAt) character.createdAt = new Date().toISOString();

    renderCharacter(character);
    renderStats(character, manager);
    persist(character, manager);

    showToast('Герой создан', `Добро пожаловать, ${character.name}!`);
    closeModal();
  });

  $('#taskForm').addEventListener('submit', (e) => {
    e.preventDefault();
    $('#taskFormMessage').textContent = '';

    const title = $('#taskTitle').value.trim();
    const description = $('#taskDescription').value.trim();
    const difficulty = document.querySelector('input[name="difficulty"]:checked')?.value || 'easy';

    if (!title) {
      $('#taskFormMessage').textContent = 'Название задачи обязательно.';
      return;
    }

    try {
      manager.addTask({ title, description, difficulty });
      $('#taskTitle').value = '';
      $('#taskDescription').value = '';

      renderTasks(manager);
      renderStats(character, manager);
      persist(character, manager);

      showToast('Задача добавлена', `Квест: ${title}`);
    } catch (err) {
      $('#taskFormMessage').textContent = err?.message || 'Не удалось добавить задачу.';
    }
  });

  document.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.js-delete');
    if (!deleteBtn) return;

    const card = deleteBtn.closest('.rpg-task');
    if (!card) return;

    const id = card.dataset.id;

    const task = manager.getTasks().find((t) => t.id === id);
    const wasCompleted = task?.status === 'completed';
    const xp = Number(task?.xp) || 0;

    card.classList.add('is-removing');
    window.setTimeout(() => {
      manager.removeTask(id);
      if (wasCompleted) {
        character.removeExperience(xp);
        character.totalXp = manager.getTotalEarnedXp();
      }

      renderCharacter(character);
      renderTasks(manager);
      renderStats(character, manager);
      persist(character, manager);
    }, 220);
  });

  document.addEventListener('change', (e) => {
    const toggle = e.target.closest('.js-toggle');
    if (!toggle) return;

    const card = toggle.closest('.rpg-task');
    if (!card) return;
    const id = card.dataset.id;

    if (toggle.checked) {
      const task = manager.completeTask(id);
      if (!task) return;

      const result = character.addExperience(task.xp);
      character.totalXp = manager.getTotalEarnedXp();

      renderCharacter(character);
      renderTasks(manager);
      renderStats(character, manager);
      persist(character, manager);

      showToast('XP получено', `+${task.xp} XP за «${task.title}»`);

      if (result.leveledUp) {
        $('#characterCard').classList.remove('rpg-levelupFlash');
        void $('#characterCard').offsetWidth;
        $('#characterCard').classList.add('rpg-levelupFlash');
        showToast('Level Up!', `Новый уровень: ${character.getLevel()}`);
      }
    } else {
      const task = manager.undoCompleteTask(id);
      if (!task) return;

      character.totalXp = manager.getTotalEarnedXp();

      renderCharacter(character);
      renderTasks(manager);
      renderStats(character, manager);
      persist(character, manager);

      showToast('Отменено', `Задача снова активна: «${task.title}»`);
    }
  });

  $('#resetProgress').addEventListener('click', () => {
    const ok = window.confirm('Сбросить прогресс героя и удалить все задачи?');
    if (!ok) return;

    Storage.clear();
    character = new Character({ name: '', avatarId: 'warrior', totalXp: 0 });
    manager = new TaskManager([]);

    renderCharacter(character);
    renderTasks(manager);
    renderStats(character, manager);

    openModal();
    showToast('Прогресс сброшен', 'Можно начать заново.');
  });
}

document.addEventListener('DOMContentLoaded', init);
