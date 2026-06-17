"use client";

import { useState } from "react";
import { Chess } from "chess.js";
import { ChessBoard } from "../board";
import type { BoardMove, BoardTransition } from "../board";
import { MoveNavigation } from "../controls/move-navigation";
import styles from "./chess-game.module.css";

type BoardPosition = {
  fen: string;
  lastMove: BoardMove | null;
};

type BoardHistory = {
  positionIndex: number;
  positions: BoardPosition[];
  transition: BoardTransition;
};

const initialPosition: BoardPosition = {
  fen: new Chess().fen(),
  lastMove: null,
};

const initialHistory: BoardHistory = {
  positionIndex: 0,
  positions: [initialPosition],
  transition: null,
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
        lastMove: {
          color: move.color,
          from: move.from,
          piece: move.piece,
          to: move.to,
        },
      };

      return {
        positionIndex: nextIndex,
        positions: [
          ...currentHistory.positions.slice(0, nextIndex),
          nextPosition,
        ],
        transition: {
          color: move.color,
          from: move.from,
          to: move.to,
          type: move.piece,
        },
      };
    });
  }

  function showPreviousMove() {
    setHistory((currentHistory) => {
      const previousIndex = Math.max(0, currentHistory.positionIndex - 1);

      if (previousIndex === currentHistory.positionIndex) {
        return currentHistory;
      }

      const currentPosition =
        currentHistory.positions[currentHistory.positionIndex];

      return {
        ...currentHistory,
        positionIndex: previousIndex,
        transition: currentPosition.lastMove
          ? {
              color: currentPosition.lastMove.color,
              from: currentPosition.lastMove.to,
              to: currentPosition.lastMove.from,
              type: currentPosition.lastMove.piece,
            }
          : null,
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

      const nextPosition = currentHistory.positions[nextIndex];

      return {
        ...currentHistory,
        positionIndex: nextIndex,
        transition: nextPosition.lastMove
          ? {
              color: nextPosition.lastMove.color,
              from: nextPosition.lastMove.from,
              to: nextPosition.lastMove.to,
              type: nextPosition.lastMove.piece,
            }
          : null,
      };
    });
  }

  return (
    <div className={styles.game}>
      <ChessBoard
        position={{
          fen: activePosition.fen,
          lastMove: activePosition.lastMove,
        }}
        transition={history.transition}
        onMove={handleMove}
      />
      <MoveNavigation
        canMoveBack={canMoveBack}
        canMoveForward={canMoveForward}
        onBack={showPreviousMove}
        onForward={showNextMove}
      />
    </div>
  );
}
