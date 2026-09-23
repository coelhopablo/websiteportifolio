import { useEffect, useRef, useState, type PointerEvent } from "react";
import { categories, galleries, videos, type GalleryItem } from "./data";

type GalleryKey = keyof typeof galleries | "animation" | "web";

const heroImages = Object.values(galleries).flatMap((gallery) =>
  gallery.map((item) => item.full),
);

const galleryTitles: Record<GalleryKey, string> = {
  illustration: "Illustration",
  painting: "Oil painting",
  scenic: "Scenic art",
  comics: "Comics",
  animation: "Animation",
  web: "Web design",
};

const getGalleryKeyFromHash = (hash: string): GalleryKey | null => {
  if (!hash.startsWith("#gallery/")) return null;
  const key = hash.replace("#gallery/", "");
  return key in galleryTitles ? (key as GalleryKey) : null;
};

function GalleryView({ galleryKey }: { galleryKey: GalleryKey }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const pointerStart = useRef<number | null>(null);
  const items = galleries[galleryKey] ?? [];
  const isVideoGallery = galleryKey === "animation";
  const itemCount = isVideoGallery ? videos.length : items.length;

  const move = (direction: number) => {
    setCurrentIndex((index) => (index + direction + itemCount) % itemCount);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "Escape") setIsLightboxOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  if (galleryKey === "web") {
    return (
      <main className="gallery-page">
        <GalleryHeader title={galleryTitles[galleryKey]} />
        <section className="gallery-empty">
          <p className="eyebrow">Coming soon</p>
          <h1>
            Digital work
            <br />
            <em>is on its way.</em>
          </h1>
        </section>
      </main>
    );
  }

  const currentItem = items[currentIndex];
  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pointerStart.current = event.clientX;
  };
  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (pointerStart.current === null) return;
    const distance = event.clientX - pointerStart.current;
    if (Math.abs(distance) > 45) move(distance < 0 ? 1 : -1);
    pointerStart.current = null;
  };

  return (
    <main className="gallery-page">
      <GalleryHeader title={galleryTitles[galleryKey]} />
      <section className="gallery-content">
        <div className="gallery-heading">
          <p className="eyebrow">Selected work</p>
          <p className="gallery-count">
            {String(currentIndex + 1).padStart(2, "0")} /{" "}
            {String(itemCount).padStart(2, "0")}
          </p>
        </div>
        <div className="gallery-grid">
          {isVideoGallery
            ? videos.map((videoId, index) => (
                <button
                  className="gallery-card video-card"
                  type="button"
                  key={videoId}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsLightboxOpen(true);
                  }}
                >
                  <img
                    src={`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`}
                    alt={`Animation film ${index + 1}`}
                  />
                  <span>Play film {String(index + 1).padStart(2, "0")}</span>
                </button>
              ))
            : items.map((item, index) => (
                <button
                  className="gallery-card"
                  type="button"
                  key={item.full}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsLightboxOpen(true);
                  }}
                >
                  <img src={item.thumb} alt={item.alt} loading="lazy" />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </button>
              ))}
        </div>
      </section>

      {isLightboxOpen && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${galleryTitles[galleryKey]} viewer`}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onClick={(event) => {
            const target = event.target as HTMLElement;
            if (target.closest("button") || target.tagName === "IFRAME") return;
            move(event.clientX < window.innerWidth / 2 ? -1 : 1);
          }}
        >
          <button
            className="lightbox-close"
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close viewer"
          >
            Close
          </button>
          <button
            className="lightbox-nav lightbox-prev"
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous image"
          >
            Previous
          </button>
          <div className="lightbox-stage">
            {isVideoGallery ? (
              <iframe
                src={`https://www.youtube.com/embed/${videos[currentIndex]}?autoplay=1`}
                title={`Animation film ${currentIndex + 1}`}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <img
                src={(currentItem as GalleryItem).full}
                alt={(currentItem as GalleryItem).alt}
              />
            )}
          </div>
          <button
            className="lightbox-nav lightbox-next"
            type="button"
            onClick={() => move(1)}
            aria-label="Next image"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}

function GalleryHeader({ title }: { title: string }) {
  return (
    <div className="gallery-header">
      <a className="text-link" href="#home">
        Back to work
      </a>
      <h1>{title}</h1>
    </div>
  );
}

