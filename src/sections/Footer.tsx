import "../styles/footer.css";
import { CONTACT_LINKS } from "../profile";

function Footer() {
  return (
    <section className="footer-section">
      <div className="footer-center">
        <h2 className="footer-thanks">감사합니다</h2>

        <nav className="footer-links" aria-label="연락처">
          {CONTACT_LINKS.map(({ label, href, external }) => (
            <a
              key={label}
              className="footer-link"
              href={href}
              {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              {label}
              <span className="footer-link-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          ))}
        </nav>
      </div>

      <p className="footer-copyright">© 2026 Song Jihyuk</p>
    </section>
  );
}

export default Footer;
