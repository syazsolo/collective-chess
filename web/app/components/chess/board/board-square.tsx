import type { Piece, Square } from "chess.js";
import { ChessPiece } from "../pieces/chess-piece";
import styles from "./chess-board.module.css";

type BoardSquareProps = {
  canMovePiece: boolean;
  file: string;
  isAnimationDestination: boolean;
  isCaptureTarget: boolean;
  isLastMove: boolean;
  isLegalTarget: boolean;
  isSelected: boolean;
  onClick: () => void;
  onDragOver: (event: React.DragEvent<HTMLButtonElement>) => void;
  onDragStart: (event: React.DragEvent<HTMLSpanElement>) => void;
  onDrop: (event: React.DragEvent<HTMLButtonElement>) => void;
  piece: Piece | undefined;
  rank: string;
  showFileCoordinate: boolean;
  showRankCoordinate: boolean;
  square: Square;
  squareColor: "light" | "dark";
};

export function BoardSquare({
  canMovePiece,
  file,
  isAnimationDestination,
  isCaptureTarget,
  isLastMove,
  isLegalTarget,
  isSelected,
  onClick,
  onDragOver,
  onDragStart,
  onDrop,
  piece,
  rank,
  showFileCoordinate,
  showRankCoordinate,
  square,
  squareColor,
}: BoardSquareProps) {
  return (
    <button
      aria-label={`${square}${piece ? ` ${piece.color === "w" ? "white" : "black"} ${piece.type}` : ""}`}
      className={[
        styles.square,
        squareColor === "light" ? styles.lightSquare : styles.darkSquare,
        isSelected ? styles.selectedSquare : "",
        isLastMove ? styles.lastMoveSquare : "",
        isLegalTarget ? styles.legalTargetSquare : "",
        isCaptureTarget ? styles.captureTargetSquare : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-square={square}
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
      role="gridcell"
      type="button"
    >
      {showRankCoordinate ? (
        <span className={styles.rankCoordinate}>{rank}</span>
      ) : null}
      {showFileCoordinate ? (
        <span className={styles.fileCoordinate}>{file}</span>
      ) : null}
      {isLegalTarget ? (
        <span className={styles.moveMarker} aria-hidden="true" />
      ) : null}
      {piece && !isAnimationDestination ? (
        <ChessPiece
          color={piece.color}
          draggable={canMovePiece}
          isMovable={canMovePiece}
          loading="eager"
          onDragStart={onDragStart}
          square={square}
          type={piece.type}
        />
      ) : null}
    </button>
  );
}