function ContactView() {
  return (
    <main className="contact-page">
      <section className="contact-intro" aria-labelledby="contact-title">
        <p className="eyebrow">Contact</p>
        <h1 id="contact-title">
          Let&apos;s make something
          <br />
          <em>worth looking at.</em>
        </h1>
      </section>
      <section className="contact-grid">
        <div>
          <p className="contact-lead">
            For commissions, collaborations or just a good conversation about
            images.
          </p>
          <a className="contact-email" href="mailto:pablotcoelho@hotmail.com">
            pablotcoelho@hotmail.com
          </a>
        </div>
        <div className="contact-details">
          <p className="eyebrow">Find me online</p>
          <a
            href="https://www.instagram.com/pablotcoelho/?hl=en"
            target="_blank"
            rel="noreferrer"
          >
            Instagram · personal
          </a>
          <a
            href="https://www.instagram.com/comicshut/?hl=en"
            target="_blank"
            rel="noreferrer"
          >
            Instagram · Comics Hut
          </a>
          <a
            href="https://www.tiktok.com/@comicshut"
            target="_blank"
            rel="noreferrer"
          >
            TikTok · Comics Hut
          </a>
        </div>
      </section>
    </main>
  );
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lightsOn, setLightsOn] = useState(
    () => window.localStorage.getItem("portfolio-lights") === "on",
  );
  const initialGalleryKey = getGalleryKeyFromHash(window.location.hash);
  const [portraitImages, setPortraitImages] = useState<string[]>([]);
  const [heroImage, setHeroImage] = useState(
    "/illustration/illustration 2.jpg",
  );
  const [isHeroFading, setIsHeroFading] = useState(false);
  const [view, setView] = useState(
    window.location.hash === "#about"
      ? "about"
      : window.location.hash === "#contact"
        ? "contact"
        : initialGalleryKey
          ? "gallery"
          : "home",
  );
  const [galleryKey, setGalleryKey] = useState<GalleryKey | null>(
    initialGalleryKey,
  );

  useEffect(() => {
    const handleHashChange = () => {
      const nextHash = window.location.hash;
      const nextGalleryKey = getGalleryKeyFromHash(nextHash);
      setView(
        nextHash === "#about"
          ? "about"
          : nextHash === "#contact"
            ? "contact"
            : nextGalleryKey
              ? "gallery"
              : "home",
      );
      setGalleryKey(nextGalleryKey);
      setIsMenuOpen(false);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    let isCancelled = false;
    const portraitChecks = heroImages.map(
      (source) =>
        new Promise<string | null>((resolve) => {
          const image = new window.Image();
          image.onload = () =>
            resolve(image.naturalHeight > image.naturalWidth ? source : null);
          image.onerror = () => resolve(null);
          image.src = source;
        }),
    );

    Promise.all(portraitChecks).then((images) => {
      if (isCancelled) return;
      const portraits = images.filter(
        (source): source is string => source !== null,
      );
      setPortraitImages(portraits);
      if (portraits.length > 0) {
        setHeroImage(portraits[Math.floor(Math.random() * portraits.length)]);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (portraitImages.length < 2) return;

    const interval = window.setInterval(() => {
      setIsHeroFading(true);
      window.setTimeout(() => {
        setHeroImage((currentImage) => {
          const availableImages = portraitImages.filter(
            (image) => image !== currentImage,
          );
          return availableImages[
            Math.floor(Math.random() * availableImages.length)
          ];
        });
        window.requestAnimationFrame(() => setIsHeroFading(false));
      }, 450);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [portraitImages]);

  useEffect(() => {
    document.documentElement.classList.toggle("lights-on", lightsOn);
    window.localStorage.setItem("portfolio-lights", lightsOn ? "on" : "off");
  }, [lightsOn]);

  const navigate = (destination: string) => {
    window.location.hash = destination;
  };

  return (
    <div className={`site-shell ${lightsOn ? "lights-on" : "lights-off"}`}>
      <header className="site-header">
        <a className="wordmark" href="#home" onClick={() => setView("home")}>
          <span>Pablo</span>
          <span>
            Coelho<span className="wordmark-dot">.</span>
          </span>
        </a>
        <nav
          className={`site-nav ${isMenuOpen ? "is-open" : ""}`}
          aria-label="Main navigation"
        >
          <a
            className={view === "home" ? "is-current" : ""}
            href="#home"
            onClick={() => setIsMenuOpen(false)}
          >
            Work
          </a>
          <a
            className={view === "about" ? "is-current" : ""}
            href="#about"
            onClick={() => setIsMenuOpen(false)}
          >
            About me
          </a>
          <a
            className={view === "contact" ? "is-current" : ""}
            href="#contact"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </a>
        </nav>
        <button
          className="lights-toggle"
          type="button"
          aria-pressed={lightsOn}
          aria-label={lightsOn ? "Turn lights off" : "Turn lights on"}
          onClick={() => setLightsOn((isOn) => !isOn)}
        >
          <span className="lights-indicator" aria-hidden="true" />
          {lightsOn ? "Lights off" : "Lights on"}
        </button>
        <button
          className={`menu-toggle ${isMenuOpen ? "is-open" : ""}`}
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="menu-icon" aria-hidden="true" />
        </button>
      </header>

      {view === "gallery" && galleryKey ? (
        <GalleryView galleryKey={galleryKey} />
      ) : view === "home" ? (
        <main>
          <section className="intro-section" aria-labelledby="page-title">
            <p className="eyebrow">Visual artist · illustrator · animator</p>
            <div className="intro-layout">
              <h1 id="page-title">
                A catalogue of
                <br />
                <em>experimental worlds.</em>
              </h1>
              <div className="intro-aside">
                <p>
                  A selection of work across illustration, painting, animation,
                  scenic art and comics.
                </p>
                <a className="text-link" href="#work">
                  Explore the work
                </a>
              </div>
            </div>
            <div
              className={`hero-art ${isHeroFading ? "is-fading" : ""}`}
              aria-hidden="true"
            >
              <img src={heroImage} alt="" />
            </div>
          </section>

          <div className="ticker" aria-label="Creative disciplines">
            <div className="ticker-track">
              <span>Illustration</span>
              <span>Painting</span>
              <span>Animation</span>
              <span>Comics</span>
              <span>Scenic art</span>
              <span>Illustration</span>
              <span>Painting</span>
              <span>Animation</span>
              <span>Comics</span>
              <span>Scenic art</span>
            </div>
          </div>

          <section
            className="catalogue-section"
            id="work"
            aria-labelledby="catalogue-title"
          >
            <div className="section-heading">
              <p className="eyebrow">Selected practice</p>
              <h2 id="catalogue-title">
                Everything that lives
                <br />
                here
              </h2>
            </div>
            <div className="category-list">
              {categories.map((category) => (
                <a
                  className={`category-row accent-${category.accent}`}
                  href={category.href}
                  key={category.number}
                >
                  <span className="category-number">{category.number}</span>
                  <span className="category-image-wrap">
                    <img src={category.image} alt="" />
                  </span>
                  <span className="category-copy">
                    <h3>{category.title}</h3>
                    <p>{category.description}</p>
                  </span>
                </a>
              ))}
            </div>
          </section>
        </main>
      ) : view === "about" ? (
        <main className="about-page">
          <section className="about-intro" aria-labelledby="about-title">
            <p className="eyebrow">About me</p>
            <h1 id="about-title">
              Paint, draw, animations
              <br />
              <em>and much more..</em>
            </h1>
          </section>
          <section className="about-grid">
            <div className="about-photo">
              <img src={categories[0].image} alt="Artwork by Pablo Coelho" />
            </div>
            <div className="about-copy">
              <p className="about-lead">
                I am Pablo Coelho, a Brazilian visual artist working between
                painting, animation and illustration.
              </p>
              <p>
                For more than ten years I have worked with images, characters
                and stories across different formats. My practice moves through
                fine art, animation drawing, comics and digital experiences.
              </p>
              <p>
                I hold a Bachelor of Fine Arts from the Federal University of
                Rio de Janeiro and a Master of Animation from Universidade
                Lusófona in Lisbon. I have also collaborated with Rede Globo
                productions and created Comics Hut, home of The Moonyman.
              </p>
              <a className="text-link" href="mailto:pablotcoelho@hotmail.com">
                Let's talk
              </a>
            </div>
          </section>
        </main>
      ) : (
        <ContactView />
      )}

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Pablo Coelho</p>
        <div className="footer-links">
          <a
            href="https://www.instagram.com/pablotcoelho/?hl=en"
            target="_blank"
            rel="noreferrer"
          >
            <span aria-hidden="true">◎</span> Personal
          </a>
          <a
            href="https://www.instagram.com/comicshut/?hl=en"
            target="_blank"
            rel="noreferrer"
          >
            <span aria-hidden="true">◎</span> Comics Hut
          </a>
          <button type="button" onClick={() => navigate("about")}>
            About me
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;
