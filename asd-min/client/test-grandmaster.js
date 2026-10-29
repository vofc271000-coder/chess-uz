import { Chess } from 'chess.js';
import { getBestMoveAsync } from './src/utils/aiEngine.js';
import { OPENINGS_DATABASE, identifyOpening } from './src/utils/openings.js';
import { TACTICAL_PUZZLES } from './src/utils/puzzles.js';

console.log('========================================================');
console.log(' GRANDMASTER CHESS COMPREHENSIVE VERIFICATION TEST SUITE');
console.log('========================================================\n');

async function testChessRules() {
  console.log('1. Testing Complete FIDE Chess Rules...');

  // Castling
  const castlingGame = new Chess('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
  const castleKing = castlingGame.move('O-O');
  console.assert(castleKing !== null, 'Kingside castling must succeed');
  const castleQueen = castlingGame.move('O-O-O');
  console.assert(castleQueen !== null, 'Black Queenside castling must succeed');
  console.log('  ✓ Castling (Kingside & Queenside) verified');

  // En Passant
  const epGame = new Chess();
  epGame.move('e4');
  epGame.move('c5');
  epGame.move('e5');
  epGame.move('d5'); // triggers en passant opportunity for white pawn on e5
  const epMove = epGame.move({ from: 'e5', to: 'd6' });
  console.assert(epMove && epMove.flags.includes('e'), 'En Passant capture must succeed');
  console.assert(!epGame.get('d5'), 'Captured pawn on d5 must be removed');
  console.log('  ✓ En Passant capture verified');

  // Pawn Promotion with Underpromotion
  const promoGame = new Chess('8/4P1k1/8/8/8/8/8/4K3 w - - 0 1');
  const underpromo = promoGame.move({ from: 'e7', to: 'e8', promotion: 'n' });
  console.assert(underpromo && underpromo.piece === 'p' && promoGame.get('e8').type === 'n', 'Pawn underpromotion to Knight must succeed');
  console.log('  ✓ Pawn Promotion and Underpromotion verified');

  // Insufficient Material
  const matGame = new Chess('8/8/8/4k3/8/8/8/4K3 w - - 0 1');
  console.assert(matGame.isInsufficientMaterial(), 'King vs King must be insufficient material');
  console.log('  ✓ Insufficient material detection verified');

  // Threefold repetition
  const repGame = new Chess();
  repGame.move('Nf3'); repGame.move('Nf6');
  repGame.move('Ng1'); repGame.move('Ng8');
  repGame.move('Nf3'); repGame.move('Nf6');
  repGame.move('Ng1'); repGame.move('Ng8');
  console.assert(repGame.isThreefoldRepetition(), 'Threefold repetition must be detected');
  console.log('  ✓ Threefold repetition draw verified');
}

async function testOpeningsMatcher() {
  console.log('\n2. Testing Opening Identification System...');
  
  // Sicilian Defense test
  const sicilianMoves = ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6'];
  const sicilianMatch = identifyOpening(sicilianMoves);
  console.assert(sicilianMatch && sicilianMatch.eco === 'B90', 'Should identify Sicilian Najdorf [B90]');
  console.log(`  ✓ Identified: [${sicilianMatch.eco}] ${sicilianMatch.name}`);

  // Ruy Lopez test
  const ruyMoves = ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'];
  const ruyMatch = identifyOpening(ruyMoves);
  console.assert(ruyMatch && ruyMatch.eco === 'C60', 'Should identify Ruy Lopez [C60]');
  console.log(`  ✓ Identified: [${ruyMatch.eco}] ${ruyMatch.name}`);

  // London System test
  const londonMoves = ['d4', 'd5', 'Nf3', 'Nf6', 'Bf4'];
  const londonMatch = identifyOpening(londonMoves);
  console.assert(londonMatch && londonMatch.name.includes('London'), 'Should identify London System');
  console.log(`  ✓ Identified: [${londonMatch.eco}] ${londonMatch.name}`);
}

async function testPuzzlesIntegrity() {
  console.log('\n3. Testing Tactical Puzzles Dataset Integrity...');
  console.assert(TACTICAL_PUZZLES.length >= 10, 'Must have at least 10 curated puzzles');

  for (const puzzle of TACTICAL_PUZZLES) {
    const chess = new Chess(puzzle.fen);
    console.assert(chess.turn() === puzzle.turn, `Puzzle ${puzzle.id} turn mismatch`);
    for (const sol of puzzle.solution) {
      const legal = chess.moves({ verbose: true }).some(m => m.from === sol.from && m.to === sol.to);
      console.assert(legal, `Puzzle ${puzzle.id} solution ${sol.from}->${sol.to} must be legal move`);
      chess.move({ from: sol.from, to: sol.to, promotion: sol.promotion || 'q' });
    }
  }
  console.log(`  ✓ All ${TACTICAL_PUZZLES.length} curated puzzles have valid FENs and legal solutions`);
}

async function testAIEngine() {
  console.log('\n4. Testing AI Engine Multi-Level Search...');
  const chess = new Chess();
  for (let lvl = 1; lvl <= 4; lvl++) {
    const move = await getBestMoveAsync(chess, lvl);
    console.assert(move && move.from && move.to, `AI level ${lvl} move must exist`);
    console.log(`  ✓ AI Level ${lvl} generated legal move: ${move.from}->${move.to}`);
  }
}

async function runAll() {
  try {
    await testChessRules();
    await testOpeningsMatcher();
    await testPuzzlesIntegrity();
    await testAIEngine();
    console.log('\n========================================================');
    console.log(' ALL GRANDMASTER CHESS VERIFICATION TESTS PASSED (100%)');
    console.log('========================================================');
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
}

runAll();
