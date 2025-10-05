"use client";

import { useMemo, useState } from "react";

type Player = "X" | "O";
type CellValue = Player | null;

type WinnerResult = {
  winner: Player;
  line: number[];
};

const WINNING_LINES: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const EMPTY_BOARD: CellValue[] = Array(9).fill(null);

function calculateWinner(board: CellValue[]): WinnerResult | null {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return null;
}

function getNextPlayer(player: Player): Player {
  return player === "X" ? "O" : "X";
}

type Scoreboard = {
  X: number;
  O: number;
  draws: number;
};

const INITIAL_SCORES: Scoreboard = {
  X: 0,
  O: 0,
  draws: 0,
};

export function TicTacToeGame() {
  const [board, setBoard] = useState<CellValue[]>(EMPTY_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [startingPlayer, setStartingPlayer] = useState<Player>("X");
  const [scores, setScores] = useState<Scoreboard>(INITIAL_SCORES);

  const winnerInfo = useMemo(() => calculateWinner(board), [board]);
  const isBoardFull = useMemo(() => board.every((cell) => cell !== null), [board]);
  const isRoundFinished = Boolean(winnerInfo) || isBoardFull;

  const statusLabel = useMemo(() => {
    if (winnerInfo) {
      return `${winnerInfo.winner} takes the round!`;
    }

    if (isBoardFull) {
      return "It's a draw.";
    }

    return `Your move, ${currentPlayer}`;
  }, [currentPlayer, winnerInfo, isBoardFull]);

  const handleCellClick = (index: number) => {
    if (board[index] || winnerInfo) {
      return;
    }

    const nextBoard = board.slice();
    nextBoard[index] = currentPlayer;
    const result = calculateWinner(nextBoard);
    const boardFull = nextBoard.every((cell) => cell !== null);

    setBoard(nextBoard);

    if (result) {
      setScores((prev) => ({
        ...prev,
        [result.winner]: prev[result.winner] + 1,
      }));
      return;
    }

    if (boardFull) {
      setScores((prev) => ({
        ...prev,
        draws: prev.draws + 1,
      }));
      return;
    }

    setCurrentPlayer(getNextPlayer(currentPlayer));
  };

  const startNextRound = (starter?: Player) => {
    const nextStarter = starter ?? getNextPlayer(startingPlayer);
    setStartingPlayer(nextStarter);
    setCurrentPlayer(nextStarter);
    setBoard(EMPTY_BOARD);
  };

  const handleRematch = () => {
    setScores(INITIAL_SCORES);
    setStartingPlayer("X");
    setCurrentPlayer("X");
    setBoard(EMPTY_BOARD);
  };

  const handleManualStarterChange = (player: Player) => {
    setStartingPlayer(player);
    setCurrentPlayer(player);
    setBoard(EMPTY_BOARD);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <section className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-[0_40px_80px_-40px_rgba(15,23,42,0.65)] backdrop-blur">
        <header className="flex flex-col gap-2 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-sky-200/80">
            Modern Tic Tac Toe
          </p>
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">
            Claim three in a row
          </h1>
          <p className="text-base text-slate-200/80">
            Challenge a friend, keep score, and chase perfect rounds.
          </p>
        </header>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          <div className="flex flex-1 flex-col items-center gap-4">
            <div className="text-sm font-medium uppercase tracking-widest text-slate-100/80">
              {statusLabel}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {board.map((cell, index) => {
                const isWinningCell = winnerInfo?.line.includes(index);
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleCellClick(index)}
                    className={`flex h-24 w-24 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/60 text-4xl font-bold text-white transition-all duration-200 hover:-translate-y-1 hover:border-sky-400/80 hover:shadow-lg hover:shadow-sky-500/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/50 sm:h-28 sm:w-28 sm:text-5xl ${
                      isWinningCell
                        ? "border-sky-300/80 bg-sky-400/20 text-sky-100"
                        : cell === "X"
                          ? "text-sky-200"
                          : cell === "O"
                            ? "text-emerald-200"
                            : ""
                    } ${cell ? "cursor-not-allowed" : ""}`}
                    disabled={Boolean(cell) || Boolean(winnerInfo)}
                  >
                    {cell}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => startNextRound()}
                disabled={!isRoundFinished}
                className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold uppercase tracking-widest text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 disabled:cursor-not-allowed disabled:bg-slate-600/60 disabled:shadow-none"
              >
                Next Round
              </button>
              <button
                type="button"
                onClick={handleRematch}
                className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold uppercase tracking-widest text-white/90 transition hover:border-white hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
              >
                Reset Match
              </button>
            </div>
          </div>

          <aside className="flex w-full max-w-xs flex-col gap-4 self-center rounded-2xl border border-white/15 bg-slate-900/40 p-4 text-slate-200 shadow-lg lg:self-stretch">
            <h2 className="text-center text-lg font-semibold text-white">
              Scoreboard
            </h2>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-sky-500/40 bg-sky-500/10 p-3 text-center">
                <dt className="text-xs uppercase tracking-widest text-sky-200/70">
                  X Wins
                </dt>
                <dd className="text-2xl font-bold text-sky-100">{scores.X}</dd>
              </div>
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-center">
                <dt className="text-xs uppercase tracking-widest text-emerald-200/70">
                  O Wins
                </dt>
                <dd className="text-2xl font-bold text-emerald-100">{scores.O}</dd>
              </div>
              <div className="col-span-2 rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                <dt className="text-xs uppercase tracking-widest text-slate-200/70">
                  Draws
                </dt>
                <dd className="text-2xl font-bold text-white">{scores.draws}</dd>
              </div>
            </dl>

            <div className="mt-2 flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-300/80">
                Choose starting player
              </span>
              <div className="grid grid-cols-2 gap-2">
                {(["X", "O"] as Player[]).map((playerOption) => (
                  <button
                    key={playerOption}
                    type="button"
                    onClick={() => handleManualStarterChange(playerOption)}
                    className={`rounded-xl border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/40 ${
                      startingPlayer === playerOption
                        ? "border-sky-400 bg-sky-400/20 text-sky-100"
                        : "border-white/15 bg-white/5 text-slate-200 hover:border-slate-200/60"
                    }`}
                  >
                    {playerOption}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-300/70">
                Switching the starter resets the current round instantly.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3 text-xs text-slate-300/70">
              <p className="font-semibold uppercase tracking-[0.35em] text-[11px] text-slate-200/80">
                Rules
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                <li>Players alternate placing marks on the 3×3 grid.</li>
                <li>The first player to align three marks wins the round.</li>
                <li>If the grid fills with no winner, the round is a draw.</li>
                <li>Use Next Round to continue while keeping the score.</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
