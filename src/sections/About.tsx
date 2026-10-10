import "../styles/about.css";
import { CopyButton } from "../components/CopyButton";
import { EMAIL, NAME } from "../profile";

const PROFILE: { label: string; value: string; copyable?: boolean }[] = [
  { label: "생년월일", value: "2000.03.06" },
  { label: "성별", value: "남성" },
  { label: "위치", value: "부산광역시 해운대구" },
  { label: "이메일", value: EMAIL, copyable: true },
  { label: "연락처", value: "010-8601-4006" },
];

const TECH_STACK = [
  { label: "Language", items: ["Swift", "Go", "Python"] },
  { label: "Framework", items: ["SwiftUI", "UIKit", "TCA", "Combine"] },
  { label: "Tool", items: ["Tuist", "XCTest", "Fastlane", "GitHub Actions"] },
];

type FactItem = {
  title: string;
  meta: string;
  period?: string;
};

const EDUCATION: FactItem[] = [
  {
    title: "부산대학교 고분자공학과",
    meta: "임베디드SW 연계전공 · 졸업 예정",
    period: "2020.03 – 2027.02",
  },
  {
    title: "카카오테크 캠퍼스",
    meta: "2기 · FE",
    period: "2024.04 – 2024.08",
  },
  {
    title: "Apple Developer Academy @ POSTECH",
    meta: "2기 · Junior Learner",
    period: "2023.03 – 2023.12",
  },
];

const AWARDS: FactItem[] = [
  {
    title: "2024 새싹 해커톤",
    meta: "서울경제진흥원 · 장려상",
    period: "2024.08",
  },
  {
    title: "WWDC24 Swift Student Challenge",
    meta: "Apple · Winner",
    period: "2024.03",
  },
  {
    title: "WWDC23 Swift Student Challenge",
    meta: "Apple · Winner",
    period: "2023.05",
  },
];

function FactList({ items }: { items: FactItem[] }) {
  return (
    <ul className="about-list">
      {items.map(({ title, meta, period }) => (
        <li key={title}>
          <span className="about-item-title">{title}</span>
          {period && <span className="about-period">{period}</span>}
          <span className="about-meta">{meta}</span>
        </li>
      ))}
    </ul>
  );
}

function About() {
  return (
    <section className="about-section">
      <p className="page-name about-pagename">About</p>

      <div className="about-inner">
        <div className="about-intro">
          <div className="about-photo">
            <img src="/me.jpg" alt={`${NAME} 프로필 사진`} />
          </div>

          <div className="about-intro-text">
            <div className="about-heading">
              <h2 className="about-name">{NAME}</h2>
              <p className="about-role">iOS Developer</p>
            </div>

            <dl className="about-profile">
              {PROFILE.map(({ label, value, copyable }) => (
                <div className="about-profile-row" key={label}>
                  <dt>{label}</dt>
                  <dd>
                    {value}
                    {copyable && <CopyButton text={value} />}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="about-column about-awards">
          <p className="about-label">Awards</p>
          <FactList items={AWARDS} />
        </div>

        <div className="about-column about-stack-panel">
          <p className="about-label">Tech Stack</p>
          <dl className="about-stack">
            {TECH_STACK.map(({ label, items }) => (
              <div className="about-stack-group" key={label}>
                <dt>{label}</dt>
                <dd>
                  {items.map((item) => (
                    <span className="about-chip" key={item}>
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="about-column about-education">
          <p className="about-label">Education</p>
          <FactList items={EDUCATION} />
        </div>
      </div>
    </section>
  );
}

export default About;
