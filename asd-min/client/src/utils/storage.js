// LocalStorage utilities for persistent settings, stats, and match history

const SETTINGS_KEY = 'grandmaster_chess_settings';
const STATS_KEY = 'grandmaster_chess_stats';
const RECENT_GAMES_KEY = 'grandmaster_chess_recent_games';
const PUZZLE_STATS_KEY = 'grandmaster_chess_puzzles';

const DEFAULT_SETTINGS = {
  boardTheme: 'violet', // 'violet' | 'cyan' | 'green' | 'wood' | 'obsidian'
  soundEnabled: true,
  soundVolume: 0.5,
  showLegalMoves: true,
  showCoordinates: true,
  showEvaluationBar: true,
  autoFlipBoard: false,
  autoQueen: false,
  animationSpeed: 'normal', // 'fast' | 'normal' | 'slow'
};

const DEFAULT_STATS = {
  gamesPlayed: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  byMode: {
    ai: { played: 0, wins: 0, losses: 0, draws: 0 },
    local: { played: 0, wins: 0, losses: 0, draws: 0 },
    online: { played: 0, wins: 0, losses: 0, draws: 0 },
  },
};

const DEFAULT_PUZZLE_STATS = {
  rating: 1200,
  solved: 0,
  failed: 0,
  streak: 0,
  bestStreak: 0,
};

export function loadSettings() {
  try {
    const item = localStorage.getItem(SETTINGS_KEY);
    return item ? { ...DEFAULT_SETTINGS, ...JSON.parse(item) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
}

export function loadStats() {
  try {
    const item = localStorage.getItem(STATS_KEY);
    return item ? { ...DEFAULT_STATS, ...JSON.parse(item) } : DEFAULT_STATS;
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveStats(stats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {}
}

export function recordGameResult(mode, outcome) {
  const stats = loadStats();
  stats.gamesPlayed += 1;

  if (outcome === 'win') stats.wins += 1;
  else if (outcome === 'loss') stats.losses += 1;
  else if (outcome === 'draw') stats.draws += 1;

  if (stats.byMode && stats.byMode[mode]) {
    stats.byMode[mode].played += 1;
    if (outcome === 'win') stats.byMode[mode].wins += 1;
    else if (outcome === 'loss') stats.byMode[mode].losses += 1;
    else if (outcome === 'draw') stats.byMode[mode].draws += 1;
  }

  saveStats(stats);
  return stats;
}

export function loadRecentGames() {
  try {
    const item = localStorage.getItem(RECENT_GAMES_KEY);
    return item ? JSON.parse(item) : [];
  } catch {
    return [];
  }
}

export function recordRecentGame(gameData) {
  try {
    const games = loadRecentGames();
    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      ...gameData,
    };
    games.unshift(newEntry);
    const trimmed = games.slice(0, 50); // keep last 50 games
    localStorage.setItem(RECENT_GAMES_KEY, JSON.stringify(trimmed));
  } catch {}
}

export function loadPuzzleStats() {
  try {
    const item = localStorage.getItem(PUZZLE_STATS_KEY);
    return item ? { ...DEFAULT_PUZZLE_STATS, ...JSON.parse(item) } : DEFAULT_PUZZLE_STATS;
  } catch {
    return DEFAULT_PUZZLE_STATS;
  }
}

export function savePuzzleStats(stats) {
  try {
    localStorage.setItem(PUZZLE_STATS_KEY, JSON.stringify(stats));
  } catch {}
}

export function updatePuzzleResult(isSuccess, puzzleRating) {
  const stats = loadPuzzleStats();
  if (isSuccess) {
    stats.solved += 1;
    stats.streak += 1;
    if (stats.streak > stats.bestStreak) stats.bestStreak = stats.streak;
    stats.rating += Math.max(8, Math.round((puzzleRating - stats.rating) * 0.1) + 12);
  } else {
    stats.failed += 1;
    stats.streak = 0;
    stats.rating = Math.max(600, stats.rating - 10);
  }
  savePuzzleStats(stats);
  return stats;
}

export function clearAllStats() {
  try {
    localStorage.removeItem(STATS_KEY);
    localStorage.removeItem(RECENT_GAMES_KEY);
    localStorage.removeItem(PUZZLE_STATS_KEY);
  } catch {}
}
