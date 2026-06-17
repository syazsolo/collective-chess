import { renderHook, waitFor } from "@testing-library/react";
import type { Color, PieceSymbol, Square } from "chess.js";
import { describe, expect, test } from "vitest";
import { usePieceNavigationAnimation } from "./use-piece-navigation-animation";

type PieceTransition = {
  color: Color;
  from: Square;
  to: Square;
  type: PieceSymbol;
};

function renderAnimationHook({
  transition,
}: {
  transition: PieceTransition | null;
}) {
  return renderHook(
    ({ currentTransition }) =>
      usePieceNavigationAnimation({
        transition: currentTransition,
      }),
    {
      initialProps: {
        currentTransition: transition,
      },
    },
  );
}

describe("usePieceNavigationAnimation", () => {
  test("animates an explicit forward piece transition", async () => {
    const hook = renderAnimationHook({
      transition: null,
    });

    hook.rerender({
      currentTransition: { color: "w", from: "e2", to: "e4", type: "p" },
    });

    await waitFor(() =>
      expect(hook.result.current.pieceAnimation).toMatchObject({
        color: "w",
        from: "e2",
        to: "e4",
        type: "p",
      }),
    );
  });

  test("animates an explicit backward piece transition", async () => {
    const hook = renderAnimationHook({
      transition: null,
    });

    hook.rerender({
      currentTransition: { color: "b", from: "e5", to: "e7", type: "p" },
    });

    await waitFor(() =>
      expect(hook.result.current.pieceAnimation).toMatchObject({
        color: "b",
        from: "e5",
        to: "e7",
        type: "p",
      }),
    );
  });

  test("does not animate when no transition is provided", () => {
    const hook = renderAnimationHook({
      transition: null,
    });

    hook.rerender({
      currentTransition: null,
    });

    expect(hook.result.current.pieceAnimation).toBeNull();
  });
});
