const SCROLL_ROOT_SELECTOR = ".snap-container";
const SECTION_SELECTOR = "[data-section]";

export function getScrollRoot(): HTMLElement | null {
  return document.querySelector<HTMLElement>(SCROLL_ROOT_SELECTOR);
}

export function scrollTopOf(root: HTMLElement, el: HTMLElement): number {
  return (
    el.getBoundingClientRect().top -
    root.getBoundingClientRect().top +
    root.scrollTop
  );
}

export function getScrollOrigin(root: HTMLElement): number {
  const first = root.querySelector<HTMLElement>(SECTION_SELECTOR);
  return first ? scrollTopOf(root, first) : 0;
}

export function getWorldScroll(root: HTMLElement): number {
  return root.scrollTop - getScrollOrigin(root);
}
