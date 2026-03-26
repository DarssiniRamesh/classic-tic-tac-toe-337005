import React, { useMemo, useState } from "react";
import "./App.css";

const LINES = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

// PUBLIC_INTERFACE
function App() {
  /** Root application component rendering a local two-player Tic Tac Toe game. */
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const gameResult = useMemo(() => {
    const winnerInfo = calculateWinner(board);
    if (winnerInfo) {
      return {
        status: "win",
        winner: winnerInfo.winner,
        line: winnerInfo.line,
      };
    }
    const isDraw = board.every((cell) => cell !== null);
    if (isDraw) {
      return { status: "draw" };
    }
    return { status: "playing", next: xIsNext ? "X" : "O" };
  }, [board, xIsNext]);

  // PUBLIC_INTERFACE
  function handleCellClick(index) {
    /** Handles a user click on a board cell; places X/O if allowed. */
    if (board[index] || gameResult.status !== "playing") return;

    const next = board.slice();
    next[index] = xIsNext ? "X" : "O";
    setBoard(next);
    setXIsNext((v) => !v);
  }

  // PUBLIC_INTERFACE
  function restartGame() {
    /** Resets the game board and turn to the initial state. */
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  }

  const statusText = useMemo(() => {
    if (gameResult.status === "win") return `Winner: ${gameResult.winner}`;
    if (gameResult.status === "draw") return "Draw game";
    return `Turn: ${gameResult.next}`;
  }, [gameResult]);

  return (
    <div className="app">
      <main className="page">
        <header className="header">
          <h1 className="title">Tic Tac Toe</h1>
          <p
            className={`status ${
              gameResult.status === "win"
                ? "status--win"
                : gameResult.status === "draw"
                  ? "status--draw"
                  : ""
            }`}
            role="status"
            aria-live="polite"
          >
            {statusText}
          </p>
        </header>

        <section className="boardCard" aria-label="Tic Tac Toe game">
          <Board
            board={board}
            winningLine={gameResult.status === "win" ? gameResult.line : null}
            onCellClick={handleCellClick}
            disabled={gameResult.status !== "playing"}
          />
        </section>

        <footer className="actions">
          <button className="btn btn--primary" onClick={restartGame} type="button">
            Restart
          </button>
        </footer>

        <p className="hint">
          Local two-player on the same device. X goes first.
        </p>
      </main>
    </div>
  );
}

function Board({ board, onCellClick, winningLine, disabled }) {
  const winningSet = useMemo(() => {
    if (!winningLine) return null;
    return new Set(winningLine);
  }, [winningLine]);

  return (
    <div
      className="board"
      role="grid"
      aria-label="3 by 3 Tic Tac Toe board"
      aria-disabled={disabled ? "true" : "false"}
    >
      {board.map((value, idx) => {
        const isWinningCell = winningSet ? winningSet.has(idx) : false;
        const isFilled = value !== null;
        return (
          <button
            key={idx}
            type="button"
            className={[
              "cell",
              isFilled ? "cell--filled" : "",
              isWinningCell ? "cell--win" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => onCellClick(idx)}
            disabled={disabled || isFilled}
            role="gridcell"
            aria-label={`Cell ${idx + 1}${value ? `: ${value}` : ""}`}
          >
            <span className="cellValue" aria-hidden="true">
              {value}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function calculateWinner(squares) {
  for (const line of LINES) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line };
    }
  }
  return null;
}

export default App;
