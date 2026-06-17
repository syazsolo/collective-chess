import type { CSSProperties } from "react";
import type { Color, PieceSymbol, Square } from "chess.js";
import { getVisualPosition } from "./board-geometry";

export type PieceAnimation = {
  color: Color;
  from: Square;
  key: string;
  to: Square;
  type: PieceSymbol;
};

export function createPieceAnimation({
  animationId,
  color,
  from,
  to,
  type,
}: Omit<PieceAnimation, "key"> & { animationId: string }): PieceAnimation {
  return {
    color,
    from,
    key: `${animationId}:${from}:${to}`,
    to,
    type,
  };
}

export function getPieceAnimationStyle(
  animation: PieceAnimation,
): CSSProperties {
  const from = getVisualPosition(animation.from);
  const to = getVisualPosition(animation.to);

  return {
    "--from-column": from.column,
    "--from-row": from.row,
    "--to-column": to.column,
    "--to-row": to.row,
  } as CSSProperties;
}
