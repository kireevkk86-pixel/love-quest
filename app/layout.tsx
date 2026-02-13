import type { Metadata } from "next";
  import "./globals.css";

  export const metadata: Metadata = {
    title: "Love Quest",
    description: "Cute interactive love quest",
  };

  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="ru">
        <body>{children}</body>
      </html>
    );
  }

  Заменить app/globals.css на:

  :root {
    color-scheme: light;
    --bg-1: #ffe6f0;
    --bg-2: #f7f1ff;
    --bg-3: #e7fbff;
    --card: rgba(255, 255, 255, 0.78);
    --card-border: rgba(255, 255, 255, 0.6);
    --text: #2a2138;
    --muted: #6f5a7d;
    --accent: #ff5fa2;
    --accent-2: #ff8bd1;
    --shadow: 0 24px 60px rgba(67, 24, 94, 0.18);
  }

  * {
    box-sizing: border-box;
  }

  html,
  body {
    padding: 0;
    margin: 0;
    font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
      "Lucida Sans", Arial, sans-serif;
    color: var(--text);
    min-height: 100%;
    background: radial-gradient(circle at top left, var(--bg-1), transparent 55%),
      radial-gradient(circle at bottom right, var(--bg-3), transparent 55%),
      linear-gradient(135deg, var(--bg-2), #fff);
  }

  body::before,
  body::after {
    content: "";
    position: fixed;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    filter: blur(40px);
    opacity: 0.35;
    z-index: 0;
    pointer-events: none;
  }

  body::before {
    background: #ffc6dd;
    top: -80px;
    left: -80px;
  }

  body::after {
    background: #c6f1ff;
    bottom: -100px;
    right: -100px;
  }

  .page {
    position: relative;
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 32px 16px 56px;
    z-index: 1;
  }

  .card {
    width: min(640px, 92vw);
    background: var(--card);
    border: 1px solid var(--card-border);
    border-radius: 24px;
    padding: 28px;
    box-shadow: var(--shadow);
    backdrop-filter: blur(14px);
  }

  .card-top {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 18px;
  }

  .asset-status {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    font-size: 0.9rem;
    color: #8d6a9b;
  }

  .asset-error {
    font-size: 0.85rem;
    color: #c13f5d;
  }

  .music-status {
    font-size: 0.95rem;
    color: #7a5d88;
  }

  h1 {
    margin: 0;
    font-size: clamp(1.6rem, 3.3vw, 2.3rem);
  }

  p {
    margin: 0;
    line-height: 1.5;
    color: var(--muted);
  }

  .step {
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #8e6b9d;
  }

  .stack {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .row {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .btn {
    border: none;
    border-radius: 999px;
    padding: 12px 20px;
    font-size: 1rem;
    cursor: pointer;
    background: white;
    color: var(--text);
    box-shadow: 0 12px 22px rgba(255, 95, 162, 0.15);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .btn:hover,
  .btn:focus-visible {
    transform: translateY(-2px);
    box-shadow: 0 16px 28px rgba(255, 95, 162, 0.22);
  }

  .btn.primary {
    background: linear-gradient(135deg, var(--accent), var(--accent-2));
    color: white;
  }

  .btn.ghost {
    background: #fff3f8;
    color: #d14b84;
  }

  .btn:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
    box-shadow: none;
  }

  .slideshow {
    display: grid;
    place-items: center;
    width: 100%;
  }

  .photo {
    width: 100%;
    height: min(60vh, 520px);
    object-fit: contain;
    border-radius: 18px;
    border: 1px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 16px 30px rgba(74, 30, 107, 0.15);
    background: #fff7fb;
    opacity: 0;
    transition: opacity 0.35s ease;
  }

  .photo.loaded {
    opacity: 1;
  }

  .placeholder {
    width: 100%;
    height: min(60vh, 520px);
    border-radius: 18px;
    background: linear-gradient(135deg, #ffe3f0, #fff6dd);
    display: grid;
    place-items: center;
    text-align: center;
    color: #b5567a;
    font-weight: 600;
    gap: 8px;
  }

  .placeholder-heart {
    font-size: 2.2rem;
  }

  .no-area {
    position: relative;
    width: 100%;
    height: 120px;
    border-radius: 18px;
    background: #fff4fb;
    border: 1px dashed #f1c3da;
    display: grid;
    place-items: center;
    overflow: hidden;
  }

  .no-btn {
    position: absolute;
    left: 0;
    top: 0;
  }

  .meme {
    color: #b4648a;
    font-weight: 600;
  }

  .heart-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 18px;
    border-radius: 20px;
    background: #fff;
    border: 1px solid #ffe0ec;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .heart-card:hover {
    transform: translateY(-2px);
  }

  .heart-icon {
    font-size: 2.4rem;
    color: var(--accent);
  }

  .progress {
    width: 100%;
    height: 8px;
    background: #fde6f0;
    border-radius: 999px;
    overflow: hidden;
    margin: 8px 0 4px;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(135deg, #ff6aa9, #ff9dd1);
    border-radius: 999px;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.9rem;
    color: #a56789;
  }

  .toast {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(42, 33, 56, 0.9);
    color: white;
    padding: 12px 18px;
    border-radius: 999px;
    font-size: 0.95rem;
    z-index: 5;
  }

  .heart-layer {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 4;
  }

  .heart-particle {
    position: fixed;
    font-size: 1rem;
    animation: floatUp 1.2s ease-out forwards;
  }

  @keyframes floatUp {
    0% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translateY(-50px) scale(1.4);
    }
  }

  @media (max-width: 640px) {
    .card {
      padding: 22px;
    }

    .row {
      flex-direction: column;
    }

    .btn {
      width: 100%;
      justify-content: center;
    }

    .no-area {
      height: 140px;
    }

    .photo,
    .placeholder {
      height: min(45vh, 360px);
    }
  }

  Заменить app/page.tsx на:

  "use client";

  import { useEffect, useMemo, useRef, useState } from "react";

  type Particle = {
    id: number;
    x: number;
    y: number;
    size: number;
    rotate: number;
    hue: number;
  };

  type AssetsResponse = {
    photos: string[];
    music: string | null;
  };

  const TOTAL_STEPS = 7;
  const HEART_GOAL = 7;

  export default function Page() {
    const [step, setStep] = useState(1);
    const [slideIndex, setSlideIndex] = useState(0);
    const [broken, setBroken] = useState<Record<string, boolean>>({});
    const [toast, setToast] = useState<string | null>(null);
    const [hearts, setHearts] = useState(0);
    const [particles, setParticles] = useState<Particle[]>([]);
    const [photos, setPhotos] = useState<string[]>([]);
    const [musicUrl, setMusicUrl] = useState<string | null>(null);
    const [assetsError, setAssetsError] = useState<string | null>(null);
    const [playing, setPlaying] = useState(false);
    const [objectFit, setObjectFit] = useState<"contain" | "cover">("contain");
    const [photoLoaded, setPhotoLoaded] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const noAreaRef = useRef<HTMLDivElement | null>(null);
    const noRef = useRef<HTMLButtonElement | null>(null);
    const particleId = useRef(0);

    const hasPhotos = photos.length > 0;
    const currentPhoto = hasPhotos ? photos[slideIndex % photos.length] : null;
    const isPhotoBroken = currentPhoto ? broken[currentPhoto] : true;

    const stepLabel = useMemo(() => `Шаг ${step} из ${TOTAL_STEPS}`, [step]);

    useEffect(() => {
      let active = true;
      const loadAssets = async () => {
        try {
          const res = await fetch("/api/assets");
          if (!res.ok) {
            throw new Error(`Assets API error: ${res.status}`);
          }
          const data = (await res.json()) as AssetsResponse;
          if (!active) return;
          setPhotos(Array.isArray(data.photos) ? data.photos : []);
          setMusicUrl(data.music ?? null);
          setAssetsError(null);
        } catch (err) {
          if (!active) return;
          setAssetsError(err instanceof Error ? err.message : "Unknown error");
          setPhotos([]);
          setMusicUrl(null);
        }
      };
      loadAssets();
      return () => {
        active = false;
      };
    }, []);

    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;
      if (musicUrl) {
        audio.src = musicUrl;
        audio.load();
        if (playing) {
          audio.play().catch(() => {
            setPlaying(false);
          });
        }
      }
    }, [musicUrl, playing]);

    useEffect(() => {
      setSlideIndex(0);
    }, [photos.length]);

    useEffect(() => {
      if (step !== 3 || photos.length < 2) return;
      const timer = setInterval(() => {
        setSlideIndex((prev) => (prev + 1) % photos.length);
      }, 2500);
      return () => clearInterval(timer);
    }, [step, photos.length]);

    useEffect(() => {
      setObjectFit("contain");
      setPhotoLoaded(false);
    }, [currentPhoto]);

    useEffect(() => {
      if (step !== 4) return;
      const timer = setTimeout(() => moveNoButton(), 120);
      return () => clearTimeout(timer);
    }, [step]);

    const moveNoButton = () => {
      const area = noAreaRef.current;
      const btn = noRef.current;
      if (!area || !btn) return;
      const maxX = Math.max(0, area.clientWidth - btn.offsetWidth);
      const maxY = Math.max(0, area.clientHeight - btn.offsetHeight);
      const nextX = Math.random() * maxX;
      const nextY = Math.random() * maxY;
      btn.style.transform = `translate(${nextX}px, ${nextY}px)`;
    };

    const toggleMusic = async () => {
      if (!musicUrl) return;
      const audio = audioRef.current;
      if (!audio) return;
      try {
        if (audio.paused) {
          await audio.play();
          setPlaying(true);
        } else {
          audio.pause();
          setPlaying(false);
        }
      } catch {
        setPlaying(false);
      }
    };

    const markBroken = (src: string) => {
      setBroken((prev) => ({ ...prev, [src]: true }));
    };

    const showToast = (message: string) => {
      setToast(message);
      setTimeout(() => setToast(null), 1000);
    };

    const handleChoice = (message: string) => {
      showToast(message);
      setStep(6);
    };

    const collectHeart = () => {
      setHearts((prev) => Math.min(HEART_GOAL, prev + 1));
    };

    const restart = () => {
      setStep(1);
      setSlideIndex(0);
      setBroken({});
      setHearts(0);
      setToast(null);
    };

    const spawnParticles = (x: number, y: number) => {
      const burst = Array.from({ length: 6 }).map(() => {
        particleId.current += 1;
        return {
          id: particleId.current,
          x: x + (Math.random() * 24 - 12),
          y: y + (Math.random() * 24 - 12),
          size: 14 + Math.random() * 10,
          rotate: Math.random() * 40 - 20,
          hue: 330 + Math.random() * 20,
        };
      });
      setParticles((prev) => [...prev, ...burst]);
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => !burst.find((b) => b.id === p.id)));
      }, 1200);
    };

    const handlePointerDown = (event: React.PointerEvent) => {
      spawnParticles(event.clientX, event.clientY);
    };

    const screenTitle = (() => {
      if (step === 1) return "Привет!";
      if (step === 2) return "Включи нашу песню";
      if (step === 3) return "Наши фото за год";
      if (step === 4) return "Ты любишь меня?";
      if (step === 5) return "Мини-диалог с мемами";
      if (step === 6) return "Этот год — самый счастливый";
      return "Финал";
    })();

    return (
      <main className="page" onPointerDown={handlePointerDown}>
        <audio ref={audioRef} preload="auto" loop onEnded={() => {}} />
        <div className="card">
          <div className="card-top">
            <span className="step">{stepLabel}</span>
            <h1>{screenTitle}</h1>
            <div className="asset-status">
              <span>Фото: {photos.length}</span>
              <span>Музыка: {musicUrl ? "найдена" : "не найдена"}</span>
            </div>
            {!musicUrl && <span className="asset-error">Добавь mp3/ogg/wav в public/music</span>}
            {assetsError && (
              <span className="asset-error">Ошибка чтения файлов: {assetsError}</span>
            )}
          </div>

          {step === 1 && (
            <section className="stack">
              <p>
                Привет, любовь! Я приготовил маленький квест, чтобы улыбка
                появилась сразу.
              </p>
              <button className="btn primary" onClick={() => setStep(2)}>
                Начать квест
              </button>
            </section>
          )}

          {step === 2 && (
            <section className="stack">
              <p>
                Давай включим нашу песню. Она должна звучать только с твоего
                разрешения.
              </p>
              <div className="music-status">
                Музыка: {musicUrl ? "найдена" : "не найдена"}
              </div>
              <div className="row">
                <button className="btn" onClick={toggleMusic} disabled={!musicUrl}>
                  {playing ? "⏸ Пауза" : "▶ Музыка"}
                </button>
                <button className="btn primary" onClick={() => setStep(3)}>
                  Дальше
                </button>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="stack">
              <p>Наши кадры, которые сделали этот год особенным.</p>
              <div className="slideshow">
                {!hasPhotos || isPhotoBroken ? (
                  <div className="photo placeholder">
                    <div className="placeholder-heart">❤</div>
                    <span>Добавь фото в public/photos</span>
                  </div>
                ) : (
                  <img
                    className={`photo ${photoLoaded ? "loaded" : ""}`}
                    src={currentPhoto ?? ""}
                    alt="Наши фото"
                    style={{ objectFit }}
                    onLoad={(event) => {
                      const img = event.currentTarget;
                      const ratio = img.naturalWidth / img.naturalHeight;
                      setObjectFit(ratio > 1.35 ? "cover" : "contain");
                      setPhotoLoaded(true);
                    }}
                    onError={() => currentPhoto && markBroken(currentPhoto)}
                  />
                )}
              </div>
              <div className="row">
                <button
                  className="btn"
                  onClick={() =>
                    setSlideIndex((prev) =>
                      photos.length ? (prev - 1 + photos.length) % photos.length : 0
                    )
                  }
                  disabled={!hasPhotos}
                >
                  Назад
                </button>
                <button
                  className="btn"
                  onClick={() =>
                    setSlideIndex((prev) =>
                      photos.length ? (prev + 1) % photos.length : 0
                    )
                  }
                  disabled={!hasPhotos}
                >
                  Вперёд
                </button>
              </div>
              <button className="btn primary" onClick={() => setStep(4)}>
                Дальше
              </button>
            </section>
          )}

          {step === 4 && (
            <section className="stack">
              <p>Ты любишь меня?</p>
              <div className="row">
                <button className="btn primary" onClick={() => setStep(5)}>
                  Да ❤️
                </button>
              </div>
              <div className="no-area" ref={noAreaRef}>
                <button
                  ref={noRef}
                  className="btn ghost no-btn"
                  onPointerEnter={moveNoButton}
                  onPointerDown={moveNoButton}
                >
                  Нет
                </button>
                <span className="meme">Кирюша открой дверку</span>
              </div>
            </section>
          )}

          {step === 5 && (
            <section className="stack">
              <p>Она говорит, что я туплю 😅</p>
              <div className="stack">
                <button
                  className="btn"
                  onClick={() =>
                    handleChoice("Кирюша, открой дверку — срочно!")
                  }
                >
                  Да, Кирюша открой дверку
                </button>
                <button
                  className="btn"
                  onClick={() =>
                    handleChoice("Маша Попова тоже иногда тупит 😄")
                  }
                >
                  И Маша Попова тоже тупит иногда
                </button>
              </div>
            </section>
          )}

          {step === 6 && (
            <section className="stack">
              <p>
                Этот год — самый счастливый. Мы вместе уже больше года, и весь
                этот год для меня — самое тёплое место на свете.
              </p>
              <div className="heart-card" onClick={collectHeart}>
                <div className="heart-icon">❤</div>
                <div>
                  <strong>Собери 7 сердечек</strong>
                  <div className="progress">
                    <div
                      className="progress-fill"
                      style={{ width: `${(hearts / HEART_GOAL) * 100}%` }}
                    />
                  </div>
                  <span className="progress-text">
                    {hearts} / {HEART_GOAL}
                  </span>
                </div>
              </div>
              <button
                className="btn primary"
                onClick={() => setStep(7)}
                disabled={hearts < HEART_GOAL}
              >
                Открыть финал
              </button>
            </section>
          )}

          {step === 7 && (
            <section className="stack">
              <p>
                Я люблю тебя. В будущем мы поженимся. У нас будет собака по
                кличке Чертизанова 🐶
              </p>
              <div className="row">
                <button
                  className="btn"
                  onClick={() =>
                    alert("Сделай скриншот и отправь мне — будет супер мило!")
                  }
                >
                  Сделать скриншот и отправить
                </button>
                <button className="btn primary" onClick={restart}>
                  Пройти заново
                </button>
              </div>
            </section>
          )}
        </div>

        {toast && <div className="toast">{toast}</div>}

        <div className="heart-layer">
          {particles.map((particle) => (
            <span
              key={particle.id}
              className="heart-particle"
              style={{
                left: particle.x,
                top: particle.y,
                width: particle.size,
                height: particle.size,
                transform: `rotate(${particle.rotate}deg)`,
                color: `hsl(${particle.hue} 80% 70%)`,
              }}
            >
              ❤
            </span>
          ))}
        </div>
      </main>
    );
  }
