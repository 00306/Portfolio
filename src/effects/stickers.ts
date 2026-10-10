import { getTextRect } from "./textRect";
import { frameRatio } from "./canvasFrame";
import { SECTIONS, type SectionId } from "../sections/sections";

const TAG_GAP = 0.04;

const NAME_GAP = 0.15;

export type StickerAnchor =
  | { kind: "fixed"; x: number; y: number }
  | { kind: "aboveTagLine"; gap: number }
  | { kind: "rightOfName"; gap: number; lift: number }
  | { kind: "inSection"; section: SectionId; x: number; y: number };

export type Sticker = {
  id: string;
  url: string;
  height: number;
  anchor: StickerAnchor;
};

const HERO_STICKERS: Sticker[] = [
  {
    id: "swift",
    url: "/sticker_swift.svg",
    height: 0.14,
    anchor: { kind: "aboveTagLine", gap: TAG_GAP },
  },
  {
    id: "ssc24",
    url: "/sticker_ssc_24.png",
    height: 0.13,
    anchor: { kind: "rightOfName", gap: NAME_GAP + 0.13, lift: 0.3 },
  },
  {
    id: "ssc23",
    url: "/sticker_ssc_23.png",
    height: 0.13,
    anchor: { kind: "rightOfName", gap: NAME_GAP + 0.05, lift: 0.2 },
  },
  {
    id: "prelude",
    url: "/sticker_prelude.png",
    height: 0.15,
    anchor: { kind: "rightOfName", gap: NAME_GAP, lift: -0.05 },
  },
  {
    id: "catalyst",
    url: "/sticker_catalyst.png",
    height: 0.23,
    anchor: { kind: "rightOfName", gap: NAME_GAP + 0.11, lift: 0.05 },
  },
];

export const STICKERS: Sticker[] = HERO_STICKERS;

export function sectionWorldTop(section: SectionId): number {
  const index = SECTIONS.findIndex((s) => s.id === section);
  return index < 0 ? 1 : 1 - index;
}

export function anchorBand(anchor: StickerAnchor): {
  bottom: number;
  top: number;
} {
  if (anchor.kind === "inSection") {
    const top = sectionWorldTop(anchor.section);
    return { bottom: top - 1, top };
  }
  return { bottom: 0, top: 1 };
}

export function resolveAnchor(
  anchor: StickerAnchor,
  width: number,
  height: number
): { x: number; y: number } | null {
  if (anchor.kind === "fixed") {
    return { x: anchor.x, y: anchor.y };
  }

  const frame = frameRatio();

  if (anchor.kind === "inSection") {
    return {
      x: 0.5 + (anchor.x - 0.5) * frame.x,
      y: sectionWorldTop(anchor.section) - (0.5 + (anchor.y - 0.5) * frame.y),
    };
  }

  const rect = getTextRect();
  if (!rect) return null;

  if (anchor.kind === "aboveTagLine") {
    return {
      x: rect.x - rect.halfW + width / 2,
      y: rect.y + rect.halfH + anchor.gap * frame.y + height / 2,
    };
  }

  return {
    x: rect.x + rect.halfW + anchor.gap * frame.x,
    y: rect.y - rect.halfH + anchor.lift * frame.y,
  };
}
