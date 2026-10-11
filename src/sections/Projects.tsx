import { useRef } from "react";
import "../styles/project.css";
import { usePressable } from "../components/usePressable";
import type { DepthId } from "../depth/DepthPages";
import type { SectionProps } from "./sections";

type Project = {
  name: string;
  icon?: string;
  platforms: string[];
  description: string;
  period: string;
  stack: string[];
  teamRole?: string;
  depthId: DepthId;
};

const PROJECTS: Project[] = [
  {
    name: "Earie",
    icon: "/earie-appicon.png",
    platforms: ["iOS"],
    description: "실시간 멀티플레이 노래 맞히기 게임",
    period: "2026.04 – 진행 중",
    stack: [
      "SwiftUI",
      "TCA",
      "Swift Concurrency",
      "MusicKit",
      "WebSocket",
      "Go",
      "Tuist",
      "XCTest",
      "SwiftLint",
      "Fastlane",
      "GitHub Actions",
    ],
    depthId: "project-earie",
  },
  {
    name: "Prelude",
    icon: "/prelude-appicon.png",
    platforms: ["iOS"],
    description: "임산부를 위한 AI 음식 판별 앱",
    period: "2024.08 – 2025.06",
    stack: [
      "SwiftUI",
      "UIKit",
      "TCA",
      "Combine",
      "Clean Architecture",
      "SwiftData",
      "CloudKit",
      "Firebase",
      "StoreKit",
      "Sign in with Apple",
    ],
    teamRole: "iOS Developer",
    depthId: "project-prelude",
  },
  {
    name: "Catalyst",
    icon: "/catalyst-appicon.png",
    platforms: ["macOS", "Windows"],
    description: "고분자 연구실용 GPC 분석 데스크톱 앱",
    period: "2026.01 – 2026.04",
    stack: ["Python", "PyQt5", "QtWebEngine", "Plotly", "NumPy", "SciPy"],
    depthId: "project-catalyst",
  },
];

function describeTeam(project: Project): string {
  return project.teamRole
    ? `팀 프로젝트 · ${project.teamRole}`
    : "개인 프로젝트";
}

interface ProjectCardProps {
  project: Project;
  onSelect: (card: HTMLElement) => void;
}

function ProjectCard({ project, onSelect }: ProjectCardProps) {
  const cardRef = useRef<HTMLLIElement>(null);
  const pressable = usePressable({
    onPress: () => {
      if (cardRef.current) onSelect(cardRef.current);
    },
    className: "glass-card project-card",
  });

  return (
    <li ref={cardRef} {...pressable}>
      <div className="project-card-top">
        <div className="project-card-head">
          {project.icon ? (
            <img className="project-card-icon" src={project.icon} alt="" />
          ) : (
            <div className="project-card-icon" />
          )}
          <div className="project-card-title">
            <span className="project-card-name">{project.name}</span>
            <span className="project-card-team">{describeTeam(project)}</span>
          </div>
          <div className="project-card-meta">
            <span className="project-card-period">{project.period}</span>
            <ul className="project-card-platforms">
              {project.platforms.map((platform) => (
                <li key={platform} className="project-card-platform">
                  {platform}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="project-card-description">{project.description}</p>
      </div>

      <ul className="project-card-stack">
        {project.stack.map((item) => (
          <li key={item} className="project-card-chip">
            {item}
          </li>
        ))}
      </ul>
    </li>
  );
}

function Projects({ onDescend }: SectionProps) {
  const cardsRef = useRef<HTMLUListElement>(null);

  function aimPlungeAt(card: HTMLElement) {
    const list = cardsRef.current;
    if (!list) return;

    const listRect = list.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    list.style.setProperty(
      "--plunge-origin-x",
      `${cardRect.left - listRect.left + cardRect.width / 2}px`
    );
    list.style.setProperty(
      "--plunge-origin-y",
      `${cardRect.top - listRect.top + cardRect.height / 2}px`
    );
  }

  return (
    <section className="projects">
      <p className="page-name">Projects</p>

      <ul ref={cardsRef} className="projects-cards">
        {PROJECTS.map((project) => (
          <ProjectCard
            key={project.depthId}
            project={project}
            onSelect={(card) => {
              aimPlungeAt(card);
              onDescend(project.depthId);
            }}
          />
        ))}
      </ul>
    </section>
  );
}

export default Projects;
