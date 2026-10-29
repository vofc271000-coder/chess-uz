# GrandMaster Chess — Professional Full-Stack Tournament Platform & Engine Studio

A tournament-grade, full-stack chess web application built with **React 18**, **Vite 6**, **Tailwind CSS 3**, **Stockfish UCI Engine**, **Node.js**, **Express**, **Socket.IO**, and **Chess.js**.

Designed with a luxury dark cosmic aesthetic (`#080B12`, `#111827`, `#182131`), electric violet & cyan accents, full FIDE chess rules compliance, Web Worker Stockfish integration, deep analysis board with live evaluation bar, tactical puzzles studio, opening encyclopedia, real-time multiplayer rooms, clocks with increments, move history replay, custom board themes, and an acoustic sound synthesizer.

Website: [chess-uz-liart.vercel.app](https://chess-uz-liart.vercel.app/)

---

## 🌟 Key Features

### 1. Game Modes
- **Play Against Stockfish AI (Computer)**:
  - 6 Configurable Difficulty Tiers:
    - **Level 1 — Novice (~800 ELO)**: Casual play, captures simple undefended pieces.
    - **Level 2 — Casual (~1200 ELO)**: Positional heuristics and center control.
    - **Level 3 — Intermediate (~1600 ELO)**: Minimax search with Alpha-Beta pruning & Piece-Square tables.
    - **Level 4 — Advanced (~1900 ELO)**: Quiescence capture search with root alpha-beta pruning.
    - **Level 5 — Master (~2200 ELO)**: Deep tactical tree evaluation.
    - **Level 6 — GrandMaster (~2500+ ELO)**: Full Stockfish UCI engine integration via Web Worker.
  - Multi-threaded Web Worker calculation; never blocks or freezes the UI thread.
  - Real-time engine thinking indicator.
  - Best-move **Hint** button highlighting the optimal move and strategy.
  - Play as White, Black, or Random.
  - Multi-move Undo & Redo.
- **Pass & Play (Local Multiplayer)**:
  - Play on a single device with shared screen.
  - Auto-flip board on turn option or manual one-click flip.
  - Full Undo & Redo history support.
- **Online Multiplayer (Real-Time Socket.IO)**:
  - Instant room creation with a unique 6-character room code (e.g. `K9W4X2`).
  - Shareable room invite codes.
  - Time controls: **1+0 Bullet**, **2+1 Bullet**, **3+0 Blitz**, **3+2 Blitz**, **5+0 Rapid**, **10+0 Rapid**, **15+10 Classical**, and **Unlimited**.
  - Authoritative server-side move validation using `Chess.js`.
  - Live clock synchronization and flag detection (timeout loss).
  - In-game real-time chat with connection status.
  - Draw offer, accept/decline dialogs, and instant resignation.
  - Rematch system with automatic color alternation.
  - Graceful disconnection and reconnection handling.

### 2. Studio Modules
- **Deep Engine Analysis Board**:
  - Live interactive analysis board with Stockfish engine evaluation.
  - Vertical animated **Evaluation Bar** showing centipawn score and mate in X.
  - Real-time **Best Move recommendation** with arrows and square highlights.
  - FEN import and export with instant validation.
  - PGN import and export with clipboard copy and `.pgn` file download.
  - Step-by-step history explorer (`|<`, `<`, `>`, `>|`).
- **Tactics & Puzzle Studio**:
  - Curated tactical puzzles across themes: Forks, Pins, Skewers, Back-Rank, Mate in 1, Mate in 2, Deflection.
  - Tactics rating system with performance tracking, win streaks, and best streak records.
  - Interactive solve validation with instant visual feedback and celebratory confetti.
  - Hint system revealing tactical ideas.
- **Opening Encyclopedia**:
  - 60+ famous chess openings classified by ECO volumes (A through E).
  - Search by opening name, ECO code, or move sequence.
  - Interactive step-by-step preview on the board.
  - Strategic guidance and plans for both White and Black.
  - One-click "Analyze" button sending the position to the Analysis Studio.
- **Match Archives & Analytics**:
  - Career statistics: total games played, wins, losses, draws, overall win rate percentage.
  - Breakdown by mode (vs Computer, Pass & Play, Online).
  - Full match log with outcomes, dates, move counts, and end reasons.

### 3. Chess Engine & FIDE Rules Compliance
- Standard starting position (White bottom, Black top or flippable).
- Strict legal move generation and check detection.
- Disallows moves that expose or leave the king in check.
- **Castling**: Kingside (`O-O`) and Queenside (`O-O-O`).
- **En Passant**: Dynamic pawn capture tracking.
- **Pawn Promotion**: Interactive modal for promoting pawns to **Queen**, **Rook**, **Bishop**, or **Knight** (with optional Auto-Queen setting).
- **Draw Conditions**:
  - Stalemate
  - Threefold Repetition
  - 50-Move Rule
  - Insufficient Material (King vs King, King + Bishop vs King, etc.)
  - Mutual Agreement

### 4. User Interface & Luxury Dark Design
- **Color Palette**:
  - Background: `#080B12` (deep cosmic void)
  - Cards and panels: `#111827` and `#182131`
  - Accent colors: Electric violet (`#8B5CF6`), Cyber cyan (`#06B6D4`), and restrained blue gradients
- **Responsive Layout**:
  - Collapsible desktop sidebar (Play Arena, Analysis Board, Tactics, Openings, Archives, Settings)
  - Mobile bottom navigation bar for seamless single-hand use on phones and tablets
- **Piece Sets**: Crisp, tournament-standard vector SVG pieces.
- **Visual Feedback**:
  - Selected square highlight with glowing cyan ring.
  - Legal move dots (empty squares) and capture rings (opponent pieces).
  - Subtle golden tint highlighting the last move (`from` and `to`).
  - Pulsing radial crimson glow on the king's square when in check.
  - Low-time warning (<30 seconds) on clocks with pulsing red glow.
- **Board Customization Themes**:
  - **Electric Violet** (Midnight violet & lavender)
  - **Cyber Cyan** (Deep slate & oceanic cyan)
  - **Tournament Emerald** (Classic FIDE Chess.com style)
  - **GrandMaster Wood** (Warm maple & walnut)
  - **Carbon Obsidian** (Minimalist charcoal slate)
  - Toggleable legal move dots.
  - Toggleable board coordinates (ranks 1-8, files a-h).
  - Toggleable live evaluation bar.
- **Web Audio Synthesizer**:
  - Offline Web Audio API synthesizer for moves, captures, castling, checks, promotion, and victory/defeat fanfares.
  - Zero audio latency with volume control and mute toggle.
- **Keyboard Accessibility**:
  - `Space`: Flip board orientation
  - `ArrowLeft` / `ArrowRight`: Navigate move history
  - `H`: Get AI best move hint
  - `U`: Undo move
  - `Esc`: Clear square selection

---

## 🛠 Technology Stack

- **Frontend**:
  - [React 18](https://react.dev/)
  - [Vite 6](https://vitejs.dev/)
  - [Tailwind CSS 3](https://tailwindcss.com/)
  - [Stockfish 10](https://github.com/niklasf/stockfish.js) (UCI Web Worker Engine)
  - [Chess.js](https://github.com/jhlywa/chess.js) (Rules & move generation)
  - [Lucide React](https://lucide.dev/) (Clean icons)
  - [Canvas Confetti](https://github.com/catdad/canvas-confetti) (Celebrations)
  - [Socket.IO Client](https://socket.io/) (Real-time synchronization)
- **Backend**:
  - [Node.js](https://nodejs.org/) (ES Modules)
  - [Express.js](https://expressjs.com/) (HTTP & REST API)
  - [Socket.IO](https://socket.io/) (WebSockets server)
  - [Chess.js](https://github.com/jhlywa/chess.js) (Server-side move verification)
  - [CORS](https://github.com/expressjs/cors) & [Dotenv](https://github.com/motdotla/dotenv)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0 or higher)
- **npm** (v9.0 or higher)

### 1. Installation

From the project root directory, install all client and server dependencies:

```bash
# Install root, server, and client dependencies
npm run install:all
```

Or install them individually:
```bash
cd server && npm install
cd ../client && npm install
```

### 2. Running the Application

You can start both the server and client concurrently or in separate terminal windows.

#### Terminal 1 — Start Backend Server (Port 3001)
```bash
cd server
npm run dev
```
The server will start at `http://localhost:3001`.

#### Terminal 2 — Start Frontend Client (Port 5173)
```bash
cd client
npm run dev
```
The Vite development server will start at `http://localhost:5173`. Open this URL in your web browser.

---

## 🧪 Testing

The codebase includes test suites for verifying all chess rules, move validation, AI calculation, and multiplayer logic.

### Test Chess Rules & Server Logic
```bash
cd server
npm test
```

### Test Comprehensive GrandMaster Suite (AI, Rules, Openings, Puzzles)
```bash
cd client
npm test
```
