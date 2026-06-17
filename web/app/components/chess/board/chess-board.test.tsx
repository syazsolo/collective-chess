import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Chess } from "chess.js";
import { describe, expect, test, vi } from "vitest";
import { ChessBoard } from "./chess-board";
import styles from "./chess-board.module.css";
import type { BoardMove, BoardNavigationMove, ChessBoardProps } from "./types";

function createMoveHandler() {
  return vi.fn<(fen: string, move: BoardMove) => void>();
}

function renderBoard({
  fen = new Chess().fen(),
  lastMove = null,
  moveIndex = 0,
  onMove = createMoveHandler(),
}: {
  fen?: string;
  lastMove?: BoardNavigationMove | null;
  moveIndex?: number;
  onMove?: ChessBoardProps["onMove"];
} = {}) {
  render(
    <ChessBoard
      position={{ fen, lastMove, moveIndex }}
      onMove={onMove}
    />,
  );

  return { onMove };
}

async function clickSquare(square: string) {
  const user = userEvent.setup();
  await user.click(screen.getByRole("gridcell", { name: new RegExp(`^${square}`) }));
}

function dragPiece(from: string, to: string) {
  const data = new Map<string, string>();
  const dataTransfer = {
    effectAllowed: "",
    getData: (key: string) => data.get(key) ?? "",
    setData: (key: string, value: string) => data.set(key, value),
  };

  fireEvent.dragStart(
    screen.getByRole("img", { name: new RegExp(`^${from}`) }),
    { dataTransfer },
  );
  fireEvent.drop(screen.getByRole("gridcell", { name: new RegExp(`^${to}`) }), {
    dataTransfer,
  });
}

describe("ChessBoard", () => {
  test("renders pieces from the provided FEN", () => {
    renderBoard();

    expect(screen.getByRole("gridcell", { name: "e2 white p" }))
      .toBeInTheDocument();
    expect(screen.getByRole("gridcell", { name: "e4" })).toBeInTheDocument();
  });

  test("creates a legal move from the currently displayed position", async () => {
    const onMove = createMoveHandler();
    renderBoard({ onMove });

    await clickSquare("e2");
    await clickSquare("e4");

    expect(onMove).toHaveBeenCalledTimes(1);
    expect(onMove.mock.calls[0][1]).toMatchObject({
      color: "w",
      from: "e2",
      piece: "p",
      to: "e4",
    });
  });

  test("creates a legal drag/drop move from the currently displayed position", () => {
    const onMove = createMoveHandler();
    renderBoard({ onMove });

    dragPiece("e2", "e4");

    expect(onMove).toHaveBeenCalledTimes(1);
    expect(onMove.mock.calls[0][1]).toMatchObject({
      color: "w",
      from: "e2",
      piece: "p",
      to: "e4",
    });
  });

  test("does not create an illegal move", async () => {
    const onMove = createMoveHandler();
    renderBoard({ onMove });

    await clickSquare("e2");
    await clickSquare("e5");

    expect(onMove).not.toHaveBeenCalled();
  });

  test("uses the visible FEN to decide whose turn it is after navigation", async () => {
    const game = new Chess();
    game.move("e4");
    game.move("e5");
    const onMove = createMoveHandler();
    renderBoard({ fen: game.fen(), moveIndex: 2, onMove });

    await clickSquare("d2");
    await clickSquare("d4");

    expect(onMove).toHaveBeenCalledTimes(1);
    expect(onMove.mock.calls[0][1]).toMatchObject({ from: "d2", to: "d4" });
  });

  test("rejects moving the opponent piece after navigation", async () => {
    const game = new Chess();
    game.move("e4");
    game.move("e5");
    const onMove = createMoveHandler();
    renderBoard({ fen: game.fen(), moveIndex: 2, onMove });

    await clickSquare("e5");
    await clickSquare("e4");

    expect(onMove).not.toHaveBeenCalled();
  });

  test("marks the last move squares for the displayed position", () => {
    renderBoard({
      lastMove: { from: "e7", to: "e5" },
      moveIndex: 2,
    });

    expect(screen.getByRole("gridcell", { name: /^e7/ }))
      .toHaveClass(styles.lastMoveSquare);
    expect(screen.getByRole("gridcell", { name: /^e5/ }))
      .toHaveClass(styles.lastMoveSquare);
  });
});
