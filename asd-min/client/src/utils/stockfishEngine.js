// Stockfish UCI Engine Wrapper with Web Worker & Minimax Fallback
import { getBestMoveAsync as fallbackMinimax } from './aiEngine';

class StockfishEngine {
  constructor() {
    this.worker = null;
    this.isReady = false;
    this.isEvaluating = false;
    this.onEvaluationUpdate = null; // callback (evalData: { score: number, isMate: boolean, mateIn: number, depth: number, bestMoveSan?: string })
    this.pendingMoveResolve = null;
    this.pendingMoveReject = null;
    this.init();
  }

  init() {
    if (typeof window === 'undefined' || typeof Worker === 'undefined') {
      return;
    }

    try {
      this.worker = new Worker('/stockfish.js');

      this.worker.onmessage = (e) => {
        const line = typeof e.data === 'string' ? e.data : '';
        this.handleEngineOutput(line);
      };

      this.worker.onerror = (err) => {
        console.warn('Stockfish Worker error, falling back to Minimax engine:', err);
        this.worker = null;
        this.isReady = false;
      };

      // Send initial UCI commands
      this.send('uci');
      this.send('isready');
    } catch (e) {
      console.warn('Could not launch Stockfish Worker, using built-in engine:', e);
      this.worker = null;
      this.isReady = false;
    }
  }

  send(cmd) {
    if (this.worker) {
      try {
        this.worker.postMessage(cmd);
      } catch (err) {
        console.warn('Error sending to Stockfish:', err);
      }
    }
  }

  handleEngineOutput(line) {
    if (line === 'readyok') {
      this.isReady = true;
    }

    // Parse live position evaluation
    // e.g. "info depth 10 score cp 45 time 120 nodes 15203 pv e2e4 c7c5"
    // e.g. "info depth 8 score mate 2 pv f7f8q"
    if (line.startsWith('info') && (line.includes('score cp') || line.includes('score mate'))) {
      const depthMatch = line.match(/depth\s+(\d+)/);
      const cpMatch = line.match(/score cp\s+(-?\d+)/);
      const mateMatch = line.match(/score mate\s+(-?\d+)/);
      const pvMatch = line.match(/pv\s+([a-h1-8]{4,5})/);

      const depth = depthMatch ? parseInt(depthMatch[1], 10) : 0;
      let score = 0;
      let isMate = false;
      let mateIn = 0;

      if (mateMatch) {
        isMate = true;
        mateIn = parseInt(mateMatch[1], 10);
        score = mateIn > 0 ? 1000 : -1000;
      } else if (cpMatch) {
        score = parseInt(cpMatch[1], 10) / 100.0;
      }

      if (this.onEvaluationUpdate) {
        this.onEvaluationUpdate({
          score,
          isMate,
          mateIn,
          depth,
          pv: pvMatch ? pvMatch[1] : null,
        });
      }
    }

    // Parse bestmove
    // e.g. "bestmove e2e4 ponder e7e5"
    if (line.startsWith('bestmove')) {
      const parts = line.split(' ');
      const uciMove = parts[1]; // e.g. "e2e4" or "e7e8q"
      this.isEvaluating = false;

      if (this.pendingMoveResolve) {
        const resolve = this.pendingMoveResolve;
        this.pendingMoveResolve = null;
        this.pendingMoveReject = null;

        if (!uciMove || uciMove === '(none)') {
          resolve(null);
        } else {
          const from = uciMove.slice(0, 2);
          const to = uciMove.slice(2, 4);
          const promotion = uciMove.length > 4 ? uciMove[4] : undefined;
          resolve({ from, to, promotion });
        }
      }
    }
  }

  /**
   * Stop current calculation
   */
  stop() {
    if (this.worker) {
      this.send('stop');
    }
    this.isEvaluating = false;
    if (this.pendingMoveReject) {
      this.pendingMoveReject(new Error('Calculation cancelled'));
      this.pendingMoveResolve = null;
      this.pendingMoveReject = null;
    }
  }

  /**
   * Evaluate a position asynchronously for the Evaluation Bar
   * @param {string} fen
   * @param {number} depth
   */
  evaluatePosition(fen, depth = 10) {
    if (!this.worker || !this.isReady) return;

    this.send('stop');
    this.send(`position fen ${fen}`);
    this.send(`go depth ${depth}`);
    this.isEvaluating = true;
  }

  /**
   * Get best move from Stockfish with difficulty level mapping
   * @param {Chess|string} chessInput
   * @param {number} level - 1 to 6
   * @returns {Promise<{from: string, to: string, promotion?: string}>}
   */
  async getBestMove(chessInput, level = 3) {
    // If worker is unavailable, use built-in Minimax fallback
    if (!this.worker || !this.isReady) {
      return fallbackMinimax(chessInput, Math.min(4, level));
    }

    const fen = typeof chessInput === 'string' ? chessInput : chessInput.fen();

    // Map level (1-6) to Stockfish Skill Level (0-20) and depth
    const skillLevels = [0, 2, 6, 12, 16, 20];
    const depths = [2, 4, 6, 9, 12, 15];
    const skill = skillLevels[Math.min(level - 1, 5)] ?? 10;
    const depth = depths[Math.min(level - 1, 5)] ?? 8;

    this.stop();

    return new Promise((resolve, reject) => {
      this.pendingMoveResolve = resolve;
      this.pendingMoveReject = reject;
      this.isEvaluating = true;

      this.send(`setoption name Skill Level value ${skill}`);
      this.send(`position fen ${fen}`);
      this.send(`go depth ${depth}`);

      // Safety timeout after 5 seconds to fallback if worker hangs
      setTimeout(() => {
        if (this.pendingMoveResolve === resolve) {
          console.warn('Stockfish timeout, resolving via fallback');
          this.pendingMoveResolve = null;
          this.pendingMoveReject = null;
          fallbackMinimax(chessInput, Math.min(4, level)).then(resolve).catch(reject);
        }
      }, 5000);
    });
  }

  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.isReady = false;
    }
  }
}

export const stockfishEngine = new StockfishEngine();

