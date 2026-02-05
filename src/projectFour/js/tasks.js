const DIFFICULTY = {
  easy: { label: 'Легкая', xp: 10, badge: 'easy' },
  medium: { label: 'Средняя', xp: 25, badge: 'medium' },
  hard: { label: 'Сложная', xp: 50, badge: 'hard' },
  epic: { label: 'Эпическая', xp: 100, badge: 'epic' },
};

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

class Task {
  constructor({
    id,
    title,
    description,
    difficulty,
    xp,
    status,
    createdAt,
    completedAt,
  } = {}) {
    this.id = String(id ?? generateId());
    this.title = String(title ?? '').trim();
    this.description = String(description ?? '').trim();

    const diffKey = String(difficulty ?? 'easy');
    const diff = DIFFICULTY[diffKey] ?? DIFFICULTY.easy;

    this.difficulty = diffKey in DIFFICULTY ? diffKey : 'easy';
    this.xp = Number.isFinite(Number(xp)) ? Number(xp) : diff.xp;

    this.status = status === 'completed' ? 'completed' : 'active';
    this.createdAt = createdAt ? String(createdAt) : new Date().toISOString();
    this.completedAt = completedAt ? String(completedAt) : null;
  }

  getDifficultyLabel() {
    return (DIFFICULTY[this.difficulty] ?? DIFFICULTY.easy).label;
  }

  getDifficultyBadge() {
    return (DIFFICULTY[this.difficulty] ?? DIFFICULTY.easy).badge;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      difficulty: this.difficulty,
      xp: this.xp,
      status: this.status,
      createdAt: this.createdAt,
      completedAt: this.completedAt,
    };
  }

  static from(data) {
    return new Task(data);
  }
}

class TaskManager {
  constructor(tasks = []) {
    this.tasks = tasks.map((t) => Task.from(t));
  }

  addTask(task) {
    const newTask = task instanceof Task ? task : new Task(task);
    if (!newTask.title) throw new Error('Название задачи обязательно');
    this.tasks.unshift(newTask);
    return newTask;
  }

  removeTask(id) {
    const before = this.tasks.length;
    this.tasks = this.tasks.filter((t) => t.id !== id);
    return this.tasks.length !== before;
  }

  completeTask(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return null;
    if (task.status === 'completed') return task;
    task.status = 'completed';
    task.completedAt = new Date().toISOString();
    return task;
  }

  undoCompleteTask(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return null;
    if (task.status !== 'completed') return task;
    task.status = 'active';
    task.completedAt = null;
    return task;
  }

  getTasks() {
    return [...this.tasks];
  }

  getActiveTasks() {
    return this.tasks.filter((t) => t.status === 'active');
  }

  getCompletedTasks() {
    return this.tasks
      .filter((t) => t.status === 'completed')
      .sort((a, b) => (b.completedAt || '').localeCompare(a.completedAt || ''));
  }

  getCompletedCount() {
    return this.getCompletedTasks().length;
  }

  getTotalEarnedXp() {
    return this.getCompletedTasks().reduce((sum, t) => sum + (Number(t.xp) || 0), 0);
  }

  toJSON() {
    return this.tasks.map((t) => t.toJSON());
  }

  static load(data) {
    return new TaskManager(Array.isArray(data) ? data : []);
  }
}

function getDifficultyOptions() {
  return DIFFICULTY;
}

globalThis.Task = Task;
globalThis.TaskManager = TaskManager;
globalThis.getDifficultyOptions = getDifficultyOptions;
