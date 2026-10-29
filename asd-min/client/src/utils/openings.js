// Comprehensive Chess Openings Database & Matcher
// Maps standard move sequences (in SAN or UCI) to ECO codes and Opening names

export const OPENINGS_DATABASE = [
  // A00 - A99 (Flank Openings & English)
  { eco: 'A00', name: 'Polish Opening (Sokolsky)', moves: ['b4'], desc: 'Unorthodox flank attack developing the bishop on b2.' },
  { eco: 'A04', name: "Reti Opening", moves: ['Nf3'], desc: 'Flexible hypermodern system avoiding early central pawn commitments.' },
  { eco: 'A07', name: "King's Indian Attack", moves: ['Nf3', 'd5', 'g3', 'Nf6', 'Bg2'], desc: 'Universal white setup featuring g3 and Bg2.' },
  { eco: 'A10', name: 'English Opening', moves: ['c4'], desc: 'Control the d5 square from the flank with strategic versatility.' },
  { eco: 'A20', name: 'English Opening: King’s English', moves: ['c4', 'e5'], desc: 'Reverse Sicilian structure leading to dynamic play.' },
  { eco: 'A30', name: 'English Opening: Symmetrical', moves: ['c4', 'c5'], desc: 'Balanced positional maneuvering for both sides.' },
  { eco: 'A40', name: "Queen's Pawn Opening", moves: ['d4'], desc: 'Solid, classical opening controlling e5 and c5.' },
  { eco: 'A45', name: 'Trompowsky Attack', moves: ['d4', 'Nf6', 'Bg5'], desc: 'Aggressive pin aimed at disrupting black’s pawn structure.' },
  { eco: 'A46', name: 'Torre Attack', moves: ['d4', 'Nf6', 'Nf3', 'e6', 'Bg5'], desc: 'Classical attacking system favored by Petrosian.' },
  { eco: 'A48', name: 'London System', moves: ['d4', 'Nf6', 'Nf3', 'd5', 'Bf4'], desc: 'Extremely solid, versatile system favored at top grandmaster level.' },
  { eco: 'A51', name: 'Budapest Gambit', moves: ['d4', 'Nf6', 'c4', 'e5'], desc: 'Dynamic, tactical gambit offering early pawn sacrifice.' },
  { eco: 'A80', name: 'Dutch Defense', moves: ['d4', 'f5'], desc: 'Ambitious, asymmetrical counter-attacking defense.' },

  // B00 - B99 (Semi-Open Games other than French)
  { eco: 'B01', name: 'Scandinavian Defense', moves: ['e4', 'd5'], desc: 'Immediate direct challenge to white’s center.' },
  { eco: 'B02', name: "Alekhine's Defense", moves: ['e4', 'Nf6'], desc: 'Hypermodern defense enticing white pawns forward to later undermine them.' },
  { eco: 'B06', name: 'Modern Defense', moves: ['e4', 'g6'], desc: 'Flexible kingside fianchetto allowing white a broad center.' },
  { eco: 'B07', name: 'Pirc Defense', moves: ['e4', 'd6', 'd4', 'Nf6'], desc: 'Counterattacking weapon with rapid kingside fianchetto.' },
  { eco: 'B10', name: 'Caro-Kann Defense', moves: ['e4', 'c6'], desc: 'Reputation as one of black’s most solid and reliable defenses.' },
  { eco: 'B12', name: 'Caro-Kann: Advance Variation', moves: ['e4', 'c6', 'd4', 'd5', 'e5'], desc: 'White grabs space, while black usually develops Bf5 before e6.' },
  { eco: 'B13', name: 'Caro-Kann: Exchange Variation', moves: ['e4', 'c6', 'd4', 'd5', 'exd5', 'cxd5'], desc: 'Calm Carlsbad structure favoring positional maneuvers.' },
  { eco: 'B17', name: 'Caro-Kann: Steinitz Variation', moves: ['e4', 'c6', 'd4', 'd5', 'Nc3', 'dxe4', 'Nxe4', 'Nd7'], desc: 'Favorite of Anatoly Karpov, avoiding pawn structure compromises.' },
  { eco: 'B20', name: 'Sicilian Defense', moves: ['e4', 'c5'], desc: 'The most popular and aggressive response to 1.e4 at grandmaster level.' },
  { eco: 'B21', name: 'Sicilian: Smith-Morra Gambit', moves: ['e4', 'c5', 'd4', 'cxd4', 'c3'], desc: 'White sacrifices a pawn for rapid piece mobilization and open files.' },
  { eco: 'B22', name: 'Sicilian: Alapin Variation', moves: ['e4', 'c5', 'c3'], desc: 'White aims to establish a classical pawn center with d4.' },
  { eco: 'B23', name: 'Sicilian: Closed Variation', moves: ['e4', 'c5', 'Nc3'], desc: 'Positional maneuvering without early open d-file.' },
  { eco: 'B30', name: 'Sicilian: Old Sicilian', moves: ['e4', 'c5', 'Nf3', 'Nc6'], desc: 'Classic setup aiming for central counterplay.' },
  { eco: 'B33', name: 'Sicilian: Sveshnikov Variation', moves: ['e4', 'c5', 'Nf3', 'Nc6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'e5'], desc: 'High-octane tactical battle deeply analyzed in world championships.' },
  { eco: 'B50', name: 'Sicilian: Modern Open', moves: ['e4', 'c5', 'Nf3', 'd6'], desc: 'Stepping stone to Dragon, Najdorf, and Scheveningen.' },
  { eco: 'B70', name: 'Sicilian: Dragon Variation', moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6'], desc: 'Sharp, ferocious opposite-side castling battles with Bg7.' },
  { eco: 'B90', name: 'Sicilian: Najdorf Variation', moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6'], desc: 'Legendary choice of Garry Kasparov and Bobby Fischer.' },

  // C00 - C99 (Open Games & French)
  { eco: 'C00', name: 'French Defense', moves: ['e4', 'e6'], desc: 'Solid counterattacking system with locked pawn structures.' },
  { eco: 'C02', name: 'French: Advance Variation', moves: ['e4', 'e6', 'd4', 'd5', 'e5'], desc: 'Spatial dominance on kingside against black’s queenside break.' },
  { eco: 'C07', name: 'French: Tarrasch Variation', moves: ['e4', 'e6', 'd4', 'd5', 'Nd2'], desc: 'Positional line avoiding pins on c3.' },
  { eco: 'C10', name: 'French: Classical Variation', moves: ['e4', 'e6', 'd4', 'd5', 'Nc3', 'Nf6'], desc: 'High-tension clash over the e4 square.' },
  { eco: 'C15', name: 'French: Winawer Variation', moves: ['e4', 'e6', 'd4', 'd5', 'Nc3', 'Bb4'], desc: 'Sharp imbalance with pinned knights and double pawns.' },
  { eco: 'C20', name: "King's Pawn Game", moves: ['e4', 'e5'], desc: 'The most classical, historic beginning to a chess match.' },
  { eco: 'C23', name: "Bishop's Opening", moves: ['e4', 'e5', 'Bc4'], desc: 'Direct pressure on the f7 weakness.' },
  { eco: 'C25', name: 'Vienna Game', moves: ['e4', 'e5', 'Nc3'], desc: 'Versatile alternative to 2.Nf3 keeping f4 gambit options open.' },
  { eco: 'C30', name: "King's Gambit", moves: ['e4', 'e5', 'f4'], desc: 'Romantic era attacking gambit offering the f-pawn for rapid initiative.' },
  { eco: 'C40', name: "King's Knight Opening", moves: ['e4', 'e5', 'Nf3'], desc: 'Natural development attacking e5.' },
  { eco: 'C41', name: 'Philidor Defense', moves: ['e4', 'e5', 'Nf3', 'd6'], desc: 'Solid, resilient but slightly passive defense.' },
  { eco: 'C42', name: "Petrov's Defense", moves: ['e4', 'e5', 'Nf3', 'Nf6'], desc: 'Symmetrical, rock-solid classical defense favored in world championships.' },
  { eco: 'C44', name: 'Scotch Game', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'd4'], desc: 'Immediate central blast popularized by Garry Kasparov.' },
  { eco: 'C46', name: 'Three Knights Game', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Nc3'], desc: 'Quiet transitional setup heading towards open lines.' },
  { eco: 'C47', name: 'Four Knights Game', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Nc3', 'Nf6'], desc: 'Classical, harmonious piece development.' },
  { eco: 'C50', name: 'Italian Game (Giuoco Piano)', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5'], desc: 'Quiet, deeply strategic positional chess.' },
  { eco: 'C51', name: 'Evans Gambit', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'b4'], desc: 'Famous gambit sacrificing b4 pawn for an irresistible center.' },
  { eco: 'C55', name: 'Two Knights Defense', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6'], desc: 'Sharp tactical skirmish leading to wild complications.' },
  { eco: 'C60', name: 'Ruy Lopez (Spanish Opening)', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'], desc: 'The cornerstone of classical chess; deep strategic mastery.' },
  { eco: 'C65', name: 'Ruy Lopez: Berlin Defense', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'Nf6'], desc: 'The "Berlin Wall" famous for neutralising Kramnik vs Kasparov.' },
  { eco: 'C88', name: 'Ruy Lopez: Closed', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Be7'], desc: 'Deep positional maneuvering tested across over a century.' },

  // D00 - D99 (Closed Games & Queen's Gambit)
  { eco: 'D00', name: "Queen's Pawn: Mason Attack", moves: ['d4', 'd5'], desc: 'Classical balance controlling the central dark squares.' },
  { eco: 'D02', name: "Queen's Pawn: London System", moves: ['d4', 'd5', 'Nf3', 'Nf6', 'Bf4'], desc: 'Modern reliable system controlling e5.' },
  { eco: 'D06', name: "Queen's Gambit", moves: ['d4', 'd5', 'c4'], desc: 'Temporary pawn sacrifice to claim central supremacy.' },
  { eco: 'D20', name: "Queen's Gambit Accepted", moves: ['d4', 'd5', 'c4', 'dxc4'], desc: 'Surrenders the center to seek rapid counterplay against white’s d4.' },
  { eco: 'D30', name: "Queen's Gambit Declined", moves: ['d4', 'd5', 'c4', 'e6'], desc: 'Stalwart, classical resilience supporting d5.' },
  { eco: 'D35', name: 'QGD: Exchange Variation', moves: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'cxd5', 'exd5'], desc: 'Famous minority attack strategy on the queenside.' },
  { eco: 'D43', name: 'Semi-Slav Defense', moves: ['d4', 'd5', 'c4', 'c6', 'Nf3', 'Nf6', 'Nc3', 'e6'], desc: 'Rich combination of Slav solidity and QGD center strength.' },
  { eco: 'D80', name: 'Grünfeld Defense', moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'd5'], desc: 'Fierce counter-strikes against white’s expansive pawn center.' },

  // E00 - E99 (Indian Defenses)
  { eco: 'E00', name: 'Catalan Opening', moves: ['d4', 'Nf6', 'c4', 'e6', 'g3'], desc: 'Elite grandmaster weapon blending Queen’s Gambit with kingside fianchetto.' },
  { eco: 'E12', name: "Queen's Indian Defense", moves: ['d4', 'Nf6', 'c4', 'e6', 'Nf3', 'b6'], desc: 'Solid positional defense controlling e4 from afar.' },
  { eco: 'E20', name: 'Nimzo-Indian Defense', moves: ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4'], desc: 'Prestigious system pinning the knight to inflict structural imbalances.' },
  { eco: 'E60', name: "King's Indian Defense", moves: ['d4', 'Nf6', 'c4', 'g6'], desc: 'Romantic and aggressive weapon for dynamic kingside attacks.' },
  { eco: 'E90', name: "King's Indian: Classical", moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6', 'Nf3', 'O-O', 'Be2', 'e5'], desc: 'Intense tactical clash with locked centers and opposite flank storms.' }
];

/**
 * Identify the closest matching opening from a list of SAN moves
 * @param {Array<string>} sanMoves - e.g. ['e4', 'c5', 'Nf3', 'd6']
 * @returns {{ eco: string, name: string, desc: string } | null}
 */
export function identifyOpening(sanMoves = []) {
  if (!sanMoves || sanMoves.length === 0) return null;

  let bestMatch = null;
  let maxMovesMatched = 0;

  for (const op of OPENINGS_DATABASE) {
    if (op.moves.length <= sanMoves.length) {
      let matches = true;
      for (let i = 0; i < op.moves.length; i++) {
        if (op.moves[i] !== sanMoves[i]) {
          matches = false;
          break;
        }
      }

      if (matches && op.moves.length > maxMovesMatched) {
        bestMatch = op;
        maxMovesMatched = op.moves.length;
      }
    }
  }

  return bestMatch;
}

