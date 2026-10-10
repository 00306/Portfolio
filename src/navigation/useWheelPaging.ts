import { useEffect } from "react";
import { getScrollRoot, scrollTopOf } from "../effects/scrollRoot";

const GESTURE_GAP_MS = 200;
const RISE_RATIO = 1.5;
const RISE_MIN_DELTA = 10;
const MOVE_FALLBACK_MS = 900;

export function useWheelPaging() {
  useEffect(() => {
    const root = getScrollRoot();
    if (!root) return;

    let moving = false;
    let lastWheelAt = 0;
    let lastDelta = 0;
    let fallbackTimer = 0;

    const finishMove = () => {
      if (!moving) return;
      moving = false;
      window.clearTimeout(fallbackTimer);
      root.style.scrollSnapType = "";
    };

    const moveBy = (direction: 1 | -1) => {
      const slots = Array.from(
        root.querySelectorAll<HTMLElement>("[data-section]")
      );
      const tops = slots.map((slot) => scrollTopOf(root, slot));

      let current = 0;
      tops.forEach((top, i) => {
        if (
          Math.abs(top - root.scrollTop) <
          Math.abs(tops[current] - root.scrollTop)
        ) {
          current = i;
        }
      });
      const target = current + direction;
      if (target < 0 || target >= slots.length) return;

      moving = true;
      root.style.scrollSnapType = "none";
      root.scrollTo({ top: tops[target], behavior: "smooth" });
      fallbackTimer = window.setTimeout(finishMove, MOVE_FALLBACK_MS);
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
        return;
      }
      if (root.classList.contains("is-submerged")) return;

      event.preventDefault();

      const now = performance.now();
      const delta = Math.abs(event.deltaY);
      const isNewGesture =
        now - lastWheelAt > GESTURE_GAP_MS ||
        (delta >= RISE_MIN_DELTA && delta > lastDelta * RISE_RATIO);
      lastWheelAt = now;
      lastDelta = delta;

      if (moving || !isNewGesture) return;
      moveBy(event.deltaY > 0 ? 1 : -1);
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("scrollend", finishMove);

    return () => {
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("scrollend", finishMove);
      window.clearTimeout(fallbackTimer);
      root.style.scrollSnapType = "";
    };
  }, []);
}
