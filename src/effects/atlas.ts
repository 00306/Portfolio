import type { Sticker } from "./stickers";

export type AtlasSlot = {
  id: string;
  uvMin: [number, number];
  uvMax: [number, number];
  ratio: number;
};

type Atlas = {
  canvas: HTMLCanvasElement;
  slots: AtlasSlot[];
};

const GUTTER = 8;

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`image load failed: ${url}`));
    img.src = url;
  });
}

export async function buildAtlas(
  specs: Sticker[],
  cellPixels: number
): Promise<Atlas> {
  const images = await Promise.all(specs.map((s) => loadImage(s.url)));

  const cols = Math.ceil(Math.sqrt(specs.length));
  const rows = Math.ceil(specs.length / cols);

  const stride = cellPixels + GUTTER;

  const canvas = document.createElement("canvas");
  canvas.width = cols * stride + GUTTER;
  canvas.height = rows * stride + GUTTER;

  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const insetX = 0.5 / canvas.width;
  const insetY = 0.5 / canvas.height;

  const slots: AtlasSlot[] = specs.map((spec, i) => {
    const img = images[i]!;
    const ratio = img.naturalWidth / img.naturalHeight;

    const col = i % cols;
    const row = Math.floor(i / cols);

    const drawH = ratio >= 1 ? cellPixels / ratio : cellPixels;
    const drawW = drawH * ratio;

    const cellX = GUTTER + col * stride;
    const cellY = GUTTER + row * stride;
    const offsetX = (cellPixels - drawW) / 2;
    const offsetY = (cellPixels - drawH) / 2;

    ctx.drawImage(img, cellX + offsetX, cellY + offsetY, drawW, drawH);

    const x0 = (cellX + offsetX) / canvas.width + insetX;
    const x1 = (cellX + offsetX + drawW) / canvas.width - insetX;
    const yTop = (cellY + offsetY) / canvas.height + insetY;
    const yBottom = (cellY + offsetY + drawH) / canvas.height - insetY;

    return {
      id: spec.id,
      uvMin: [x0, 1 - yBottom],
      uvMax: [x1, 1 - yTop],
      ratio,
    };
  });

  return { canvas, slots };
}
