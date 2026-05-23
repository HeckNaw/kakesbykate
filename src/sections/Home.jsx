import cake1 from "../assets/cake1.jpg";
import cupcake1 from "../assets/cupcake1.jpg";
import macaron1 from "../assets/macaron1.jpg";

function scrollTo(id) {
  return (e) => {
    e.preventDefault();
    const section = document.getElementById(id);
    if (!section) return;
    const target = section.querySelector(".section-head") || section;
    if (window.__lenis) {
      window.__lenis.scrollTo(target);
    } else {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
}

function InstagramIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function Home() {
  return (
    <section id="home" className="section section-home">
      <div className="hero">
        <div className="hero-text">
          <span className="section-num" data-num="01">
            — home
          </span>
          <h1 className="reveal">
            Baking custom, <em className="swash">homemade desserts.</em>
          </h1>
          <p className="lede reveal reveal--d1">
            Cupcakes, cakes, macarons, and more made with care.
          </p>
          <div className="hero-cta reveal reveal--d2">
            <a
              href="#order"
              onClick={scrollTo("order")}
              className="btn btn-primary"
            >
              Place an order
            </a>
            <a
              href="#menu"
              onClick={scrollTo("menu")}
              className="btn btn-ghost"
            >
              See the menu
            </a>
          </div>
        </div>

        <div className="hero-photos">
          <span className="hero-decor hero-decor-1" aria-hidden="true" />
          <span className="hero-decor hero-decor-2" aria-hidden="true" />
          <div className="hp hp-1">
            <img src={cake1} alt="" />
          </div>
          <div className="hp hp-2">
            <img src={cupcake1} alt="" />
          </div>
          <div className="hp hp-3">
            <img src={macaron1} alt="" />
          </div>
        </div>

        <a
          className="ig-callout reveal reveal--d4"
          href="https://www.instagram.com/_kakesbykate/"
          target="_blank"
          rel="noreferrer"
        >
          <InstagramIcon />
          <span>
            See more <em>on our Instagram</em>
          </span>
        </a>
      </div>
    </section>
  );
}

export default Home;
