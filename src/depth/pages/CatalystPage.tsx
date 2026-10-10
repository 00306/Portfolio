import type { DepthPageProps } from "../DepthPages";
import { BlurredEdgeScroll } from "../../components/BlurredEdgeScroll";
import { DecisionList } from "../../components/DecisionList";
import { CORE_DECISIONS } from "./catalyst/catalystDecisions";
import { CatalystSystemOverview } from "./catalyst/CatalystSystemOverview";
import "../../styles/projectPage.css";

const GITHUB_URL = "https://github.com/00306/catalyst";
const RELEASE_URL = `${GITHUB_URL}/releases/latest`;

const PROJECT_META = [
  { label: "Role", value: "Desktop App Developer" },
  { label: "Team", value: "Solo · 고분자 연구실 협업" },
  { label: "Period", value: "2026.01 – 2026.04" },
];

const CONCEPT = "GPC 데이터 분석 데스크톱 앱";

const BACKGROUND =
  "고분자공학 실험 수업을 들으며, 연구실의 장비와 소프트웨어들이 오래된 것이 많다는 걸 알게 됐습니다. 이 문제를 해결해보고 싶다는 생각에 부산대학교 백현종 교수님 연구실의 석사 연구원분들과 직접 소통하며 GPC 데이터를 분석하는 과정의 불편을 함께 정리했고, 이를 바탕으로 연구실에서 바로 쓸 수 있는 분석 도구를 만들기 시작했습니다.";

const PROBLEM_BEATS = [
  {
    label: "Target",
    text: "GPC 장비로 여러 샘플의 시그널을 비교 분석해야 하는 고분자 연구실 연구원",
    evidence: [] as string[],
  },
  {
    label: "Pain Point",
    text: "분석할 때마다 데이터를 Origin · Excel 등 여러 프로그램으로 옮겨야 하고, 여러 샘플을 한눈에 비교하는 3D 크로마토그램 · 2D-COS는 볼 수 없는 분석 환경",
    evidence: [] as string[],
  },
  {
    label: "Approach",
    text: "장비 시그널을 그대로 넣으면 분자량 분석 · 3D 크로마토그램 · 2D-COS를 한 번에 보여주는 데스크톱 도구",
    evidence: [] as string[],
  },
];

const RETROSPECTIVE_KPT = [
  {
    label: "Keep",
    text: "현장의 워크플로우와 장비 원리를 먼저 이해한 뒤, 그 안에서 개선점을 찾아 기능으로 구현",
  },
  {
    label: "Problem",
    text: "요구사항을 초기에 명확히 합의하지 못해, 구현 후 방향을 되돌리는 재작업 발생",
  },
  {
    label: "Try",
    text: "불확실한 요구사항은 번거롭더라도 그 자리에서 확인 · 합의한 뒤 구현 착수",
  },
];

export function CatalystPage({ onExit, onDescend }: DepthPageProps) {
  return (
    <div className="depth-page project-page">
      <div className="project-page-top">
        <header className="project-page-header">
          <h1 className="project-page-title">
            <img
              className="project-page-icon"
              src="/catalyst-appicon.png"
              alt=""
            />
            <span className="project-page-title-text">
              Catalyst
              <span className="project-page-subtitle">{CONCEPT}</span>
            </span>
          </h1>
          <dl className="project-page-meta">
            {PROJECT_META.map((item) => (
              <div key={item.label} className="project-page-meta-item">
                <dt className="project-page-meta-label">{item.label}</dt>
                <dd className="project-page-meta-value">{item.value}</dd>
              </div>
            ))}
          </dl>
        </header>

        <nav className="project-page-links" aria-label="Catalyst 링크">
          <a
            className="project-page-link-button"
            href={RELEASE_URL}
            target="_blank"
            rel="noreferrer"
          >
            Download
            <span className="project-page-link-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
          <a
            className="project-page-link-button"
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
          >
            <img
              className="project-page-link-mark"
              src="/github-mark-white.svg"
              alt=""
            />
            GitHub
            <span className="project-page-link-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        </nav>
      </div>

      <div className="project-page-scroll-frame">
        <BlurredEdgeScroll className="project-page-scroll-body" showIndicator>
          <section className="project-page-background" aria-label="Background">
            <span className="project-page-kicker">Background</span>
            <p className="project-page-background-text">{BACKGROUND}</p>
          </section>

          <section className="project-page-band" aria-label="Problem">
            {PROBLEM_BEATS.map((beat, index) => (
              <div key={beat.label} className="project-page-beat-group">
                {index > 0 && (
                  <span className="project-page-band-arrow" aria-hidden="true">
                    →
                  </span>
                )}
                <div className="project-page-beat">
                  <span className="project-page-kicker">{beat.label}</span>
                  <p className="project-page-beat-text">{beat.text}</p>
                  {beat.evidence.length > 0 && (
                    <ul className="project-page-evidence">
                      {beat.evidence.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </section>

          <div className="project-page-row">
            <section className="project-page-overview-section">
              <h2 className="project-page-section-title">System Overview</h2>
              <div className="project-page-overview-card">
                <div className="project-page-overview-diagram is-centered">
                  <CatalystSystemOverview />
                </div>
              </div>
            </section>

            <section>
              <h2 className="project-page-section-title">Core Decisions</h2>
              <DecisionList decisions={CORE_DECISIONS} onDescend={onDescend} />
            </section>
          </div>

          <section className="project-page-retrospective-section">
            <h2 className="project-page-section-title">Retrospective</h2>
            <div className="project-page-band is-kpt">
              {RETROSPECTIVE_KPT.map((item) => (
                <div key={item.label} className="project-page-beat">
                  <span className="project-page-kicker">{item.label}</span>
                  <p className="project-page-beat-text">{item.text}</p>
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
