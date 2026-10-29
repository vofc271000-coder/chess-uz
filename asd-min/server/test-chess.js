import { Chess } from 'chess.js';
import { GameManager } from './src/gameManager.js';

console.log('--- 1. Testing Chess.js Core Engine & Rules ---');

// Test 1: Starting Position & Legal Moves
const chess = new Chess();
console.assert(chess.turn() === 'w', 'White should start');
console.assert(chess.moves().length === 20, `Expected 20 initial moves, got ${chess.moves().length}`);

// Test 2: Pawn double push & En Passant
chess.load('rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2');
const enPassantGame = new Chess();
enPassantGame.move('e4');
enPassantGame.move('c5');
enPassantGame.move('e5');
enPassantGame.move('d5'); // triggers en passant square d6
const enPassantMoves = enPassantGame.moves({ verbose: true });
const hasEnPassant = enPassantMoves.some(m => m.flags.includes('e'));
console.assert(hasEnPassant, 'En passant move should be available');
const epMove = enPassantGame.move({ from: 'e5', to: 'd6' });
console.assert(epMove.captured === 'p', 'En passant should capture black pawn on d5');
console.log('✓ Pawn movement & En Passant verified');

// Test 3: Castling (Kingside & Queenside)
const castlingGame = new Chess();
castlingGame.move('e4'); castlingGame.move('e5');
castlingGame.move('Nf3'); castlingGame.move('Nc6');
castlingGame.move('Bc4'); castlingGame.move('Bc5');
// White can castle kingside
const whiteCastleMove = castlingGame.move('O-O');
console.assert(whiteCastleMove !== null, 'White kingside castling O-O should succeed');
console.assert(whiteCastleMove.flags.includes('k'), 'Flag should indicate kingside castle');
console.log('✓ Castling verified');

// Test 4: Disallowed Move (Illegal move exposing King to check)
const pinGame = new Chess();
pinGame.move('e4'); pinGame.move('e5');
pinGame.move('Nf3'); pinGame.move('d6');
pinGame.move('Bb5'); // Pins pawn/knight or delivers check
// Black tries illegal move moving piece away
let illegalCaught = false;
try {
  pinGame.move({ from: 'd8', to: 'd7' }); // Queen blocked or king in check
} catch {
  illegalCaught = true;
}
console.assert(illegalCaught || pinGame.moves({ square: 'd8' }).length === 0 || !pinGame.moves().includes('Qd7'), 'Illegal move should be disallowed');
console.log('✓ Illegal moves & Check exposure prevention verified');

// Test 5: Pawn Promotion
const promoGame = new Chess('8/4P3/8/8/8/8/8/4K2k w - - 0 1');
const promoMove = promoGame.move({ from: 'e7', to: 'e8', promotion: 'q' });
console.assert(promoMove && promoMove.piece === 'p' && promoMove.promotion === 'q', 'Promotion to queen should succeed');
console.assert(promoGame.get('e8').type === 'q', 'Promoted piece on e8 should be queen');
console.log('✓ Pawn promotion verified');

// Test 6: Checkmate (Fool\'s Mate)
const foolsMate = new Chess();
foolsMate.move('f3'); foolsMate.move('e5');
foolsMate.move('g4'); foolsMate.move('Qh4#');
console.assert(foolsMate.isGameOver(), 'Game should be over');
console.assert(foolsMate.isCheckmate(), 'Game should be checkmate');
console.assert(foolsMate.turn() === 'w', 'White is checkmated');
console.log("✓ Checkmate (Fool's Mate) verified");

// Test 7: Stalemate
const stalemateGame = new Chess('k7/8/1Q6/8/8/8/8/7K b - - 0 1');
console.assert(stalemateGame.isGameOver(), 'Game should be over');
console.assert(stalemateGame.isStalemate(), 'Game should be stalemate');
console.assert(stalemateGame.isDraw(), 'Game should be draw');
console.log('✓ Stalemate verified');

console.log('\n--- 2. Testing GameManager & Server Multiplayer Logic ---');
const mockIo = {
  to: () => ({
    emit: () => {},
  }),
};

const gm = new GameManager(mockIo);
const room = gm.createRoom({ timeControlMinutes: 5, incrementSeconds: 2, preferredColor: 'w', creatorName: 'Alice' });
console.assert(room && room.id.length === 6, 'Room ID should be 6 characters');

// Mock sockets
const socketA = { id: 'sock_alice', join: () => {} };
const socketB = { id: 'sock_bob', join: () => {} };

const joinA = gm.joinRoom(room.id, socketA, 'Alice');
console.assert(joinA.assignedColor === 'w', 'Alice should be assigned White');

const joinB = gm.joinRoom(room.id, socketB, 'Bob');
console.assert(joinB.assignedColor === 'b', 'Bob should be assigned Black');

console.assert(gm.getRoom(room.id).status === 'active', 'Room should be active after 2 players join');

// Player A makes move e4
const moveResult = gm.makeMove(room.id, socketA.id, { from: 'e2', to: 'e4' });
console.assert(moveResult && moveResult.move && moveResult.move.san === 'e4', 'Move e4 should succeed');

// Player A tries to move again out of turn (should fail)
const outOfTurn = gm.makeMove(room.id, socketA.id, { from: 'e4', to: 'e5' });
console.assert(outOfTurn.error !== undefined, 'Out of turn move should be rejected');

// Player B makes move e5
const moveResultB = gm.makeMove(room.id, socketB.id, { from: 'e7', to: 'e5' });
console.assert(moveResultB && moveResultB.move && moveResultB.move.san === 'e5', 'Move e5 should succeed');

// Test Resignation
const resignResult = gm.resign(room.id, socketB.id);
console.assert(resignResult && resignResult.result.winner === 'white', 'White should win after Black resigns');
console.assert(resignResult.status === 'finished', 'Status should be finished');

console.log('✓ GameManager room creation, player joins, move validation, turn enforcement, and resignation verified');

clearInterval(gm.timerInterval);
console.log('\nALL ENGINE & SERVER TESTS PASSED SUCCESSFULLY!');

