import type { Square } from "chess.js";

export const files = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
export const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;
export const visualFiles = files;
export const visualRanks = [...ranks].reverse();

type BoardFile = (typeof files)[number];
type BoardRank = (typeof ranks)[number];

export function getSquare(file: string, rank: string): Square {
  return `${file}${rank}` as Square;
}

export function getVisualPosition(square: Square) {
  const file = square[0] as BoardFile;
  const rank = square[1] as BoardRank;

  return {
    column: visualFiles.indexOf(file),
    row: visualRanks.indexOf(rank),
  };
}

export function getSquareColor(square: Square) {
  const fileIndex = files.indexOf(square[0] as BoardFile);
  const rankIndex = ranks.indexOf(square[1] as BoardRank);

  return (fileIndex + rankIndex) % 2 === 1 ? "light" : "dark";
}
