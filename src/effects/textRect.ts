import { getScrollOrigin } from "./scrollRoot";

type TextRect = {
  x: number;
  y: number;
  halfW: number;
  halfH: number;
};

let current: TextRect | null = null;

export function setTextRect(rect: TextRect | null): void {
  current = rect;
}

export function getTextRect(): TextRect | null {
  return current;
}

export function toTextRect(
  box: DOMRect,
  scrollRoot: HTMLElement | null
): TextRect {
  const w = window.innerWidth;
  const h = window.innerHeight;

  const top = scrollRoot
    ? box.top -
      scrollRoot.getBoundingClientRect().top +
      scrollRoot.scrollTop -
      getScrollOrigin(scrollRoot)
    : box.top;

  return {
    x: (box.left + box.width * 0.5) / w,
    y: 1 - (top + box.height * 0.5) / h,
    halfW: (box.width * 0.5) / w,
    halfH: (box.height * 0.5) / h,
  };
}
