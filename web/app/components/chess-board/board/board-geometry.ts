import type { Square } from "chess.js";

export const files = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
export const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;

export function getSquare(file: string, rank: string): Square {
  return `${file}${rank}` as Square;
}

export function getSquareColor(square: Square) {
  const fileIndex = files.indexOf(square[0] as (typeof files)[number]);
  const rankIndex = ranks.indexOf(square[1] as (typeof ranks)[number]);

  return (fileIndex + rankIndex) % 2 === 1 ? "light" : "dark";
}
