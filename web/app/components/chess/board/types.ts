import type { Move, Square } from "chess.js";

export type SelectedSquare = {
  fen: string;
  square: Square;
};

export type BoardMove = Pick<Move, "color" | "from" | "piece" | "to">;
export type BoardNavigationMove = Pick<Move, "from" | "to">;
export type BoardTransition =
  | (BoardNavigationMove & Pick<Move, "color"> & { type: Move["piece"] })
  | null;

export type ChessBoardPosition = {
  fen: string;
  lastMove: BoardNavigationMove | null;
};

export type ChessBoardProps = {
  position: ChessBoardPosition;
  transition: BoardTransition;
  onMove: (fen: string, move: BoardMove) => void;
};
