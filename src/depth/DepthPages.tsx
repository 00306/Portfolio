import type { ComponentType } from "react";
import type { DepthPhase } from "./useDepth";
import { InductiveHumanPage } from "./pages/InductiveHumanPage";
import { LogicEmotionPage } from "./pages/LogicEmotionPage";
import { FreedomControlPage } from "./pages/FreedomControlPage";
import { UncontrollablePage } from "./pages/UncontrollablePage";
import { PreludePage } from "./pages/PreludePage";
import { CatalystPage } from "./pages/CatalystPage";
import { EariePage } from "./pages/EariePage";
import {
  CatalystRuntimeDeepPage,
  CatalystWebviewDeepPage,
} from "./pages/catalyst/CatalystDeepPages";
import "../styles/depthPage.css";

export type DepthId =
  | "value-01"
  | "value-02"
  | "value-03"
  | "value-04"
  | "project-earie"
  | "project-prelude"
  | "project-catalyst"
  | "catalyst-runtime"
  | "catalyst-webview";

export interface DepthPageProps {
  onExit: () => void;
  onDescend: (id: DepthId) => void;
  phase: DepthPhase;
}

export const DEPTH_PAGES: Record<DepthId, ComponentType<DepthPageProps>> = {
  "value-01": InductiveHumanPage,
  "value-02": LogicEmotionPage,
  "value-03": FreedomControlPage,
  "value-04": UncontrollablePage,
  "project-earie": EariePage,
  "project-prelude": PreludePage,
  "project-catalyst": CatalystPage,
  "catalyst-runtime": CatalystRuntimeDeepPage,
  "catalyst-webview": CatalystWebviewDeepPage,
};

export const VALUE_DEPTH_IDS: DepthId[] = [
  "value-01",
  "value-02",
  "value-03",
  "value-04",
];
