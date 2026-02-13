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

const PHOTOS = [
  "/photos/1.jpg",
  "/photos/2.jpg",
  "/photos/3.jpg",
  "/photos/4.jpg",
  "/photos/5.jpg",
];

const TOTAL_STEPS = 7;
const HEART_GOAL = 7;

export default function Page() {
  const [step, setStep] = useState(1);
  const [slideIndex, setSlideIndex] = useState(0);
  const [broken, setBroken] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [hearts, setHearts] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const noAreaRef = useRef<HTMLDivElement | null>(null);
  const noRef = useRef<HTMLButtonElement | null>(null);
  const particleId = useRef(0);

  const currentPhoto = PHOTOS[slideIndex];
  const isPhotoBroken = broken[currentPhoto];

  const stepLabel = useMemo(() => `Шаг ${step} из ${TOTAL_STEPS}`, [step]);

  useEffect(() => {
    if (step !== 3) return;
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % PHOTOS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [step]);

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
    const audio = audioRef.current;
    if (!audio) return;
    try {
      await audio.play();
    } catch {
      alert("Добавь song.mp3 в /public/music");
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
      <div className="card">
        <div className="card-top">
          <span className="step">{stepLabel}</span>
          <h1>{screenTitle}</h1>
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
            <audio ref={audioRef} src="/music/song.mp3" preload="none" />
            <div className="row">
              <button className="btn" onClick={playMusic}>
                ▶ Музыка
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
              {isPhotoBroken ? (
                <div className="photo placeholder">
                  <div className="placeholder-heart">❤</div>
                  <span>Добавь фото в /public/photos</span>
                </div>
              ) : (
                <img
                  className="photo"
                  src={currentPhoto}
                  alt="Наши фото"
                  onError={() => markBroken(currentPhoto)}
                />
              )}
            </div>
            <div className="row">
              <button
                className="btn"
                onClick={() =>
                  setSlideIndex((prev) => (prev - 1 + PHOTOS.length) % PHOTOS.length)
                }
              >
                Назад
              </button>
              <button
                className="btn"
                onClick={() =>
                  setSlideIndex((prev) => (prev + 1) % PHOTOS.length)
                }
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
