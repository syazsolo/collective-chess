import {
  Chess,
  type Move,
  type Piece,
  type PieceSymbol,
  type Square,
} from "chess.js";
import type { BoardMove } from "./types";

// TODO: Handle promotions to pieces other than queen (e.g. by showing a promotion choice UI when a pawn reaches the last rank)
function getPromotion(
  piece: Piece | undefined,
  target: Square,
): PieceSymbol | undefined {
  if (piece?.type !== "p") {
    return undefined;
  }

  return target.endsWith("8") || target.endsWith("1") ? "q" : undefined;
}

export function toBoardMove(move: Move): BoardMove {
  return {
    color: move.color,
    from: move.from,
    piece: move.piece,
    to: move.to,
  };
}

export function tryCreateBoardMove(fen: string, from: Square, to: Square) {
  const game = new Chess(fen);
  const piece = game.get(from);

  try {
    const move = game.move({
      from,
      promotion: getPromotion(piece, to),
      to,
    });

    return {
      fen: game.fen(),
      move: toBoardMove(move),
    };
  } catch {
    return null;
  }
}
