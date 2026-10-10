import "../styles/hero.css";
import { HERO_STANCE, HERO_TAGS, HERO_TEXT } from "./heroText";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-block">
        <div className="hero-tags">
          {HERO_TAGS.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <div className="hero-stance">{HERO_STANCE}</div>
        <h1 className="hero-name">{HERO_TEXT}</h1>
      </div>
    </section>
  );
}

export default Hero;
