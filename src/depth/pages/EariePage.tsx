import type { DepthPageProps } from "../DepthPages";
import { BlurredEdgeScroll } from "../../components/BlurredEdgeScroll";
import { DecisionList } from "../../components/DecisionList";
import { IOS_DECISIONS, SERVER_DECISIONS } from "./earie/earieDecisions";
import { EarieIosOverview } from "./earie/EarieIosOverview";
import { EarieServerOverview } from "./earie/EarieServerOverview";
import "../../styles/projectPage.css";

const IOS_REPO_URL = "https://github.com/temp-pj/temp-iOS";
const SERVER_REPO_URL = "https://github.com/temp-pj/temp-ws";

const PROJECT_META = [
  { label: "Role", value: "iOS · Server Developer" },
  { label: "Team", value: "Solo" },
  {
    label: "Workflow",
    value: "Git Flow · CI · AI Review",
    title:
      "Issue → PR → CI(Lint · 빌드) → AI 코드리뷰 → develop 머지\niOS: GitHub Actions · Fastlane · SwiftLint · Tuist\nServer: GitHub Actions · golangci-lint\nReview: CodeRabbit · Codex",
  },
  { label: "Period", value: "2026.04 – 진행 중" },
];

const CONCEPT = "실시간 멀티플레이 노래 맞히기 게임";

const BACKGROUND =
  '친구들과 일정 노래 구간을 듣고 누가 먼저 제목을 맞히는지 겨루는 "노래맞추기" 게임을 즐겨 했고, 그 게임을 직접 만들어보고 싶었습니다. 그런데 만들려다 보니 여럿이 실시간으로 겨루는 게임을 구현하기 위해 풀어야 할 문제들이 보이기 시작했고, 그것들을 하나씩 직접 해결해 나가고 있습니다.';

const REQUIREMENT_BEATS = [
  {
    label: "Challenge 1",
    text: "모든 플레이어가 같은 순간에 곡을 듣기 시작하도록 맞추는 재생 동기화",
  },
  {
    label: "Challenge 2",
    text: "모든 기기가 같은 게임 상태를 유지하도록 맞추는 상태 동기화",
  },
  {
    label: "Challenge 3",
    text: "화면을 가리고 오타가 잦은 모바일 키보드 대신, 제목 글자 카드를 조합하는 입력 방식",
  },
];

const RETROSPECTIVE_KPT: {
  label: string;
  text: string;
  linkLabel?: string;
  href?: string;
}[] = [
  {
    label: "Keep",
    text: "Prelude에서 핵심 기능 검증이 늦었던 경험을 반영해, 게임 루프부터 실기기 2대로 검증",
    linkLabel: "iOS PR #27",
    href: "https://github.com/temp-pj/temp-iOS/pull/27",
  },
  {
    label: "Problem",
    text: "iOS · 서버 통합 도중 장애 지점을 격리할 수 없어, 버그 하나마다 클라이언트 · 서버 코드를 모두 뒤져야 하는 디버깅 비용 발생",
    linkLabel: "iOS PR #27",
    href: "https://github.com/temp-pj/temp-iOS/pull/27",
  },
  {
    label: "Try",
    text: "메시지마다 추적 ID를 붙여 iOS · 서버 양쪽 로그에 남기고, 한 메시지의 경로를 끝까지 따라가 장애 지점 격리",
  },
];

export function EariePage({ onExit }: DepthPageProps) {
  return (
    <div className="depth-page project-page">
      <div className="project-page-top">
        <header className="project-page-header">
          <h1 className="project-page-title">
            <img className="project-page-icon" src="/earie-appicon.png" alt="" />
            <span className="project-page-title-text">
              Earie
              <span className="project-page-subtitle">{CONCEPT}</span>
            </span>
          </h1>
          <dl className="project-page-meta">
            {PROJECT_META.map((item) => (
              <div key={item.label} className="project-page-meta-item">
                <dt className="project-page-meta-label">{item.label}</dt>
                <dd className="project-page-meta-value" title={item.title}>
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </header>

        <nav className="project-page-links" aria-label="Earie 링크">
          {[
            { label: "iOS", href: IOS_REPO_URL },
            { label: "Server", href: SERVER_REPO_URL },
          ].map((link) => (
            <a
              key={link.label}
              className="project-page-link-button"
              href={link.href}
              target="_blank"
              rel="noreferrer"
            >
              <img
                className="project-page-link-mark"
                src="/github-mark-white.svg"
                alt=""
              />
              {link.label}
              <span className="project-page-link-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          ))}
        </nav>
      </div>

      <div className="project-page-scroll-frame">
        <BlurredEdgeScroll className="project-page-scroll-body" showIndicator>
          <section className="project-page-background" aria-label="Background">
            <span className="project-page-kicker">Background</span>
            <p className="project-page-background-text">{BACKGROUND}</p>
          </section>

          <section
            className="project-page-band is-kpt"
            aria-label="지켜야 했던 조건"
          >
            {REQUIREMENT_BEATS.map((beat) => (
              <div key={beat.label} className="project-page-beat">
                <span className="project-page-kicker">{beat.label}</span>
                <p className="project-page-beat-text">{beat.text}</p>
              </div>
            ))}
          </section>

          <div className="project-page-split">
            <section className="project-page-overview-section">
              <h2 className="project-page-section-title">
                <span className="project-page-side-tag">iOS</span>
                System Overview
              </h2>
              <div className="project-page-overview-card">
                <EarieIosOverview />
              </div>
            </section>

            <div
              className="project-page-split-connector"
              aria-label="WebSocket으로 연결"
            >
              <span
                className="project-page-split-connector-arrow"
                aria-hidden="true"
              >
                →
              </span>
              <span className="project-page-split-connector-label">WebSocket</span>
              <span
                className="project-page-split-connector-arrow"
                aria-hidden="true"
              >
                ←
              </span>
            </div>

            <section className="project-page-overview-section">
              <h2 className="project-page-section-title">
                <span className="project-page-side-tag">Server</span>
                System Overview
              </h2>
              <div className="project-page-overview-card">
                <EarieServerOverview />
              </div>
            </section>

            <section>
              <h2 className="project-page-section-title">
                <span className="project-page-side-tag">iOS</span>
                Core Decisions
              </h2>
              <DecisionList decisions={IOS_DECISIONS} />
            </section>

            <div aria-hidden="true" />

            <section>
              <h2 className="project-page-section-title">
                <span className="project-page-side-tag">Server</span>
                Core Decisions
              </h2>
              <DecisionList decisions={SERVER_DECISIONS} />
            </section>
          </div>

          <section className="project-page-retrospective-section">
            <h2 className="project-page-section-title">Retrospective</h2>
            <div className="project-page-band is-kpt">
              {RETROSPECTIVE_KPT.map((item) => (
                <div key={item.label} className="project-page-beat">
                  <span className="project-page-kicker">{item.label}</span>
                  <p className="project-page-beat-text">{item.text}</p>
                  {item.href && (
                    <a
                      className="project-page-beat-link"
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.linkLabel} ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        </BlurredEdgeScroll>
      </div>

      <button type="button" className="depth-page-exit" onClick={onExit}>
        올라가기
      </button>
    </div>
  );
}
