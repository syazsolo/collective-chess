import { useEffect, useRef, useState } from "react";
import type { Chess } from "chess.js";
import {
  createPieceAnimation,
  type PieceAnimation,
} from "./piece-animation";
import type { ChessBoardPosition } from "./types";

type UsePieceNavigationAnimationParams = ChessBoardPosition & {
  game: Chess;
};

export function usePieceNavigationAnimation({
  fen,
  game,
  lastMove,
  moveIndex,
}: UsePieceNavigationAnimationParams) {
  const [pieceAnimation, setPieceAnimation] =
    useState<PieceAnimation | null>(null);
  const previousRenderedPositionRef = useRef<ChessBoardPosition | null>(null);

  useEffect(() => {
    const previousPosition = previousRenderedPositionRef.current;
    previousRenderedPositionRef.current = { fen, lastMove, moveIndex };

    if (!previousPosition || previousPosition.fen === fen) {
      return;
    }

    const moveIndexDelta = moveIndex - previousPosition.moveIndex;

    if (Math.abs(moveIndexDelta) !== 1) {
      setPieceAnimation(null);
      return;
    }

    const isForwardNavigation = moveIndexDelta > 0;
    const move = isForwardNavigation ? lastMove : previousPosition.lastMove;

    if (!move) {
      setPieceAnimation(null);
      return;
    }

    const from = isForwardNavigation ? move.from : move.to;
    const to = isForwardNavigation ? move.to : move.from;
    const piece = game.get(to);

    setPieceAnimation(
      piece
        ? createPieceAnimation({
            color: piece.color,
            fen,
            from,
            to,
            type: piece.type,
          })
        : null,
    );
  }, [fen, game, lastMove, moveIndex]);

  return {
    clearPieceAnimation: () => setPieceAnimation(null),
    pieceAnimation: pieceAnimation?.fen === fen ? pieceAnimation : null,
  };
}
