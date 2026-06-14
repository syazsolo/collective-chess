import Image from "next/image";
import type { Color, PieceSymbol, Square } from "chess.js";
import styles from "./chess-piece.module.css";

type ChessPieceProps = {
  color: Color;
  draggable?: boolean;
  isMovable?: boolean;
  loading?: "eager" | "lazy";
  onDragStart?: (event: React.DragEvent<HTMLSpanElement>) => void;
  square?: Square;
  type: PieceSymbol;
};

function getPieceLabel(color: Color, type: PieceSymbol, square?: Square) {
  const colorName = color === "w" ? "white" : "black";
  const pieceNames: Record<PieceSymbol, string> = {
    b: "bishop",
    k: "king",
    n: "knight",
    p: "pawn",
    q: "queen",
    r: "rook",
  };

  return `${square ? `${square} ` : ""}${colorName} ${pieceNames[type]}`;
}

export function ChessPiece({
  color,
  draggable = false,
  isMovable = false,
  loading,
  onDragStart,
  square,
  type,
}: ChessPieceProps) {
  return (
    <span
      aria-label={getPieceLabel(color, type, square)}
      className={[styles.piece, isMovable ? styles.movable : ""]
        .filter(Boolean)
        .join(" ")}
      data-movable={isMovable}
      draggable={draggable}
      onDragStart={onDragStart}
      role="img"
    >
      <Image
        alt=""
        aria-hidden="true"
        className={styles.pieceImage}
        draggable={false}
        height={90}
        loading={loading}
        src={`/pieces/staunty/${color}${type.toUpperCase()}.svg`}
        width={90}
      />
    </span>
  );
}
