import type { Move, Square } from "chess.js";

export type SelectedSquare = {
  fen: string;
  square: Square;
};

export type BoardMove = Pick<Move, "color" | "from" | "piece" | "to">;
export type BoardNavigationMove = Pick<Move, "from" | "to">;

export type ChessBoardPosition = {
  fen: string;
  lastMove: BoardNavigationMove | null;
  moveIndex: number;
};

export type ChessBoardProps = {
  position: ChessBoardPosition;
  onMove: (fen: string, move: BoardMove) => void;
};
