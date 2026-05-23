import { useEffect, useRef, useState } from "react";
import menuImg from "../assets/menu.png";

function Menu() {
  const [open, setOpen] = useState(false);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <section id="menu" className="section section-menu">
      <div className="section-head reveal">
        <span className="section-num" data-num="02">
          — the menu
        </span>
        <h2>
          Take a peak at
          <br />
          <em>our flavours.</em>
        </h2>
        <p className="lede">
          We also offer seasonal off-menu features, so be sure to follow{" "}
          <a
            href="https://instagram.com/_kakesbykate/"
            target="_blank"
            rel="noreferrer"
          >
            our Instagram
          </a>{" "}
          for more!
        </p>
      </div>

      <div className="menu-frame reveal reveal--d1">
        <button
          type="button"
          className="menu-img-trigger"
          onClick={() => setOpen(true)}
          aria-label="View full menu"
        >
          <img src={menuImg} alt="Kakes by Kate menu" className="menu-img" />
          <span className="menu-img-hint" aria-hidden="true">click to enlarge</span>
        </button>
      </div>

      <p className="menu-caption reveal reveal--d2">
        custom order? <a href="#order">tell us</a>
      </p>

      {open && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Full menu"
          onClick={() => setOpen(false)}
        >
          <img
            src={menuImg}
            alt="Kakes by Kate menu"
            className="lightbox-img"
            onClick={() => setOpen(false)}
          />
          <button
            type="button"
            ref={closeBtnRef}
            className="lightbox-close"
            aria-label="Close menu"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
          <span className="lightbox-hint" aria-hidden="true">
            <span className="hint-desktop">press <kbd>esc</kbd> or </span>
            click anywhere to close
          </span>
        </div>
      )}
    </section>
  );
}

export default Menu;
