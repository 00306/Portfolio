import { useEffect, useRef } from "react";
import { createGL } from "./gl";
import { WATER_SIM } from "./water.sim";
import { CURSOR_SIM } from "./water.cursor";
import { WATER_FRAG } from "./water.frag";
import {
  STICKERS,
  resolveAnchor,
  anchorBand,
  sectionWorldTop,
} from "./stickers";
import { buildAtlas, type AtlasSlot } from "./atlas";
import { startHeroRectTracking } from "./heroRect";
import { getScrollRoot, getWorldScroll } from "./scrollRoot";
import { frameRatio } from "./canvasFrame";
import type { DepthPhase } from "../depth/useDepth";

const DAMPING = 0.98;
const DROP_RADIUS = 0.015;
const DROP_STRENGTH = 0.001;
const RIPPLE_INTERVAL = 50;
const RIPPLE_DECAY = 35;
const SWELL_FORCE = 0.00001;

const STIR_FORCE = 0.00004;
const STIR_RISE = 200;
const STIR_LENGTH = 1500;
const STIR_RELEASE = 700;

const CURSOR_RADIUS = 0.01;
const CURSOR_DEPTH = 0.01;
const CURSOR_FADE = 0.95;
const CURSOR_STIFFNESS = 0.3;

const MAX_STICKERS = 8;
const STICKER_DEPTH = 0.12;

const SEABED_URL = "/seabed-ink.png";

const CIRCLE_CENTER: [number, number] = [0.5, 0.5];
const OPTICS_AXIS: [number, number] = [1, 0];
const OPTICS_SPREAD = 0;

const PUSH_RADIUS = 0.14;
const PUSH_FORCE = 0.0012;
const DRIFT_FORCE = 0.00002;
const BOUND_MARGIN = 0.08;
const BOUND_FORCE = 0.00025;

const REPEL_FORCE = 0.0008;
const REPEL_PADDING = 1.1;

const ANCHOR_STIFFNESS = 0.0003;
const ANCHOR_ZETA = 1.15;
const STICKER_DRAG = 1 - 2 * ANCHOR_ZETA * Math.sqrt(ANCHOR_STIFFNESS);

const RIPPLE_FRAMES = Math.round(RIPPLE_DECAY * 5);

const SIM_HZ = 120;
const STEP_MS = 1000 / SIM_HZ;
const MAX_STEPS_PER_FRAME = 4;
const STEP_SNAP = 0.25;

type WaterRippleEffectProps = {
  submerged: boolean;
  plunging: boolean;
  depthPhase: DepthPhase;
};

type StickerBody = {
  x: number;
  y: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  height: number;
  ratio: number;
  uvMin: [number, number];
  uvMax: [number, number];
};

function rippleDrive(frame: number): number {
  if (frame < 0 || frame >= RIPPLE_FRAMES) return 0;
  const decay = Math.exp(-frame / RIPPLE_DECAY);
  const bob = Math.sin((2 * Math.PI * frame) / RIPPLE_INTERVAL);
  return decay * bob;
}

function stirEnvelope(ms: number): number {
  const smooth = (a: number, b: number, x: number) => {
    const u = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return u * u * (3 - 2 * u);
  };
  const attack = smooth(0, STIR_RISE, ms);
  const release = 1 - smooth(STIR_LENGTH - STIR_RELEASE, STIR_LENGTH, ms);
  return attack * release;
}

