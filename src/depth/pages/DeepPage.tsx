import type { ReactNode } from "react";
import type { DepthPageProps } from "../DepthPages";
import { TypedText } from "../typing/TypedText";
import { TypingProgressContext } from "../typing/typingContext";
import { useTypingProgress } from "../typing/useTypingProgress";
import "d2coding/d2coding-full.css";
import "../../styles/deepPage.css";

const TYPING_DURATION_MS = 1200;

interface DeepPageProps extends Pick<DepthPageProps, "onExit" | "phase"> {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}

export function DeepPage({
  onExit,
  phase,
  eyebrow,
  title,
  children,
}: DeepPageProps) {
  const progress = useTypingProgress(phase === "open", TYPING_DURATION_MS);

  return (
    <TypingProgressContext.Provider value={progress}>
      <div className="depth-page deep-page">
        <header className="deep-page-header">
          <p className="deep-page-eyebrow">
            <TypedText text={eyebrow} />
          </p>
          <h1 className="deep-page-title">
            <TypedText text={title} />
          </h1>
        </header>

        <div className="deep-page-body">{children}</div>

        <button type="button" className="depth-page-exit" onClick={onExit}>
          올라가기
        </button>
      </div>
    </TypingProgressContext.Provider>
  );
}
