// Chess AI Engine with Minimax, Alpha-Beta Pruning, Piece-Square Tables & Quiescence Search
import { Chess } from 'chess.js';

const PIECE_VALUES = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Piece-Square Tables (from White's perspective; inverted for Black)
const PAWN_TABLE = [
  0, 0, 0, 0, 0, 0, 0, 0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
  5, 5, 10, 25, 25, 10, 5, 5,
  0, 0, 0, 20, 20, 0, 0, 0,
  5, -5, -10, 0, 0, -10, -5, 5,
  5, 10, 10, -20, -20, 10, 10, 5,
  0, 0, 0, 0, 0, 0, 0, 0
];

const KNIGHT_TABLE = [
  -50, -40, -30, -30, -30, -30, -40, -50,
  -40, -20, 0, 0, 0, 0, -20, -40,
  -30, 0, 10, 15, 15, 10, 0, -30,
  -30, 5, 15, 20, 20, 15, 5, -30,
  -30, 0, 15, 20, 20, 15, 0, -30,
  -30, 5, 10, 15, 15, 10, 5, -30,
  -40, -20, 0, 5, 5, 0, -20, -40,
  -50, -40, -30, -30, -30, -30, -40, -50,
];

const BISHOP_TABLE = [
  -20, -10, -10, -10, -10, -10, -10, -20,
  -10, 0, 0, 0, 0, 0, 0, -10,
  -10, 0, 5, 10, 10, 5, 0, -10,
  -10, 5, 5, 10, 10, 5, 5, -10,
  -10, 0, 10, 10, 10, 10, 0, -10,
  -10, 10, 10, 10, 10, 10, 10, -10,
  -10, 5, 0, 0, 0, 0, 5, -10,
  -20, -10, -10, -10, -10, -10, -10, -20,
];

const ROOK_TABLE = [
  0, 0, 0, 0, 0, 0, 0, 0,
  5, 10, 10, 10, 10, 10, 10, 5,
  -5, 0, 0, 0, 0, 0, 0, -5,
  -5, 0, 0, 0, 0, 0, 0, -5,
  -5, 0, 0, 0, 0, 0, 0, -5,
  -5, 0, 0, 0, 0, 0, 0, -5,
  -5, 0, 0, 0, 0, 0, 0, -5,
  0, 0, 0, 5, 5, 0, 0, 0
];

const QUEEN_TABLE = [
  -20, -10, -10, -5, -5, -10, -10, -20,
  -10, 0, 0, 0, 0, 0, 0, -10,
  -10, 0, 5, 5, 5, 5, 0, -10,
  -5, 0, 5, 5, 5, 5, 0, -5,
  0, 0, 5, 5, 5, 5, 0, -5,
  -10, 5, 5, 5, 5, 5, 0, -10,
  -10, 0, 5, 0, 0, 0, 0, -10,
  -20, -10, -10, -5, -5, -10, -10, -20
];

const KING_TABLE_MID = [
  -30, -40, -40, -50, -50, -40, -40, -30,
  -30, -40, -40, -50, -50, -40, -40, -30,
  -30, -40, -40, -50, -50, -40, -40, -30,
  -30, -40, -40, -50, -50, -40, -40, -30,
  -20, -30, -30, -40, -40, -30, -30, -20,
  -10, -20, -20, -20, -20, -20, -20, -10,
  20, 20, 0, 0, 0, 0, 20, 20,
  20, 30, 10, 0, 0, 10, 30, 20
];

function getPieceSquareScore(piece, squareIndex, isWhite) {
  const index = isWhite ? squareIndex : 63 - squareIndex;
  switch (piece) {
    case 'p': return PAWN_TABLE[index];
    case 'n': return KNIGHT_TABLE[index];
    case 'b': return BISHOP_TABLE[index];
    case 'r': return ROOK_TABLE[index];
    case 'q': return QUEEN_TABLE[index];
    case 'k': return KING_TABLE_MID[index];
    default: return 0;
  }
}

// Evaluate board position statically
function evaluateBoard(chess) {
  if (chess.isCheckmate()) {
    return chess.turn() === 'w' ? -Infinity : Infinity;
  }
  if (chess.isDraw() || chess.isStalemate() || chess.isThreefoldRepetition() || chess.isInsufficientMaterial()) {
    return 0;
  }

  let totalEvaluation = 0;
  const board = chess.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece) {
        const sqIndex = r * 8 + c;
        const val = PIECE_VALUES[piece.type];
        const pst = getPieceSquareScore(piece.type, sqIndex, piece.color === 'w');
        const score = val + pst;
        totalEvaluation += piece.color === 'w' ? score : -score;
      }
    }
  }

  return totalEvaluation;
}

// Move ordering for Alpha-Beta efficiency
function orderMoves(moves) {
  return moves.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    if (a.captured) {
      scoreA += (PIECE_VALUES[a.captured] || 0) * 10 - (PIECE_VALUES[a.piece] || 0);
    }
    if (b.captured) {
      scoreB += (PIECE_VALUES[b.captured] || 0) * 10 - (PIECE_VALUES[b.piece] || 0);
    }
    if (a.promotion) scoreA += 800;
    if (b.promotion) scoreB += 800;

    return scoreB - scoreA;
  });
}

