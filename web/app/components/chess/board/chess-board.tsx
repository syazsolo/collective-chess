"use client";

import { useMemo, useState } from "react";
import { Chess, type Piece, type Square } from "chess.js";
import { ChessPiece } from "../pieces/chess-piece";
import {
  getSquare,
  getSquareColor,
  visualFiles,
  visualRanks,
} from "./board-geometry";
import { BoardSquare } from "./board-square";
import styles from "./chess-board.module.css";
import theme from "./chess-board-theme.module.css";
import { tryCreateBoardMove } from "./move-utils";
import { getPieceAnimationStyle } from "./piece-animation";
import type { ChessBoardProps, SelectedSquare } from "./types";
import { usePieceNavigationAnimation } from "./use-piece-navigation-animation";

export function ChessBoard({ position, transition, onMove }: ChessBoardProps) {
  const { fen, lastMove } = position;
  const [selectedSquare, setSelectedSquare] = useState<SelectedSquare | null>(
    null,
  );

  const game = useMemo(() => new Chess(fen), [fen]);
  const isGameOver = game.isGameOver();
  const activeSelectedSquare =
    selectedSquare?.fen === fen ? selectedSquare.square : null;
  const { clearPieceAnimation, pieceAnimation } = usePieceNavigationAnimation({
    transition,
  });

  const legalMoves = useMemo(() => {
    if (!activeSelectedSquare) {
      return [];
    }

    return game.moves({ square: activeSelectedSquare, verbose: true });
  }, [game, activeSelectedSquare]);

  const legalTargets = useMemo(
    () => new Set(legalMoves.map((move) => move.to)),
    [legalMoves],
  );
  const captureTargets = useMemo(
    () =>
      new Set(
        legalMoves.filter((move) => move.isCapture()).map((move) => move.to),
      ),
    [legalMoves],
  );

  function commitMove(from: Square, to: Square) {
    const result = tryCreateBoardMove(fen, from, to);

    if (!result) {
      return false;
    }

    onMove(result.fen, result.move);
    setSelectedSquare(null);
    return true;
  }

  function handleSquareClick(square: Square, piece: Piece | undefined) {
    if (activeSelectedSquare && commitMove(activeSelectedSquare, square)) {
      return;
    }

    if (piece?.color === game.turn()) {
      setSelectedSquare({ fen, square });
      return;
    }

    setSelectedSquare(null);
  }

  function handleDragStart(
    event: React.DragEvent<HTMLSpanElement>,
    square: Square,
  ) {
    event.dataTransfer.setData("text/plain", square);
    event.dataTransfer.effectAllowed = "move";
    setSelectedSquare({ fen, square });
  }

  function handleDrop(
    event: React.DragEvent<HTMLButtonElement>,
    square: Square,
  ) {
    event.preventDefault();
    const from = event.dataTransfer.getData("text/plain") as Square;

    if (from && from !== square) {
      commitMove(from, square);
    }
  }

  return (
    <section
      className={[styles.surface, theme.classicGreen].join(" ")}
      aria-label="Interactive chess board"
    >
      <div className={styles.board} role="grid" aria-label="Chess board">
        {visualRanks.map((rank) =>
          visualFiles.map((file) => {
            const square = getSquare(file, rank);
            const piece = game.get(square);
            const isSelected = activeSelectedSquare === square;
            const isLastMove =
              lastMove?.from === square || lastMove?.to === square;
            const isLegalTarget = legalTargets.has(square);
            const isCaptureTarget = captureTargets.has(square);
            const canMovePiece = Boolean(
              piece && piece.color === game.turn() && !isGameOver,
            );

            return (
              <BoardSquare
                canMovePiece={canMovePiece}
                file={file}
                isAnimationDestination={pieceAnimation?.to === square}
                isCaptureTarget={isCaptureTarget}
                isLastMove={isLastMove}
                isLegalTarget={isLegalTarget}
                isSelected={isSelected}
                key={square}
                onClick={() => handleSquareClick(square, piece)}
                onDragOver={(event) => event.preventDefault()}
                onDragStart={(event) => handleDragStart(event, square)}
                onDrop={(event) => handleDrop(event, square)}
                piece={piece}
                rank={rank}
                showFileCoordinate={
                  rank === visualRanks[visualRanks.length - 1]
                }
                showRankCoordinate={file === visualFiles[0]}
                square={square}
                squareColor={getSquareColor(square)}
              />
            );
          }),
        )}
        {pieceAnimation ? (
          <span
            aria-hidden="true"
            className={styles.animatedPiece}
            key={pieceAnimation.key}
            onAnimationEnd={clearPieceAnimation}
            style={getPieceAnimationStyle(pieceAnimation)}
          >
            <ChessPiece
              color={pieceAnimation.color}
              type={pieceAnimation.type}
            />
          </span>
        ) : null}
      </div>
    </section>
  );
}
