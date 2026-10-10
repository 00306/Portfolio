import { setTextRect, toTextRect } from "./textRect";
import { getScrollRoot } from "./scrollRoot";

const SELECTOR = ".hero-block";

export function startHeroRectTracking(): () => void {
  const measure = () => {
    const el = document.querySelector<HTMLElement>(SELECTOR);
    if (!el) {
      setTextRect(null);
      return;
    }
    setTextRect(toTextRect(el.getBoundingClientRect(), getScrollRoot()));
  };

  measure();

  const el = document.querySelector<HTMLElement>(SELECTOR);
  const observer = new ResizeObserver(measure);
  if (el) observer.observe(el);

  window.addEventListener("resize", measure);
  document.fonts?.ready.then(measure);

  return () => {
    observer.disconnect();
    window.removeEventListener("resize", measure);
    setTextRect(null);
  };
}
