import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { ChessGame } from "./chess-game";

async function clickSquare(square: string) {
  const user = userEvent.setup();
  await user.click(screen.getByRole("gridcell", { name: new RegExp(`^${square}`) }));
}

async function playMove(from: string, to: string) {
  await clickSquare(from);
  await clickSquare(to);
}

function dragMove(from: string, to: string) {
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

function previousMoveButton() {
  return screen.getByRole("button", { name: "Show previous move" });
}

function nextMoveButton() {
  return screen.getByRole("button", { name: "Show next move" });
}

describe("ChessGame history and board integration", () => {
  test("cuts off old future history when a new move is made after going back", async () => {
    const user = userEvent.setup();
    render(<ChessGame />);

    await playMove("e2", "e4");
    await playMove("e7", "e5");
    await playMove("g1", "f3");
    expect(previousMoveButton()).toBeEnabled();
    expect(nextMoveButton()).toBeDisabled();

    await user.click(previousMoveButton());
    expect(previousMoveButton()).toBeEnabled();
    expect(nextMoveButton()).toBeEnabled();

    await playMove("d2", "d4");

    expect(previousMoveButton()).toBeEnabled();
    expect(nextMoveButton()).toBeDisabled();
    expect(screen.getByRole("gridcell", { name: "d4 white p" }))
      .toBeInTheDocument();
    expect(screen.getByRole("gridcell", { name: "f3" })).toBeInTheDocument();
    expect(screen.getByRole("gridcell", { name: "g1 white n" }))
      .toBeInTheDocument();
  });

  test("cuts off old future history when a replacement move is made by drag/drop", async () => {
    const user = userEvent.setup();
    render(<ChessGame />);

    await playMove("e2", "e4");
    await playMove("e7", "e5");
    await playMove("g1", "f3");

    await user.click(previousMoveButton());
    dragMove("d2", "d4");

    expect(previousMoveButton()).toBeEnabled();
    expect(nextMoveButton()).toBeDisabled();
    expect(screen.getByRole("gridcell", { name: "d4 white p" }))
      .toBeInTheDocument();
    expect(screen.getByRole("gridcell", { name: "f3" })).toBeInTheDocument();
  });

  test("keeps existing future history when only navigating back and forward", async () => {
    const user = userEvent.setup();
    render(<ChessGame />);

    await playMove("e2", "e4");
    await playMove("e7", "e5");
    await playMove("g1", "f3");

    await user.click(previousMoveButton());
    expect(previousMoveButton()).toBeEnabled();
    expect(nextMoveButton()).toBeEnabled();

    await user.click(nextMoveButton());

    expect(previousMoveButton()).toBeEnabled();
    expect(nextMoveButton()).toBeDisabled();
    expect(screen.getByRole("gridcell", { name: "f3 white n" }))
      .toBeInTheDocument();
  });

  test("applies a new move to the currently displayed board, not the old latest board", async () => {
    const user = userEvent.setup();
    render(<ChessGame />);

    await playMove("e2", "e4");
    await playMove("e7", "e5");
    await playMove("g1", "f3");
    await user.click(previousMoveButton());

    await playMove("d2", "d4");

    expect(screen.getByRole("gridcell", { name: "d4 white p" }))
      .toBeInTheDocument();
    expect(screen.getByRole("gridcell", { name: "f3" })).toBeInTheDocument();
  });

  test("back parity after White, Black, White makes White able to move after one Back", async () => {
    const user = userEvent.setup();
    render(<ChessGame />);

    await playMove("e2", "e4");
    await playMove("e7", "e5");
    await playMove("g1", "f3");

    await user.click(previousMoveButton());
    await playMove("d2", "d4");

    expect(screen.getByRole("gridcell", { name: "d4 white p" }))
      .toBeInTheDocument();
  });

  test("back parity after White, Black, White makes Black able to move after two Backs", async () => {
    const user = userEvent.setup();
    render(<ChessGame />);

    await playMove("e2", "e4");
    await playMove("e7", "e5");
    await playMove("g1", "f3");

    await user.click(previousMoveButton());
    await user.click(previousMoveButton());
    await playMove("b8", "c6");

    expect(screen.getByRole("gridcell", { name: "c6 black n" }))
      .toBeInTheDocument();
  });
});
