import { HERO_STANCE, HERO_TAGS, HERO_TEXT } from "../sections/heroText";
import { CONTACT_LINKS, NAME } from "../profile";
import "../styles/mobileNotice.css";

function MobileNotice() {
  return (
    <main className="mobile-notice">
      <header className="mobile-notice-hero">
        <div className="mobile-notice-tags">
          {HERO_TAGS.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <p className="mobile-notice-stance">{HERO_STANCE}</p>
        <h1 className="mobile-notice-role">{HERO_TEXT}</h1>
        <p className="mobile-notice-name">{NAME}</p>
      </header>

      <nav className="mobile-notice-links" aria-label="연락처">
        {CONTACT_LINKS.map(({ label, href, external }) => (
          <a
            key={label}
            className="mobile-notice-chip"
            href={href}
            {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            {label}
            <span className="mobile-notice-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        ))}
      </nav>

      <footer className="mobile-notice-guide">
        <p>전체 포트폴리오는 PC 화면에 맞춰 만들었어요. PC에서 열어 주세요.</p>
      </footer>
    </main>
  );
}

export default MobileNotice;