export function WaterRippleEffect({
  submerged,
  plunging,
  depthPhase,
}: WaterRippleEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const submergedRef = useRef(submerged);
  const plungingRef = useRef(plunging);

  useEffect(() => {
    submergedRef.current = submerged;
  }, [submerged]);

  useEffect(() => {
    plungingRef.current = plunging;
  }, [plunging]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scrollRoot = getScrollRoot();
    const stopHeroRect = startHeroRectTracking();

    const gl = createGL(
      canvas,
      WATER_SIM,
      CURSOR_SIM,
      WATER_FRAG,
      "/background.png",
      SEABED_URL
    );
    if (!gl) {
      stopHeroRect();
      return;
    }

    const readScroll = () =>
      (scrollRoot ? getWorldScroll(scrollRoot) : 0) /
      Math.max(window.innerHeight, 1);

    const camera = { shift: 0, simHeight: 0 };

    const stir = { active: false, startedAt: 0 };

    const click = { x: 0.5, y: 0.5, frame: RIPPLE_FRAMES };

    const pointer = { x: 0.5, y: 0.5 };
    const cursor = { x: 0.5, y: 0.5, px: 0.5, py: 0.5, active: 0 };
    const bodies: StickerBody[] = [];

    let disposed = false;

    const cellPixels = () => {
      const maxHeight = Math.max(...STICKERS.map((s) => s.height));
      return Math.round(canvas.height * maxHeight * frameRatio().y);
    };

    const applySlots = (slots: AtlasSlot[]) => {
      const aspect = window.innerWidth / window.innerHeight;
      const scale = frameRatio().y;

      slots.forEach((slot, i) => {
        const spec = STICKERS[i]!;
        const height = spec.height * scale;
        const body = bodies[i];
        if (body) {
          body.height = height;
          body.ratio = slot.ratio;
          body.uvMin = slot.uvMin;
          body.uvMax = slot.uvMax;
          return;
        }

        const width = (height * slot.ratio) / aspect;
        const start = resolveAnchor(spec.anchor, width, height) ?? {
          x: 0.5,
          y: 0.5,
        };

        bodies.push({
          x: start.x,
          y: start.y,
          px: start.x,
          py: start.y,
          vx: 0,
          vy: 0,
          height,
          ratio: slot.ratio,
          uvMin: slot.uvMin,
          uvMax: slot.uvMax,
        });
      });
    };

    const loadAtlas = () => {
      buildAtlas(STICKERS.slice(0, MAX_STICKERS), cellPixels())
        .then((atlas) => {
          if (disposed) return;
          gl.setAtlas(atlas.canvas);
          applySlots(atlas.slots);
        })
        .catch((e) => console.warn(e));
    };
    loadAtlas();

    const onClick = (e: MouseEvent) => {
      if (submergedRef.current) return;
      click.x = e.clientX / window.innerWidth;
      click.y = 1 - e.clientY / window.innerHeight - readScroll();
      click.frame = 0;
    };
    const onMove = (e: MouseEvent) => {
      if (submergedRef.current) return;
      pointer.x = e.clientX / window.innerWidth;
      pointer.y = 1 - e.clientY / window.innerHeight;
      if (cursor.active === 0) {
        cursor.x = cursor.px = pointer.x;
        cursor.y = cursor.py = pointer.y - readScroll();
      }
      cursor.active = 1;
    };
    const onLeave = () => {
      cursor.active = 0;
    };
    const onResize = () => loadAtlas();

    window.addEventListener("click", onClick);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", onResize);
    document.addEventListener("mouseleave", onLeave);

    const uCenter = new Array(MAX_STICKERS * 2).fill(0);
    const uPrev = new Array(MAX_STICKERS * 2).fill(0);
    const uSize = new Array(MAX_STICKERS * 2).fill(0);
    const uUvMin = new Array(MAX_STICKERS * 2).fill(0);
    const uUvMax = new Array(MAX_STICKERS * 2).fill(0);

    const fillStickerUniforms = (
      count: number,
      aspect: number,
      worldToGridY: number
    ) => {
      for (let i = 0; i < count; i++) {
        const b = bodies[i]!;
        uCenter[i * 2] = b.x;
        uCenter[i * 2 + 1] = b.y + worldToGridY;
        uPrev[i * 2] = b.px;
        uPrev[i * 2 + 1] = b.py + worldToGridY;
        uSize[i * 2] = (b.height * b.ratio) / aspect;
        uSize[i * 2 + 1] = b.height;
        uUvMin[i * 2] = b.uvMin[0];
        uUvMin[i * 2 + 1] = b.uvMin[1];
        uUvMax[i * 2] = b.uvMax[0];
        uUvMax[i * 2 + 1] = b.uvMax[1];
      }
    };

    const stepStickers = (aspect: number, t: number) => {
      const radiusOf = (b: StickerBody) => b.height * 0.5 * 1.05;

      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const a = bodies[i]!;
          const b = bodies[j]!;

          const dx = (b.x - a.x) * aspect;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy);

          const reach = (radiusOf(a) + radiusOf(b)) * REPEL_PADDING;
          if (dist >= reach || dist < 1e-5) continue;

          const strength = (1 - dist / reach) * REPEL_FORCE;
          const nx = dx / dist;
          const ny = dy / dist;

          a.vx -= nx * strength;
          a.vy -= ny * strength;
          b.vx += nx * strength;
          b.vy += ny * strength;

          const solid = radiusOf(a) + radiusOf(b);
          if (dist < solid) {
            const push = (solid - dist) * 0.5;
            a.x -= (nx * push) / aspect;
            a.y -= ny * push;
            b.x += (nx * push) / aspect;
            b.y += ny * push;
          }
        }
      }

      bodies.forEach((b, i) => {
        b.vx += Math.sin(t * 0.13 + i * 1.7) * DRIFT_FORCE;
        b.vy += Math.cos(t * 0.097 + i * 2.3) * DRIFT_FORCE;

        if (cursor.active > 0) {
          const dx = (b.x - cursor.x) * aspect;
          const dy = b.y - cursor.y;
          const dist = Math.hypot(dx, dy);
          if (dist < PUSH_RADIUS && dist > 1e-5) {
            const strength = (1 - dist / PUSH_RADIUS) * PUSH_FORCE;
            b.vx += (dx / dist) * strength;
            b.vy += (dy / dist) * strength;
          }
        }

        const spec = STICKERS[i];
        if (spec) {
          const width = (b.height * b.ratio) / aspect;
          const anchor = resolveAnchor(spec.anchor, width, b.height);
          if (anchor) {
            b.vx += (anchor.x - b.x) * ANCHOR_STIFFNESS;
            b.vy += (anchor.y - b.y) * ANCHOR_STIFFNESS;
          }
        }

        if (b.x < BOUND_MARGIN) b.vx += BOUND_FORCE;
        if (b.x > 1 - BOUND_MARGIN) b.vx -= BOUND_FORCE;

        const band = spec ? anchorBand(spec.anchor) : { bottom: 0, top: 1 };
        if (b.y < band.bottom + BOUND_MARGIN) b.vy += BOUND_FORCE;
        if (b.y > band.top - BOUND_MARGIN) b.vy -= BOUND_FORCE;

        b.vx *= STICKER_DRAG;
        b.vy *= STICKER_DRAG;
        b.x += b.vx;
        b.y += b.vy;
      });
    };

    const stepWater = (
      aspect: number,
      t: number,
      worldToGridY: number,
      toneEased: number
    ) => {
      const count = Math.min(bodies.length, MAX_STICKERS);
      fillStickerUniforms(count, aspect, worldToGridY);

      gl.use(gl.simProgram);
      gl.setFloat(gl.simProgram, "u_time", t);
      gl.setVec2(gl.simProgram, "u_drop", click.x, click.y + worldToGridY);
      gl.setFloat(
        gl.simProgram,
        "u_dropStrength",
        DROP_STRENGTH * rippleDrive(click.frame) * (1 - toneEased)
      );
      if (click.frame < RIPPLE_FRAMES) click.frame += 1;

      gl.stepSim();

      gl.use(gl.cursorProgram);
      gl.setVec2(
        gl.cursorProgram,
        "u_cursor",
        cursor.x,
        cursor.y + worldToGridY
      );
      gl.setVec2(
        gl.cursorProgram,
        "u_cursorPrev",
        cursor.px,
        cursor.py + worldToGridY
      );
      gl.setFloat(gl.cursorProgram, "u_cursorActive", cursor.active);
      gl.setFloat(gl.cursorProgram, "u_count", count);
      gl.setVec2Array(gl.cursorProgram, "u_center", uCenter);
      gl.setVec2Array(gl.cursorProgram, "u_prev", uPrev);
      gl.setVec2Array(gl.cursorProgram, "u_size", uSize);
      gl.setVec2Array(gl.cursorProgram, "u_uvMin", uUvMin);
      gl.setVec2Array(gl.cursorProgram, "u_uvMax", uUvMax);

      gl.stepCursorSim();

      cursor.px = cursor.x;
      cursor.py = cursor.y;
      bodies.forEach((b) => {
        b.px = b.x;
        b.py = b.y;
      });
    };

    let raf = 0;
    let lastFrameAt = performance.now();
    let stepBudget = STEP_MS;

    const takeSteps = (now: number): number => {
      const elapsed = now - lastFrameAt;
      lastFrameAt = now;
      stepBudget += Math.min(elapsed, STEP_MS * MAX_STEPS_PER_FRAME);

      const steps = Math.min(
        MAX_STEPS_PER_FRAME,
        Math.max(0, Math.floor(stepBudget / STEP_MS + STEP_SNAP))
      );
      stepBudget = Math.min(stepBudget - steps * STEP_MS, STEP_MS);
      return steps;
    };

    const frame = () => {
      const aspect = window.innerWidth / window.innerHeight;
      const now = performance.now();
      const t = now * 0.001;
      const steps = takeSteps(now);

      const toneEased = submergedRef.current ? 1 : 0;

      const plunge = plungingRef.current;
      if (plunge && !stir.active) stir.startedAt = now;
      stir.active = plunge;
      const stirMs = plunge ? now - stir.startedAt : 0;
      const stirLevel = plunge ? stirEnvelope(stirMs) : 0;
      const stirSince = stirMs * 0.001;

      if (submergedRef.current) cursor.active = 0;

      const texelX = 1 / gl.simWidth;
      const texelY = 1 / gl.simHeight;

      const scroll = readScroll();
      const scrollCells = scroll * gl.simHeight;
      const targetShift = Math.floor(scrollCells);

      if (camera.simHeight !== gl.simHeight) {
        camera.simHeight = gl.simHeight;
        camera.shift = targetShift;
      } else if (targetShift !== camera.shift) {
        gl.shiftSim(targetShift - camera.shift);
        camera.shift = targetShift;
      }

      const shiftRemainder = scrollCells - camera.shift;
      const worldToGridY = camera.shift * texelY;

      gl.use(gl.simProgram);
      gl.setVec2(gl.simProgram, "u_texel", texelX, texelY);
      gl.setFloat(gl.simProgram, "u_damping", DAMPING);
      gl.setFloat(gl.simProgram, "u_dropRadius", DROP_RADIUS);
      gl.setFloat(gl.simProgram, "u_aspect", aspect);
      gl.setFloat(gl.simProgram, "u_swellForce", SWELL_FORCE);
      gl.setFloat(gl.simProgram, "u_stirForce", STIR_FORCE * stirLevel);
      gl.setFloat(gl.simProgram, "u_stirTime", stirSince);

      gl.use(gl.cursorProgram);
      gl.setVec2(gl.cursorProgram, "u_texel", texelX, texelY);
      gl.setFloat(gl.cursorProgram, "u_cursorRadius", CURSOR_RADIUS);
      gl.setFloat(gl.cursorProgram, "u_cursorDepth", CURSOR_DEPTH);
      gl.setFloat(gl.cursorProgram, "u_fade", CURSOR_FADE);
      gl.setFloat(gl.cursorProgram, "u_stiffness", CURSOR_STIFFNESS);
      gl.setFloat(gl.cursorProgram, "u_aspect", aspect);
      gl.setFloat(gl.cursorProgram, "u_stickerDepth", STICKER_DEPTH);

      const cursorFromX = cursor.x;
      const cursorFromY = cursor.y;
      const cursorToX = pointer.x;
      const cursorToY = pointer.y - scroll;

      for (let k = 0; k < steps; k++) {
        const stepT = t - ((steps - 1 - k) * STEP_MS) / 1000;

        if (cursor.active > 0) {
          const along = (k + 1) / steps;
          cursor.x = cursorFromX + (cursorToX - cursorFromX) * along;
          cursor.y = cursorFromY + (cursorToY - cursorFromY) * along;
        }

        stepStickers(aspect, stepT);
        stepWater(aspect, stepT, worldToGridY, toneEased);
      }

      const count = Math.min(bodies.length, MAX_STICKERS);
      fillStickerUniforms(count, aspect, worldToGridY);

      const screenToGridY = -shiftRemainder * texelY;

      gl.use(gl.renderProgram);
      gl.setVec2(gl.renderProgram, "u_uvShift", 0, screenToGridY);
      gl.setVec2(gl.renderProgram, "u_texel", texelX, texelY);
      gl.setFloat(gl.renderProgram, "u_aspect", aspect);
      gl.setFloat(gl.renderProgram, "u_depth", toneEased);
      gl.setVec2(
        gl.renderProgram,
        "u_circleCenter",
        CIRCLE_CENTER[0],
        CIRCLE_CENTER[1] + screenToGridY
      );
      gl.setVec2(
        gl.renderProgram,
        "u_opticsAxis",
        OPTICS_AXIS[0],
        OPTICS_AXIS[1]
      );
      gl.setFloat(gl.renderProgram, "u_opticsSpread", OPTICS_SPREAD);
      gl.setFloat(
        gl.renderProgram,
        "u_seabedTop",
        sectionWorldTop("footer") + worldToGridY
      );
      gl.setFloat(gl.renderProgram, "u_time", t);
      gl.setFloat(gl.renderProgram, "u_count", count);
      gl.setVec2Array(gl.renderProgram, "u_center", uCenter);
      gl.setVec2Array(gl.renderProgram, "u_size", uSize);
      gl.setVec2Array(gl.renderProgram, "u_uvMin", uUvMin);
      gl.setVec2Array(gl.renderProgram, "u_uvMax", uUvMax);
      gl.drawToScreen();

      raf = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("click", onClick);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("mouseleave", onLeave);
      stopHeroRect();
      gl.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="water-canvas"
      data-depth={depthPhase}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: -1,
      }}
    />
  );
}
