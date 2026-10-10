import type { ComponentType } from "react";
import Hero from "./Hero";
import About from "./About";
import PersonalValues from "./PersonalValues";
import Projects from "./Projects";
import Footer from "./Footer";
import type { DepthId } from "../depth/DepthPages";

export interface SectionProps {
  onDescend: (id: DepthId) => void;
}

type SectionEntry = {
  id: string;
  label: string;
  Component: ComponentType<SectionProps>;
};

export const SECTIONS = [
  { id: "hero", label: "Home", Component: Hero },
  { id: "about", label: "About", Component: About },
  { id: "values", label: "Values", Component: PersonalValues },
  { id: "projects", label: "Projects", Component: Projects },
  { id: "footer", label: "Contact", Component: Footer },
] as const satisfies readonly SectionEntry[];

export type SectionId = (typeof SECTIONS)[number]["id"];
