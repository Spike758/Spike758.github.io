function clampNumber(value, min, max) {
  const num = Number(value);
  if (!Number.isFinite(num)) return min;
  return Math.min(max, Math.max(min, num));
}

function cumulativeXpToReachLevel(level) {
  if (level <= 1) return 0;
  return 50 * (level - 1) * level;
}

function levelFromTotalXp(totalXp) {
  const xp = Math.max(0, Math.floor(totalXp));
  const nApprox = Math.floor((Math.sqrt(1 + (4 * xp) / 50) - 1) / 2);
  let level = nApprox + 1;

  while (cumulativeXpToReachLevel(level + 1) <= xp) level += 1;
  while (cumulativeXpToReachLevel(level) > xp) level -= 1;

  const xpInLevel = xp - cumulativeXpToReachLevel(level);
  const xpToNext = 100 * level;

  return { level, xpInLevel, xpToNext };
}

class Character {
  constructor({ name, avatarId, createdAt, totalXp } = {}) {
    this.name = String(name ?? '').trim();
    this.avatarId = String(avatarId ?? 'warrior');
    this.createdAt = createdAt ? String(createdAt) : new Date().toISOString();
    this.totalXp = clampNumber(totalXp ?? 0, 0, Number.MAX_SAFE_INTEGER);
  }

  getExperienceToNextLevel() {
    return 100 * this.getLevel();
  }

  getLevel() {
    return levelFromTotalXp(this.totalXp).level;
  }

  getXpInLevel() {
    return levelFromTotalXp(this.totalXp).xpInLevel;
  }

  getXpToNext() {
    return levelFromTotalXp(this.totalXp).xpToNext;
  }

  getProgressRatio() {
    const { xpInLevel, xpToNext } = levelFromTotalXp(this.totalXp);
    if (xpToNext <= 0) return 0;
    return Math.min(1, Math.max(0, xpInLevel / xpToNext));
  }

  addExperience(amount) {
    const delta = Math.max(0, Math.floor(Number(amount) || 0));
    const oldLevel = this.getLevel();
    this.totalXp = Math.min(Number.MAX_SAFE_INTEGER, this.totalXp + delta);
    const newLevel = this.getLevel();

    return {
      gained: delta,
      leveledUp: newLevel > oldLevel,
      oldLevel,
      newLevel,
    };
  }

  removeExperience(amount) {
    const delta = Math.max(0, Math.floor(Number(amount) || 0));
    const oldLevel = this.getLevel();
    this.totalXp = Math.max(0, this.totalXp - delta);
    const newLevel = this.getLevel();

    return {
      removed: delta,
      leveledDown: newLevel < oldLevel,
      oldLevel,
      newLevel,
    };
  }

  levelUp() {
    return this.getLevel();
  }

  toJSON() {
    return {
      name: this.name,
      avatarId: this.avatarId,
      createdAt: this.createdAt,
      totalXp: this.totalXp,
    };
  }

  static load(data) {
    if (!data) return null;
    return new Character({
      name: data.name,
      avatarId: data.avatarId,
      createdAt: data.createdAt,
      totalXp: data.totalXp,
    });
  }

  save() {
    return this.toJSON();
  }
}

globalThis.Character = Character;
