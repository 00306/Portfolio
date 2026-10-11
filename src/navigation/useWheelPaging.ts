import { useEffect } from "react";
import { getScrollRoot, scrollTopOf } from "../effects/scrollRoot";

const GESTURE_GAP_MS = 200;
const RISE_RATIO = 1.5;
const RISE_MIN_DELTA = 10;

// Chrome의 scrollTo({ behavior: "smooth" })를 한 화면 높이 거리에서 계측한 값
const PAGE_DURATION_MS = 690;
const PAGE_EASING = "cubic-bezier(0.4, 0, 0, 1)";

export function useWheelPaging() {
  useEffect(() => {
    const root = getScrollRoot();
    if (!root) return;

    let moving = false;
    let lastWheelAt = 0;
    let lastDelta = 0;
    let slides: Animation[] = [];

    const stopSlides = () => {
      slides.forEach((slide) => slide.cancel());
      slides = [];
    };

    const slideTo = (slots: HTMLElement[], target: number) => {
      const distance = target - root.scrollTop;

      moving = true;
      root.style.scrollSnapType = "none";

      slides = slots.map((slot) =>
        slot.animate(
          [
            { transform: "translateY(0)" },
            { transform: `translateY(${-distance}px)` },
          ],
          { duration: PAGE_DURATION_MS, easing: PAGE_EASING, fill: "forwards" }
        )
      );

      const current = slides;
      Promise.all(current.map((slide) => slide.finished))
        .then(() => {
          if (slides !== current) return;
          root.scrollTop = target;
          stopSlides();
          root.style.scrollSnapType = "";
          moving = false;
        })
        .catch(() => {});
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

      slideTo(slots, tops[target]);
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
      stopSlides();
      root.style.scrollSnapType = "";
    };
  }, []);
}
