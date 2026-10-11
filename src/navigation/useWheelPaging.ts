import { useEffect } from "react";
import { getScrollRoot, scrollTopOf } from "../effects/scrollRoot";

const GESTURE_GAP_MS = 200;
const RISE_RATIO = 1.5;
const RISE_MIN_DELTA = 10;

// Chrome의 scrollTo({ behavior: "smooth" })를 한 화면 높이 거리에서 계측한 값
const PAGE_DURATION_MS = 690;
const pageEasing = cubicBezier(0.4, 0, 0, 1);

export function useWheelPaging() {
  useEffect(() => {
    const root = getScrollRoot();
    if (!root) return;

    let moving = false;
    let lastWheelAt = 0;
    let lastDelta = 0;
    let raf = 0;

    const finishMove = () => {
      cancelAnimationFrame(raf);
      moving = false;
      root.style.scrollSnapType = "";
    };

    const animateScrollTo = (target: number) => {
      const from = root.scrollTop;
      const distance = target - from;
      const startedAt = performance.now();

      moving = true;
      root.style.scrollSnapType = "none";

      const step = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / PAGE_DURATION_MS);
        root.scrollTop = from + distance * pageEasing(progress);

        if (progress < 1) {
          raf = requestAnimationFrame(step);
        } else {
          root.scrollTop = target;
          finishMove();
        }
      };
      raf = requestAnimationFrame(step);
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

      animateScrollTo(tops[target]);
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

    return () => {
      root.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(raf);
      root.style.scrollSnapType = "";
    };
  }, []);
}

function cubicBezier(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): (t: number) => number {
  const axis = (a: number, b: number, s: number) =>
    3 * (1 - s) * (1 - s) * s * a + 3 * (1 - s) * s * s * b + s * s * s;
  const slope = (a: number, b: number, s: number) =>
    3 * (1 - s) * (1 - s) * a + 6 * (1 - s) * s * (b - a) + 3 * s * s * (1 - b);

  return (t: number) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;

    let s = t;
    for (let i = 0; i < 8; i++) {
      const dx = slope(x1, x2, s);
      if (Math.abs(dx) < 1e-6) break;
      s -= (axis(x1, x2, s) - t) / dx;
    }

    let lo = 0;
    let hi = 1;
    s = Math.min(1, Math.max(0, s));
    for (let i = 0; i < 20 && Math.abs(axis(x1, x2, s) - t) > 1e-5; i++) {
      if (axis(x1, x2, s) < t) lo = s;
      else hi = s;
      s = (lo + hi) / 2;
    }

    return axis(y1, y2, s);
  };
}
