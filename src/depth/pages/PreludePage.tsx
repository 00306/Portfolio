import type { DepthPageProps } from "../DepthPages";
import { BlurredEdgeScroll } from "../../components/BlurredEdgeScroll";
import { DecisionList } from "../../components/DecisionList";
import { PreludeSystemOverview } from "./prelude/PreludeSystemOverview";
import { CORE_DECISIONS } from "./prelude/preludeDecisions";
import "../../styles/projectPage.css";

const APP_STORE_URL =
  "https://apps.apple.com/kr/app/prelude-%ED%94%84%EB%A0%88%EB%A5%98%EB%93%9C/id6670449153";
const GITHUB_URL = "https://github.com/motive-Prelude/Prelude-iOS";

const PROJECT_META = [
  { label: "Role", value: "iOS Developer" },
  { label: "Team", value: "iOS Developer · UI/UX Designer" },
  { label: "Period", value: "2024.08 – 2025.06" },
];

const CONCEPT = "임산부를 위한 AI 음식 판별 앱";

const BACKGROUND =
  "해커톤에서 임산부 앱 개발사가 공유한 실제 사용자 데이터를 보고, 임산부들이 먹을 음식 하나를 고르는 데도 큰 어려움을 겪는다는 걸 알게 됐습니다. 이미 많은 사용자가 겪고 있는 뾰족한 문제라 풀어볼 가치가 분명하다고 판단해, 해커톤이 끝난 뒤에도 함께 참여한 디자이너분과 Prelude로 발전시켜 앱 스토어 출시까지 이어갔습니다.";

const PROBLEM_BEATS = [
  {
    label: "Target",
    text: "먹는 음식마다 아이에게 안전한지 직접 확인해야 하는 임산부",
    evidence: ["음식 섭취를 크게 걱정함 73%"],
  },
  {
    label: "Pain Point",
    text: "신뢰할 수 있는 의사의 소견은 얻기 어렵고, 얻기 쉬운 온라인 정보는 신뢰하기 어려움",
    evidence: [
      "음식 고민을 의료진에게 실제로 물음 38%",
      "출처마다 정보가 달라 혼란을 겪음 88.5%",
    ],
  },
  {
    label: "Approach",
    text: "사진 한 장으로 쉽게 묻고, AI가 의학 자료를 근거로 섭취 가능 여부를 판별",
    evidence: [],
  },
];

const SURVEY_SOURCE = "자체 설문 · 응답 26명 · 2025.04";

const RETROSPECTIVE_KPT = [
  {
    label: "Keep",
    text: "가설만으로 판단하기 어려운 부분은, 직접 구현해 비교한 뒤 결정 (AI 서비스 3종)",
  },
  {
    label: "Problem",
    text: "AI 서비스 간 우열만 비교했을 뿐, 판별 정확도와 응답 속도가 실제 서비스에 충분한지는 확인하지 않고 채택",
  },
  {
    label: "Try",
    text: "가장 불확실하고 우선순위가 높은 기능부터, 서비스 기준을 미리 정해 검증한 뒤 구현에 착수",
  },
];

const ARCHITECTURE_NAMES = ["TCA", "Clean Architecture"];

export function PreludePage({ onExit }: DepthPageProps) {
  return (
    <div className="depth-page project-page">
      <div className="project-page-top">
        <header className="project-page-header">
          <h1 className="project-page-title">
            <img
              className="project-page-icon"
              src="/prelude-appicon.png"
              alt=""
            />
            <span className="project-page-title-text">
              Prelude
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

        <nav className="project-page-links" aria-label="Prelude 링크">
          <a
            className="project-page-link-button"
            href={APP_STORE_URL}
            target="_blank"
            rel="noreferrer"
          >
            App Store
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
            <p className="project-page-band-source">{SURVEY_SOURCE}</p>
          </section>

          <div className="project-page-row">
            <section className="project-page-overview-section">
              <h2 className="project-page-section-title">System Overview</h2>
              <div className="project-page-overview-card">
                <ul className="project-page-architecture">
                  {ARCHITECTURE_NAMES.map((name) => (
                    <li key={name}>
                      <span className="project-page-architecture-name">
                        {name}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="project-page-overview-diagram">
                  <PreludeSystemOverview />
                </div>
              </div>
            </section>

            <section>
              <h2 className="project-page-section-title">Core Decisions</h2>
              <DecisionList decisions={CORE_DECISIONS} />
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
