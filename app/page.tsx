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

type QuizQuestion = {
  image: string | null;
  prompt: string;
  options: [string, string, string];
  correctIndex: 0 | 1 | 2;
  successToast?: string;
  failToast?: string;
};

type EffectPayload = {
  image: string | null;
  sfx: string | null;
};

// МЕНЯЙ ЗДЕСЬ
const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    image: "/quiz/q1.jpg",
    prompt: "Кто это?",
    options: [
      "Ким Чен Инчик мой любииимыый!!!",
      "Васап Бейджин",
      "Президент Южной Кореи",
    ],
    correctIndex: 0,
    successToast: "Верно! ❤️",
    failToast: "Не-а 😅 попробуй ещё",
  },
  {
    image: "/quiz/q2.jpg",
    prompt: "Кто это?",
    options: [
      "Винни Пух",
      "Си Цзиньпин великий вождь",
      "Миска риса",
    ],
    correctIndex: 1,
    successToast: "Верно! ❤️",
    failToast: "Не-а 😅 попробуй ещё",
  },
  {
    image: "/quiz/q3.jpg",
    prompt: "Кто это?",
    options: [
      "Райан Гослинг",
      "хз",
      "мужик который лежит у меня в кровати",
    ],
    correctIndex: 2,
    successToast: "Верно! ❤️",
    failToast: "Не-а 😅 попробуй ещё",
  },
  {
    image: "/quiz/q4.jpg",
    prompt: "Чей Тайланд?",
    options: ["ебучие США", "великий Китай", "независимое государство"],
    correctIndex: 1,
    successToast: "Верно! ❤️",
    failToast: "Не-а 😅 попробуй ещё",
  },
];

