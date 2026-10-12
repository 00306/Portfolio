import { useCallback, useEffect, useState } from "react";
import type { DepthId } from "./DepthPages";

export type DepthPhase =
  | "idle"
  | "entering"
  | "suspended"
  | "open"
  | "exiting"
  | "surfacing"
  | "returning";

const BLACK_HOLD_MS = 400;
const TRANSITION_MS = 1000;
const SETTLE_GRACE_MS = 300;

interface DepthState {
  stack: DepthId[];
  phase: DepthPhase;
  pending: DepthId | null;
  touchesSurface: boolean;
}

const INITIAL: DepthState = {
  stack: [],
  phase: "idle",
  pending: null,
  touchesSurface: true,
};

export function useDepth() {
  const [state, setState] = useState<DepthState>(INITIAL);

  const enter = useCallback((id: DepthId) => {
    setState((prev) => {
      if (prev.phase !== "idle" && prev.phase !== "open") return prev;
      return {
        ...prev,
        phase: "entering",
        pending: id,
        touchesSurface: prev.stack.length === 0,
      };
    });
  }, []);

  const exit = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== "open") return prev;
      return {
        ...prev,
        phase: "exiting",
        touchesSurface: prev.stack.length === 1,
      };
    });
  }, []);

  const settle = useCallback(() => {
    setState((prev) => {
      if (prev.phase === "entering" && prev.pending) {
        return {
          ...prev,
          phase: "suspended",
          stack: [...prev.stack, prev.pending],
          pending: null,
        };
      }
      if (prev.phase === "exiting") {
        return { ...prev, phase: "surfacing", stack: prev.stack.slice(0, -1) };
      }
      if (prev.phase === "returning") return INITIAL;
      return prev;
    });
  }, []);

  const { phase } = state;

  useEffect(() => {
    if (phase !== "suspended" && phase !== "surfacing") return;

    const timer = window.setTimeout(() => {
      setState((prev) => {
        if (prev.phase !== phase) return prev;
        if (prev.phase === "suspended") return { ...prev, phase: "open" };
        return {
          ...prev,
          phase: prev.stack.length > 0 ? "open" : "returning",
        };
      });
    }, BLACK_HOLD_MS);

    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "entering" && phase !== "exiting" && phase !== "returning") {
      return;
    }

    const timer = window.setTimeout(settle, TRANSITION_MS + SETTLE_GRACE_MS);
    return () => window.clearTimeout(timer);
  }, [phase, settle]);

  const topId = state.stack[state.stack.length - 1] ?? null;

  const surfacePhase: DepthPhase = state.touchesSurface ? phase : "open";

  return { ...state, topId, surfacePhase, enter, exit, settle };
}
