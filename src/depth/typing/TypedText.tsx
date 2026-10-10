import { useContext } from "react";
import { countTypingSteps, typeUpTo } from "./hangulTyping";
import { TypingProgressContext } from "./typingContext";

export function TypedText({ text }: { text: string }) {
  const progress = useContext(TypingProgressContext);
  const step = Math.round(progress * countTypingSteps(text));
  const { typed, rest } = typeUpTo(text, step);

  return (
    <>
      {typed}
      {rest && (
        <span className="typed-text-rest" aria-hidden="true">
          {rest}
        </span>
      )}
    </>
  );
}