const TOTAL_STEPS = 8;
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

  const [quizIndex, setQuizIndex] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [quizFit, setQuizFit] = useState<"contain" | "cover">("contain");
  const [quizLoaded, setQuizLoaded] = useState(false);
  const [effectModalOpen, setEffectModalOpen] = useState(false);
  const [effectImageSrc, setEffectImageSrc] = useState<string | null>(null);
  const [effectSfxSrc, setEffectSfxSrc] = useState<string | null>(null);
  const [effectImageOk, setEffectImageOk] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sfxRef = useRef<HTMLAudioElement | null>(null);
  const noAreaRef = useRef<HTMLDivElement | null>(null);
  const noRef = useRef<HTMLButtonElement | null>(null);
  const pledgeAreaRef = useRef<HTMLDivElement | null>(null);
  const pledgeNoRef = useRef<HTMLButtonElement | null>(null);
  const particleId = useRef(0);

  const hasPhotos = photos.length > 0;
  const currentPhoto = hasPhotos ? photos[slideIndex % photos.length] : null;
  const isPhotoBroken = currentPhoto ? broken[currentPhoto] : true;
  const currentQuiz = QUIZ_QUESTIONS[quizIndex];

  const stepLabel = useMemo(() => `Шаг ${step} из ${TOTAL_STEPS}`,[step]);

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
    audio.volume = 0.5;
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicUrl) {
      audio.src = musicUrl;
      audio.volume = 0.5;
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
    const timer = setTimeout(
      () => moveNoButton(noAreaRef.current, noRef.current),
      120
    );
    return () => clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    if (step !== 5) return;
    const timer = setTimeout(
      () => moveNoButton(pledgeAreaRef.current, pledgeNoRef.current),
      120
    );
    return () => clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    if (step !== 6) return;
    setQuizIndex(0);
    setQuizDone(false);
    setQuizFit("contain");
    setQuizLoaded(false);
  }, [step]);

  const moveNoButton = (
    area: HTMLDivElement | null,
    btn: HTMLButtonElement | null
  ) => {
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
      audio.volume = 0.5;
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

  const playSfx = async (src: string | null) => {
    if (!src) {
      showToast("файл эффекта не найден");
      return;
    }
    const sfx = sfxRef.current;
    if (!sfx) return;
    try {
      sfx.src = src;
      sfx.volume = 0.9;
      sfx.currentTime = 0;
      await sfx.play();
    } catch {
      showToast("файл эффекта не найден");
    }
  };

  const openEffect = (effect: EffectPayload) => {
    setEffectImageSrc(effect.image ?? null);
    setEffectSfxSrc(effect.sfx ?? null);
    setEffectImageOk(true);
    setEffectModalOpen(true);
    if (effect.sfx) {
      playSfx(effect.sfx);
    } else {
      showToast("файл эффекта не найден");
    }
  };

  const getEffectForAnswer = (
    questionIndex: number,
    answerIndex: number
  ): EffectPayload | null => {
    if (questionIndex === 0 && answerIndex === 2) {
      return {
        image: "/quiz/effects/q1_korea.jpg",
        sfx: "/sfx/siren.mp3",
      };
    }
    if (questionIndex === 1 && (answerIndex === 0 || answerIndex === 2)) {
      return {
        image: "/quiz/effects/q2_wrong.jpg",
        sfx: "/sfx/q2_wrong.mp3",
      };
    }
    if (questionIndex === 3 && (answerIndex === 0 || answerIndex === 2)) {
      return {
        image: "/quiz/effects/q4_wrong_thailand.jpg",
        sfx: "/sfx/q4_wrong_thailand.mp3",
      };
    }
    return null;
  };

  const markBroken = (src: string) => {
    setBroken((prev) => ({ ...prev, [src]: true }));
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 1000);
  };

  const handleQuizAnswer = (index: number) => {
    if (quizDone || !currentQuiz) return;
    const effect = getEffectForAnswer(quizIndex, index);
    if (effect) {
      openEffect(effect);
      return;
    }
    if (index === currentQuiz.correctIndex) {
      showToast(currentQuiz.successToast ?? "Верно! ❤️");
      const nextIndex = quizIndex + 1;
      if (nextIndex >= QUIZ_QUESTIONS.length) {
        setQuizDone(true);
      } else {
        setQuizIndex(nextIndex);
        setQuizFit("contain");
        setQuizLoaded(false);
      }
      return;
    }
    showToast(currentQuiz.failToast ?? "Не-а 😅 попробуй ещё");
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
    if (step === 5) return "Клянись любовью ❤️";
    if (step === 6) return "Тест: моя ли ты любовь?";
    if (step === 7) return "Этот год — самый счастливый";
    return "Финал";
  })();

  return (
    <main className="page" onPointerDown={handlePointerDown}>
      <audio ref={audioRef} preload="auto" loop onEnded={() => {}} />
      <audio ref={sfxRef} preload="auto" />
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
                onPointerEnter={() => moveNoButton(noAreaRef.current, noRef.current)}
                onPointerDown={() => moveNoButton(noAreaRef.current, noRef.current)}
              >
                Нет
              </button>
              <span className="meme">Кирюша открой дверку</span>
            </div>
          </section>
        )}

        {step === 5 && (
          <section className="stack">
            <p>Клянись любовью ❤️</p>
            <div className="row">
              <button className="btn primary" onClick={() => setStep(6)}>
                Клянусь ❤️
              </button>
            </div>
            <div className="no-area" ref={pledgeAreaRef}>
              <button
                ref={pledgeNoRef}
                className="btn ghost no-btn"
                onPointerEnter={() =>
                  moveNoButton(pledgeAreaRef.current, pledgeNoRef.current)
                }
                onPointerDown={() =>
                  moveNoButton(pledgeAreaRef.current, pledgeNoRef.current)
                }
              >
                Нет
              </button>
              <span className="meme">Кирюша открой дверку</span>
            </div>
          </section>
        )}

        {step === 6 && (
          <section className="stack">
            <p>Ответь на несколько вопросов ✨</p>
            {!quizDone && currentQuiz && (
              <>
                <div className="quiz-progress">
                  Вопрос {quizIndex + 1} / {QUIZ_QUESTIONS.length}
                </div>
                {currentQuiz.image && (
                  <div className="slideshow">
                    <img
                      className={`quiz-image ${quizLoaded ? "loaded" : ""}`}
                      src={currentQuiz.image}
                      alt="Картинка вопроса"
                      style={{ objectFit: quizFit }}
                      onLoad={(event) => {
                        const img = event.currentTarget;
                        const ratio = img.naturalWidth / img.naturalHeight;
                        setQuizFit(ratio > 1.35 ? "cover" : "contain");
                        setQuizLoaded(true);
                      }}
                      onError={() => {
                        setQuizLoaded(false);
                        showToast("файл эффекта не найден");
                      }}
                    />
                  </div>
                )}
                <p>{currentQuiz.prompt}</p>
                <div className="stack">
                  {currentQuiz.options.map((option, index) => (
                    <button
                      key={`${quizIndex}-${option}`}
                      className="btn"
                      onClick={() => handleQuizAnswer(index)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </>
            )}
            {quizDone && (
              <div className="stack">
                <p>Ты точно моя любовь ❤️</p>
                <button className="btn primary" onClick={() => setStep(7)}>
                  Дальше
                </button>
              </div>
            )}
          </section>
        )}

        {step === 7 && (
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
              onClick={() => setStep(8)}
              disabled={hearts < HEART_GOAL}
            >
              Открыть финал
            </button>
          </section>
        )}

        {step === 8 && (
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

      {effectModalOpen && (
        <div className="effect-overlay">
          <div className="effect-card">
            {effectImageSrc && effectImageOk && (
              <img
                className="effect-image"
                src={effectImageSrc}
                alt="Эффект"
                onError={() => {
                  setEffectImageOk(false);
                  showToast("файл эффекта не найден");
                }}
              />
            )}
            {!effectImageOk && (
              <p>Эффект не загрузился 😅</p>
            )}
            <div className="effect-actions">
              <button
                className="btn primary"
                onClick={() => setEffectModalOpen(false)}
              >
                Ок
              </button>
            </div>
          </div>
        </div>
      )}

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
