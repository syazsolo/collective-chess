"use client";

import { useState } from "react";
import { Chess } from "chess.js";
import { ChessBoard } from "../board";
import type { BoardMove, BoardNavigationMove } from "../board";
import { MoveNavigation } from "../controls/move-navigation";
import styles from "./chess-game.module.css";

type BoardPosition = {
  fen: string;
  lastMove: BoardNavigationMove | null;
};

type BoardHistory = {
  positionIndex: number;
  positions: BoardPosition[];
};

const initialPosition: BoardPosition = {
  fen: new Chess().fen(),
  lastMove: null,
};

const initialHistory: BoardHistory = {
  positionIndex: 0,
  positions: [initialPosition],
};

export function ChessGame() {
  const [history, setHistory] = useState<BoardHistory>(initialHistory);
  const activePosition =
    history.positions[history.positionIndex] ?? initialPosition;
  const canMoveBack = history.positionIndex > 0;
  const canMoveForward = history.positionIndex < history.positions.length - 1;

  function handleMove(fen: string, move: BoardMove) {
    setHistory((currentHistory) => {
      const nextIndex = currentHistory.positionIndex + 1;
      const nextPosition = {
        fen,
        lastMove: { from: move.from, to: move.to },
      };

      return {
        positionIndex: nextIndex,
        positions: [
          ...currentHistory.positions.slice(0, nextIndex),
          nextPosition,
        ],
      };
    });
  }

  function showPreviousMove() {
    setHistory((currentHistory) => {
      const previousIndex = Math.max(0, currentHistory.positionIndex - 1);

      if (previousIndex === currentHistory.positionIndex) {
        return currentHistory;
      }

      return {
        ...currentHistory,
        positionIndex: previousIndex,
      };
    });
  }

  function showNextMove() {
    setHistory((currentHistory) => {
      const nextIndex = Math.min(
        currentHistory.positions.length - 1,
        currentHistory.positionIndex + 1,
      );

      if (nextIndex === currentHistory.positionIndex) {
        return currentHistory;
      }

      return {
        ...currentHistory,
        positionIndex: nextIndex,
      };
    });
  }

  return (
    <div className={styles.game}>
      <ChessBoard
        position={{
          fen: activePosition.fen,
          lastMove: activePosition.lastMove,
          moveIndex: history.positionIndex,
        }}
        onMove={handleMove}
      />
      <MoveNavigation
        canMoveBack={canMoveBack}
        canMoveForward={canMoveForward}
        currentPly={history.positionIndex}
        lastPly={history.positions.length - 1}
        onBack={showPreviousMove}
        onForward={showNextMove}
      />
    </div>
  );
}
