import { useEffect, useRef, useState } from "react";
import { createPieceAnimation, type PieceAnimation } from "./piece-animation";
import type { BoardTransition } from "./types";

type UsePieceNavigationAnimationParams = {
  transition: BoardTransition;
};

export function usePieceNavigationAnimation({
  transition,
}: UsePieceNavigationAnimationParams) {
  const [pieceAnimation, setPieceAnimation] = useState<PieceAnimation | null>(
    null,
  );
  const animationIdRef = useRef(0);

  useEffect(() => {
    if (!transition) {
      setPieceAnimation(null);
      return;
    }

    animationIdRef.current += 1;
    const animationId = animationIdRef.current;

    setPieceAnimation(
      createPieceAnimation({
        animationId: String(animationId),
        color: transition.color,
        from: transition.from,
        to: transition.to,
        type: transition.type,
      }),
    );
  }, [transition]);

  return {
    clearPieceAnimation: () => setPieceAnimation(null),
    pieceAnimation,
  };
}
