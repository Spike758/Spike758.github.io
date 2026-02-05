const STORAGE_KEY = 'rpgTaskManager:v1';

function safeJsonParse(raw, fallback) {
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

const Storage = {
  load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { character: null, tasks: [] };
    const data = safeJsonParse(raw, { character: null, tasks: [] });
    return {
      character: data?.character ?? null,
      tasks: Array.isArray(data?.tasks) ? data.tasks : [],
    };
  },

  save({ character, tasks }) {
    const payload = {
      character: character ?? null,
      tasks: Array.isArray(tasks) ? tasks : [],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  },

  clear() {
    localStorage.removeItem(STORAGE_KEY);
  },
};

globalThis.Storage = Storage;