// Quiescence search for tactical stability
function quiescence(chess, alpha, beta, isMaximizing, qDepth = 2) {
  const standPat = evaluateBoard(chess);

  if (qDepth === 0) return standPat;

  if (isMaximizing) {
    if (standPat >= beta) return beta;
    if (alpha < standPat) alpha = standPat;

    // Only search captures
    const captureMoves = orderMoves(chess.moves({ verbose: true }).filter(m => m.captured));
    for (const move of captureMoves) {
      chess.move(move);
      const score = quiescence(chess, alpha, beta, false, qDepth - 1);
      chess.undo();

      if (score >= beta) return beta;
      if (score > alpha) alpha = score;
    }
    return alpha;
  } else {
    if (standPat <= alpha) return alpha;
    if (beta > standPat) beta = standPat;

    const captureMoves = orderMoves(chess.moves({ verbose: true }).filter(m => m.captured));
    for (const move of captureMoves) {
      chess.move(move);
      const score = quiescence(chess, alpha, beta, true, qDepth - 1);
      chess.undo();

      if (score <= alpha) return alpha;
      if (score < beta) beta = score;
    }
    return beta;
  }
}

// Minimax with Alpha-Beta
function minimax(chess, depth, alpha, beta, isMaximizing, useQuiescence = false) {
  if (depth === 0) {
    return useQuiescence ? quiescence(chess, alpha, beta, isMaximizing) : evaluateBoard(chess);
  }

  if (chess.isGameOver()) {
    return evaluateBoard(chess);
  }

  const moves = orderMoves(chess.moves({ verbose: true }));

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      chess.move(move);
      const evaluation = minimax(chess, depth - 1, alpha, beta, false, useQuiescence);
      chess.undo();
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break; // Pruning
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      chess.move(move);
      const evaluation = minimax(chess, depth - 1, alpha, beta, true, useQuiescence);
      chess.undo();
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break; // Pruning
    }
    return minEval;
  }
}

/**
 * Calculate best move asynchronously based on difficulty level
 * @param {Chess} chess - Chess instance or FEN string
 * @param {number} level - 1: Beginner, 2: Casual, 3: Intermediate, 4: Master
 * @returns {Promise<{from: string, to: string, promotion?: string}>}
 */
export async function getBestMoveAsync(chessInput, level = 3) {
  // Simulate natural human thinking delay (350ms - 700ms)
  await new Promise(resolve => setTimeout(resolve, 350 + Math.random() * 300));

  const chess = typeof chessInput === 'string' ? new Chess(chessInput) : new Chess(chessInput.fen());
  const moves = chess.moves({ verbose: true });

  if (moves.length === 0) return null;

  const isMaximizing = chess.turn() === 'w';

  // Level 1: Beginner (~800 ELO)
  // 60% random move, 40% prioritize captures
  if (level === 1) {
    const captures = moves.filter(m => m.captured);
    if (captures.length > 0 && Math.random() < 0.5) {
      return captures[Math.floor(Math.random() * captures.length)];
    }
    return moves[Math.floor(Math.random() * moves.length)];
  }

  // Level 2: Casual (~1200 ELO)
  // 1-ply search + slight evaluation noise
  if (level === 2) {
    let bestMove = moves[0];
    let bestValue = isMaximizing ? -Infinity : Infinity;

    for (const move of moves) {
      chess.move(move);
      let val = evaluateBoard(chess) + (Math.random() * 30 - 15);
      chess.undo();

      if (isMaximizing ? val > bestValue : val < bestValue) {
        bestValue = val;
        bestMove = move;
      }
    }
    return bestMove;
  }

  // Level 3: Intermediate (~1600 ELO)
  // Depth 2 Minimax + Alpha-Beta + PSTs
  if (level === 3) {
    let bestMove = moves[0];
    let bestValue = isMaximizing ? -Infinity : Infinity;
    let alpha = -Infinity;
    let beta = Infinity;
    const ordered = orderMoves([...moves]);

    for (const move of ordered) {
      chess.move(move);
      const val = minimax(chess, 2, alpha, beta, !isMaximizing, false);
      chess.undo();

      if (isMaximizing) {
        if (val > bestValue) {
          bestValue = val;
          bestMove = move;
        }
        alpha = Math.max(alpha, val);
      } else {
        if (val < bestValue) {
          bestValue = val;
          bestMove = move;
        }
        beta = Math.min(beta, val);
      }
    }
    return bestMove;
  }

  // Level 4: Master (~2000 ELO)
  // Depth 3 Minimax + Alpha-Beta + Quiescence Search with Root Pruning
  let bestMove = moves[0];
  let bestValue = isMaximizing ? -Infinity : Infinity;
  let alpha = -Infinity;
  let beta = Infinity;
  const ordered = orderMoves([...moves]);

  for (const move of ordered) {
    chess.move(move);
    const val = minimax(chess, 2, alpha, beta, !isMaximizing, true);
    chess.undo();

    if (isMaximizing) {
      if (val > bestValue) {
        bestValue = val;
        bestMove = move;
      }
      alpha = Math.max(alpha, val);
    } else {
      if (val < bestValue) {
        bestValue = val;
        bestMove = move;
      }
      beta = Math.min(beta, val);
    }
    if (beta <= alpha) break;
  }

  return bestMove;
}
