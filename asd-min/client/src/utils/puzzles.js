// Tactical Chess Puzzles Dataset with Solutions & Explanations

export const TACTICAL_PUZZLES = [
  {
    id: 'puz-01',
    title: "Opera House Mate",
    rating: 950,
    theme: "Back Rank / Pin Mate",
    fen: "rn2kb1r/p4ppp/2p5/4q3/4n3/1B6/PPPB1PPP/R2QK1NR w KQkq - 0 1",
    turn: 'w',
    solution: [
      { from: 'd1', to: 'e2', san: 'Qe2' }
    ],
    hint: "Prevent black’s counterplay and pin the knight on e4.",
    description: "White uses the pinned knight to dominate the open file."
  },
  {
    id: 'puz-02',
    title: "Back Rank Execution",
    rating: 800,
    theme: "Mate in 1",
    fen: "6k1/5ppp/8/8/8/8/4rPPP/3R2K1 w - - 0 1",
    turn: 'w',
    solution: [
      { from: 'd1', to: 'd8', san: 'Rd8#' }
    ],
    hint: "Look at black’s back rank with no escape square.",
    description: "Classic back-rank checkmate exploiting uncastled or trapped king."
  },
  {
    id: 'puz-03',
    title: "Royal Knight Fork",
    rating: 1100,
    theme: "Fork",
    fen: "r1bqk2r/pppp1ppp/2n5/4p3/2B1n3/2P2N2/PPP2PPP/R1BQK2R w KQkq - 0 1",
    turn: 'w',
    solution: [
      { from: 'd1', to: 'd5', san: 'Qd5' }
    ],
    hint: "Simultaneously threaten checkmate on f7 and capture the undefended piece.",
    description: "Double threat: mate on f7 and fork on e4."
  },
  {
    id: 'puz-04',
    title: "Smothered Mate Sequence",
    rating: 1450,
    theme: "Mate in 2",
    fen: "6k1/5Npp/8/8/8/8/4QPPP/6K1 w - - 0 1",
    turn: 'w',
    solution: [
      { from: 'e2', to: 'e8', san: 'Qe8#' }
    ],
    hint: "Deliver direct mate on the back rank.",
    description: "King has no defenders remaining on the 8th rank."
  },
  {
    id: 'puz-05',
    title: "Anastasia’s Mate Net",
    rating: 1350,
    theme: "Checkmate Pattern",
    fen: "5rk1/1p3ppp/pN6/8/8/8/1P3PPP/R4RK1 w - - 0 1",
    turn: 'w',
    solution: [
      { from: 'a1', to: 'd1', san: 'Rad1' }
    ],
    hint: "Seize the open d-file with maximum tempo.",
    description: "Active rook development cutting off file escape routes."
  },
  {
    id: 'puz-06',
    title: "Absolute Pin on the Queen",
    rating: 1200,
    theme: "Pin",
    fen: "r3k2r/pppq1ppp/2n5/3p4/1b1P4/2N1PN2/PP3PPP/R2QKB1R w KQkq - 0 1",
    turn: 'w',
    solution: [
      { from: 'f1', to: 'b5', san: 'Bb5' }
    ],
    hint: "Pin black’s knight against the king.",
    description: "Exploit the uncastled king on the e-file."
  },
  {
    id: 'puz-07',
    title: "Greek Gift Sacrifice",
    rating: 1550,
    theme: "Piece Sacrifice",
    fen: "r1bq1rk1/ppp2ppp/2n1pn2/3p4/2PP4/2NBPN2/PP3PPP/R1BQK2R w KQ - 0 1",
    turn: 'w',
    solution: [
      { from: 'd3', to: 'h7', san: 'Bxh7+' }
    ],
    hint: "Shatter the kingside pawn shield with a bishop sacrifice.",
    description: "Famous Bxh7+ sacrifice pulling the king into a lethal mating net."
  },
  {
    id: 'puz-08',
    title: "Deflection to Queen Win",
    rating: 1400,
    theme: "Deflection",
    fen: "3r2k1/p4ppp/1p6/8/8/P7/1P3PPP/2R3K1 w - - 0 1",
    turn: 'w',
    solution: [
      { from: 'c1', to: 'e1', san: 'Re1' }
    ],
    hint: "Control the open e-file to coordinate with your pawns.",
    description: "Rook centralization for dominant endgame activity."
  },
  {
    id: 'puz-09',
    title: "Boden’s Mate Cross",
    rating: 1600,
    theme: "Mate in 1",
    fen: "2kr3r/pp3ppp/2p5/2B5/8/8/PPP2PPP/R3R1K1 w - - 0 1",
    turn: 'w',
    solution: [
      { from: 'c5', to: 'a7', san: 'Bxa7' }
    ],
    hint: "Strip away the pawn guard of the queenside castled king.",
    description: "Attacking king's pawn shelter with bishop dominance."
  },
  {
    id: 'puz-10',
    title: "Lethal Skewer",
    rating: 1250,
    theme: "Skewer",
    fen: "8/8/4k3/8/2R5/8/r7/3K4 w - - 0 1",
    turn: 'w',
    solution: [
      { from: 'c4', to: 'c2', san: 'Rc2' }
    ],
    hint: "Challenge the active rook on the 2nd rank.",
    description: "Endgame rook challenge leading to simplified pawn promotion."
  },
  {
    id: 'puz-11',
    title: "Damiano's Bishop Checkmate",
    rating: 1050,
    theme: "Mate in 1",
    fen: "r1b2rk1/pp3ppp/1qn5/3p4/1b1Pn3/1P1B1N2/P2B1PPP/RN1Q1RK1 w - - 0 1",
    turn: 'w',
    solution: [
      { from: 'd3', to: 'e4', san: 'Bxe4' }
    ],
    hint: "Eliminate the central outpost knight.",
    description: "Remove black’s most dangerous attacker in the center."
  },
  {
    id: 'puz-12',
    title: "Underpromotion Triumph",
    rating: 1750,
    theme: "Endgame Tactics",
    fen: "8/5P1k/8/8/8/8/8/6K1 w - - 0 1",
    turn: 'w',
    solution: [
      { from: 'f7', to: 'f8', san: 'f8=Q', promotion: 'q' }
    ],
    hint: "Advance the passed pawn to maximum power.",
    description: "Pawn promotion ending all resistance."
  }
];

