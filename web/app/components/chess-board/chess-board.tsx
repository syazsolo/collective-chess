"use client";

import { type CSSProperties, useMemo, useRef, useState } from "react";
import {
  Chess,
  type Color,
  type Move,
  type Piece,
  type PieceSymbol,
  type Square,
} from "chess.js";
import { files, getSquare, getSquareColor, ranks } from "./board/board-geometry";
import { BoardSquare } from "./board/board-square";
import styles from "./board/chess-board.module.css";
import theme from "./board/chess-board-theme.module.css";
import { ChessPiece } from "./pieces/chess-piece";

type PieceAnimation = {
  color: Color;
  from: Square;
  id: number;
  to: Square;
  type: PieceSymbol;
};

function getPromotion(
  piece: Piece | undefined,
  target: Square,
): PieceSymbol | undefined {
  if (piece?.type !== "p") {
    return undefined;
  }

  return target.endsWith("8") || target.endsWith("1") ? "q" : undefined;
}

export function ChessBoard() {
  const animationIdRef = useRef(0);
  const [fen, setFen] = useState(() => new Chess().fen());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [lastMove, setLastMove] = useState<Pick<Move, "from" | "to"> | null>(
    null,
  );
  const [pieceAnimation, setPieceAnimation] = useState<PieceAnimation | null>(
    null,
  );

  const game = useMemo(() => new Chess(fen), [fen]);
  const isGameOver = game.isGameOver();
  const visualFiles = files;
  const visualRanks = [...ranks].reverse();

  const legalMoves = useMemo(() => {
    if (!selectedSquare) {
      return [];
    }

    return game.moves({ square: selectedSquare, verbose: true });
  }, [game, selectedSquare]);

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

  function getVisualPosition(square: Square) {
    const file = square[0] as (typeof files)[number];
    const rank = square[1] as (typeof ranks)[number];

    return {
      column: visualFiles.indexOf(file),
      row: visualRanks.indexOf(rank),
    };
  }

  function commitMove(from: Square, to: Square) {
    const nextGame = new Chess(fen);
    const piece = nextGame.get(from);

    try {
      const move = nextGame.move({
        from,
        promotion: getPromotion(piece, to),
        to,
      });

      setFen(nextGame.fen());
      setLastMove({ from: move.from, to: move.to });
      setSelectedSquare(null);
      animationIdRef.current += 1;
      setPieceAnimation({
        color: move.color,
        from: move.from,
        id: animationIdRef.current,
        to: move.to,
        type: piece?.type ?? move.piece,
      });
      return true;
    } catch {
      return false;
    }
  }

  function handleSquareClick(square: Square, piece: Piece | undefined) {
    if (selectedSquare && commitMove(selectedSquare, square)) {
      return;
    }

    if (piece?.color === game.turn()) {
      setSelectedSquare(square);
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
    setSelectedSquare(square);
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
            const isSelected = selectedSquare === square;
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
            key={pieceAnimation.id}
            onAnimationEnd={() => setPieceAnimation(null)}
            style={
              {
                "--from-column": getVisualPosition(pieceAnimation.from).column,
                "--from-row": getVisualPosition(pieceAnimation.from).row,
                "--to-column": getVisualPosition(pieceAnimation.to).column,
                "--to-row": getVisualPosition(pieceAnimation.to).row,
              } as CSSProperties
            }
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
