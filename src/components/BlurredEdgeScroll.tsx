import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type UIEvent,
} from "react";
import "../styles/blurredEdgeScroll.css";

interface BlurredEdgeScrollProps {
  children: ReactNode;
  className?: string;
  showIndicator?: boolean;
}

type IndicatorThumb = { size: number; offset: number };

function measureThumb(element: HTMLElement): IndicatorThumb | null {
  const { scrollHeight, clientHeight, scrollTop } = element;
  if (scrollHeight <= clientHeight + 1) return null;
  return {
    size: clientHeight / scrollHeight,
    offset: scrollTop / scrollHeight,
  };
}

export function BlurredEdgeScroll({
  children,
  className,
  showIndicator = false,
}: BlurredEdgeScrollProps) {
  const blurredContentRef = useRef<HTMLDivElement>(null);
  const sharpRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<IndicatorThumb | null>(null);

  useEffect(() => {
    const sharp = sharpRef.current;
    if (!showIndicator || !sharp) return;

    const update = () => setThumb(measureThumb(sharp));
    update();

    const observer = new ResizeObserver(update);
    observer.observe(sharp);
    Array.from(sharp.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [showIndicator, children]);

  const followScroll = (event: UIEvent<HTMLDivElement>) => {
    const sharp = event.currentTarget;
    const blurredContent = blurredContentRef.current;
    if (blurredContent) {
      blurredContent.style.transform = `translateY(${-sharp.scrollTop}px)`;
    }
    if (showIndicator) setThumb(measureThumb(sharp));
  };

  const contentClass = className ? ` ${className}` : "";

  return (
    <div className="blurred-edge-scroll">
      <div className="blurred-edge-scroll-blurred" aria-hidden="true">
        <div
          ref={blurredContentRef}
          className={`blurred-edge-scroll-blurred-content${contentClass}`}
        >
          {children}
        </div>
      </div>
      <div
        ref={sharpRef}
        className={`blurred-edge-scroll-sharp${contentClass}`}
        onScroll={followScroll}
      >
        {children}
      </div>

      {showIndicator && thumb && (
        <div className="blurred-edge-scroll-indicator" aria-hidden="true">
          <div
            className="blurred-edge-scroll-thumb"
            style={
              {
                top: `${thumb.offset * 100}%`,
                height: `${thumb.size * 100}%`,
              } as CSSProperties
            }
          />
        </div>
      )}
    </div>
  );
}
