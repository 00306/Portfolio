import { useMemo } from "react";
import type { KeyboardEvent } from "react";

interface PressableOptions {
  onPress: () => void;
  className?: string;
}

export function usePressable({ onPress, className }: PressableOptions) {
  return useMemo(
    () => ({
      className: ["pressable", className].filter(Boolean).join(" "),
      role: "button" as const,
      tabIndex: 0,

      onClick: () => {
        onPress();
      },

      onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        onPress();
      },
    }),
    [onPress, className]
  );
}
