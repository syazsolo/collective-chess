import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { MoveNavigation } from "./move-navigation";

describe("MoveNavigation", () => {
  test("disables Back at the initial position", () => {
    render(
      <MoveNavigation
        canMoveBack={false}
        canMoveForward={false}
        onBack={vi.fn()}
        onForward={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Show previous move" }))
      .toBeDisabled();
  });

  test("disables Forward at the latest position", () => {
    render(
      <MoveNavigation
        canMoveBack={true}
        canMoveForward={false}
        onBack={vi.fn()}
        onForward={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Show next move" }))
      .toBeDisabled();
  });

  test("enables Forward after going back while old history still exists", () => {
    render(
      <MoveNavigation
        canMoveBack={true}
        canMoveForward={true}
        onBack={vi.fn()}
        onForward={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Show next move" }))
      .toBeEnabled();
  });

  test("clicking Back calls onBack", async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();

    render(
      <MoveNavigation
        canMoveBack={true}
        canMoveForward={false}
        onBack={onBack}
        onForward={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Show previous move" }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  test("clicking Forward calls onForward", async () => {
    const user = userEvent.setup();
    const onForward = vi.fn();

    render(
      <MoveNavigation
        canMoveBack={true}
        canMoveForward={true}
        onBack={vi.fn()}
        onForward={onForward}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Show next move" }));

    expect(onForward).toHaveBeenCalledTimes(1);
  });
});
