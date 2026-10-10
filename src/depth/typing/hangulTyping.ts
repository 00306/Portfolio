const SYLLABLE_START = 0xac00;
const SYLLABLE_END = 0xd7a3;

const INITIAL_JAMO = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";

const VOWEL_FIRST: Record<number, number> = {
  9: 8,
  10: 8,
  11: 8,
  14: 13,
  15: 13,
  16: 13,
  19: 18,
};

const FINAL_FIRST: Record<number, number> = {
  3: 1,
  5: 4,
  6: 4,
  9: 8,
  10: 8,
  11: 8,
  12: 8,
  13: 8,
  14: 8,
  15: 8,
  18: 17,
};

function compose(initial: number, vowel: number, final: number) {
  return String.fromCharCode(
    SYLLABLE_START + (initial * 21 + vowel) * 28 + final
  );
}

function typingStates(char: string): string[] {
  const code = char.charCodeAt(0);
  if (code < SYLLABLE_START || code > SYLLABLE_END) return [char];

  const index = code - SYLLABLE_START;
  const initial = Math.floor(index / 588);
  const vowel = Math.floor((index % 588) / 28);
  const final = index % 28;

  const states = [INITIAL_JAMO[initial]];
  if (VOWEL_FIRST[vowel] !== undefined) {
    states.push(compose(initial, VOWEL_FIRST[vowel], 0));
  }
  states.push(compose(initial, vowel, 0));
  if (final > 0) {
    if (FINAL_FIRST[final] !== undefined) {
      states.push(compose(initial, vowel, FINAL_FIRST[final]));
    }
    states.push(compose(initial, vowel, final));
  }
  return states;
}

export function countTypingSteps(text: string): number {
  let total = 0;
  for (const char of text) total += typingStates(char).length;
  return total;
}

export function typeUpTo(text: string, step: number) {
  const chars = Array.from(text);
  let remaining = step;

  for (let i = 0; i < chars.length; i += 1) {
    const states = typingStates(chars[i]);
    if (remaining < states.length) {
      const typed =
        chars.slice(0, i).join("") +
        (remaining > 0 ? states[remaining - 1] : "");
      const rest = chars.slice(remaining > 0 ? i + 1 : i).join("");
      return { typed, rest };
    }
    remaining -= states.length;
  }
  return { typed: text, rest: "" };
}
