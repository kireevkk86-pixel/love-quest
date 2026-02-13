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
    photoFiles: string[];
    musicFiles: string[];
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
    const [photoFiles, setPhotoFiles] = useState<string[]>([]);
    const [musicFiles, setMusicFiles] = useState<string[]>([]);
    const [assetsError, setAssetsError] = useState<string | null>(null);
    const [playing, setPlaying] = useState(false);
    const [objectFit, setObjectFit] = useState<"contain" | "cover">("contain");

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
          setPhotoFiles(Array.isArray(data.photoFiles) ? data.photoFiles : []);
          setMusicFiles(Array.isArray(data.musicFiles) ? data.musicFiles : []);
          setAssetsError(null);
        } catch (err) {
          if (!active) return;
          setAssetsError(err instanceof Error ? err.message : "Unknown error");
          setPhotos([]);
          setMusicUrl(null);
          setPhotoFiles([]);
          setMusicFiles([]);
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

    const playMusic = async () => {
      if (!musicUrl) {
        alert("Добавь mp3/ogg/wav в public/music");
        return;
      }
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
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        alert(`Не удалось включить: ${message}`);
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
              <span>Фото: {photoFiles.length}</span>
              <span>Музыка: {musicFiles[0] ?? "не найдена"}</span>
            </div>
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
                <button className="btn" onClick={playMusic}>
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
                    className="photo"
                    src={currentPhoto ?? ""}
                    alt="Наши фото"
                    style={{ objectFit }}
                    onLoad={(event) => {
                      const img = event.currentTarget;
                      const ratio = img.naturalWidth / img.naturalHeight;
                      setObjectFit(ratio > 1.35 ? "cover" : "contain");
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
