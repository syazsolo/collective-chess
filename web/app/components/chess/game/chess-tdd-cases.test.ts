import { describe, test } from "vitest";

describe("TDD case list: history cutting", () => {
  test.todo("new move after Back deletes future history");
  test.todo("cutting works from deep history");
  test.todo("cutting keeps earlier history");
  test.todo("cutting does not happen when only navigating");
});

describe("TDD case list: board position", () => {
  test.todo("Back shows the previous board position");
  test.todo("Forward shows the next board position");
  test.todo("new move starts from the currently displayed board");
  test.todo("board does not change after illegal move");
});

describe("TDD case list: turn logic", () => {
  test.todo("Back once after White, Black, White makes it White to move");
  test.todo("Back twice after White, Black, White makes it Black to move");
  test.todo("cannot move opponent piece after navigation");
  test.todo("turn updates after replacement move");
});

describe("TDD case list: navigation buttons", () => {
  test.todo("Back disabled at initial position");
  test.todo("Forward disabled at latest position");
  test.todo("Forward enabled after going back");
  test.todo("Forward disabled after making replacement move");
  test.todo("Back remains enabled after replacement move");
});

describe("TDD case list: move counter", () => {
  test.todo("initial counter is 0 / 0");
  test.todo("counter increases after each move");
  test.todo("counter decreases when going back");
  test.todo("counter increases when going forward");
  test.todo("counter resets max after cutting history");
});

describe("TDD case list: selection and interaction", () => {
  test.todo("selected square clears after successful move");
  test.todo("selected square clears when board position changes");
  test.todo("legal target markers match current position");
  test.todo("capture markers match current position");
});

describe("TDD case list: last move highlight", () => {
  test.todo("last move highlight appears after a move");
  test.todo("Back highlights the move that led to the displayed position");
  test.todo("initial position has no last move highlight");
  test.todo("replacement move gets new highlight");
});

describe("TDD case list: animation", () => {
  test.todo("Forward navigation animates piece forward");
  test.todo("Back navigation animates piece backward");
  test.todo("large jump does not animate");
  test.todo("replacement move animation uses replacement move");
});

describe("TDD case list: game rules", () => {
  test.todo("promotion still works after navigation");
  test.todo("castling still works after navigation");
  test.todo("en passant still works after navigation");
  test.todo("check and checkmate state follow the current board");
});
