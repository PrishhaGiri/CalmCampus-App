
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PHASES = [
  { label: "Breathe In", duration: 4 },
  { label: "Hold", duration: 4 },
  { label: "Breathe Out", duration: 6 },
];

const TOTAL_CYCLES = 5;
const CYCLE_SECONDS = PHASES.reduce(
  (total, phase) => total + phase.duration,
  0
);

const MEDITATION_STEPS = [
  {
    title: "Find a Comfortable Position",
    text: "Sit comfortably with your feet resting on the floor, or lie down somewhere quiet. Relax your shoulders and allow your hands to rest naturally. You may close your eyes or soften your gaze.",
    tip: "Take your time. There is no need to rush.",
  },
  {
    title: "Notice Your Breathing",
    text: "Bring your attention to your natural breathing. Notice the air entering and leaving your body. You do not need to change the rhythm of your breath.",
    tip: "Simply observe each breath as it comes and goes.",
  },
  {
    title: "Relax Your Body",
    text: "Gently notice any tension in your forehead, jaw, shoulders, or hands. If comfortable, allow those areas to soften. Feel the support of the chair or ground beneath you.",
    tip: "Let your body settle at its own pace.",
  },
  {
    title: "Let Thoughts Come and Go",
    text: "You might notice thoughts about exams, assignments, or your day. That is completely normal. Imagine each thought as a cloud passing through the sky, then gently return your attention to the present.",
    tip: "You don't need to stop thinking to practice mindfulness.",
  },
  {
    title: "Practice a Moment of Kindness",
    text: "Think of something small that brings you comfort, or a person you appreciate. Silently remind yourself: 'I am doing my best, and I deserve moments of rest.'",
    tip: "Even a short pause can be meaningful.",
  },
  {
    title: "Return to the Present",
    text: "Notice the sounds around you and the feeling of your feet or body against the surface beneath you. Gently move your fingers and toes. When you are ready, look around the room.",
    tip: "Carry this moment of awareness into your day.",
  },
];

function StressRelief() {
  const navigate = useNavigate();
  const location = useLocation();

  const mood = location.state?.mood || "Exam Stress";
  const cameFromHobbies = location.state?.from === "/hobbies";

  // Breathing exercise
  const [breathingStatus, setBreathingStatus] = useState("idle");
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [breathingFinished, setBreathingFinished] = useState(false);

  const timerRef = useRef(null);
  const breathingRef = useRef({
    phaseIndex: 0,
    secondsLeft: 4,
    cycles: 0,
  });

  // Guided meditation
  const [meditationStep, setMeditationStep] = useState(0);
  const [meditationStarted, setMeditationStarted] = useState(false);
  const [meditationFinished, setMeditationFinished] = useState(false);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Start breathing from the beginning
  const startBreathing = () => {
    clearTimer();

    breathingRef.current = {
      phaseIndex: 0,
      secondsLeft: 4,
      cycles: 0,
    };

    setPhaseIndex(0);
    setSecondsLeft(4);
    setCompletedCycles(0);
    setBreathingFinished(false);
    setBreathingStatus("running");
  };

  // Pause breathing
  const pauseBreathing = () => {
    clearTimer();
    setBreathingStatus("paused");
  };

  // Resume from the same phase and second
  const resumeBreathing = () => {
    setBreathingStatus("running");
  };

  // Clicking the circle controls the exercise
  const handleCircleClick = () => {
    if (breathingStatus === "running") {
      pauseBreathing();
    } else if (breathingStatus === "paused") {
      resumeBreathing();
    } else {
      startBreathing();
    }
  };

  // Automatic breathing timer
  useEffect(() => {
    if (breathingStatus !== "running") return;

    timerRef.current = setInterval(() => {
      const current = breathingRef.current;

      if (current.secondsLeft > 1) {
        current.secondsLeft -= 1;
        setSecondsLeft(current.secondsLeft);
        return;
      }

      // A complete cycle ends after exhaling
      if (current.phaseIndex === PHASES.length - 1) {
        current.cycles += 1;
        setCompletedCycles(current.cycles);

        if (current.cycles >= TOTAL_CYCLES) {
          clearInterval(timerRef.current);
          timerRef.current = null;

          setBreathingFinished(true);
          setBreathingStatus("finished");
          setSecondsLeft(0);
          return;
        }
      }

      // Move to the next breathing phase
      current.phaseIndex =
        (current.phaseIndex + 1) % PHASES.length;

      current.secondsLeft =
        PHASES[current.phaseIndex].duration;

      setPhaseIndex(current.phaseIndex);
      setSecondsLeft(current.secondsLeft);
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [breathingStatus]);

  // Meditation functions
  const startMeditation = () => {
    setMeditationStep(0);
    setMeditationStarted(true);
    setMeditationFinished(false);
  };

  const nextMeditation = () => {
    if (meditationStep < MEDITATION_STEPS.length - 1) {
      setMeditationStep((previous) => previous + 1);
    } else {
      setMeditationStarted(false);
      setMeditationFinished(true);
    }
  };

  const previousMeditation = () => {
    setMeditationStep((previous) => Math.max(0, previous - 1));
  };

  // Navigation
  const handleBack = () => {
    navigate(cameFromHobbies ? "/hobbies" : "/checkin", {
      state: { mood },
    });
  };

  const handleExploreHobbies = () => {
    navigate("/hobbies", {
      state: { mood },
    });
  };

  const handleFinish = () => {
    const activities = [];

    if (breathingFinished) {
      activities.push("Deep Breathing Exercise");
    }

    if (meditationFinished) {
      activities.push("Guided Meditation");
    }

    navigate("/reflection", {
      state: {
        mood,
        activities,
        from: "/stress-relief",
      },
    });
  };

  // Breathing animation calculations
  const currentPhase = PHASES[phaseIndex];

  const phaseProgress =
    breathingStatus === "finished"
      ? 1
      : (currentPhase.duration - secondsLeft) /
        currentPhase.duration;

  const completedPhaseSeconds = PHASES.reduce(
    (total, phase, index) =>
      total + (index < phaseIndex ? phase.duration : 0),
    0
  );

  const elapsedSeconds =
    completedCycles * CYCLE_SECONDS +
    completedPhaseSeconds +
    (currentPhase.duration - secondsLeft);

  const progress =
    breathingStatus === "finished"
      ? 100
      : Math.min(
          100,
          Math.max(
            0,
            (elapsedSeconds / (TOTAL_CYCLES * CYCLE_SECONDS)) *
              100
          )
        );

  const circleScale =
    breathingStatus === "idle" ||
    breathingStatus === "finished"
      ? 0.9
      : phaseIndex === 0
      ? 0.84 + phaseProgress * 0.16
      : phaseIndex === 1
      ? 1
      : 1 - phaseProgress * 0.16;

  return (
    <main className="cc-calm-page">
      <div className="cc-calm-container">

        {/* BACK BUTTON */}
        <button
          type="button"
          className="cc-calm-back"
          onClick={handleBack}
        >
          ← Back
        </button>

        {/* PAGE HEADING */}
        <header className="cc-calm-heading">
          <span className="cc-calm-heading-flower">🪷</span>

          <h1>Find Your Calm</h1>

          <p>
            Take a mindful break. Breathe, relax, and recharge.
          </p>
        </header>

        <div className="cc-calm-grid">

          {/* ===================================
              BREATHING EXERCISE
          =================================== */}
          <section className="cc-calm-card">

            <div className="cc-calm-card-heading">
              <span className="cc-calm-card-icon">🌬️</span>

              <div>
                <h2>Breathing Exercise</h2>
                <p>
                  Follow the circle and focus on your breath.
                </p>
              </div>
            </div>

            <div className="cc-breathing-workspace">

              {/* INTERACTIVE PURPLE CIRCLE */}
              <div className="cc-breathing-left">

                <div
                  className="cc-breathing-ring"
                  style={{
                    "--progress": `${progress}%`,
                  }}
                >
                  <button
                    type="button"
                    className="cc-breathing-circle"
                    onClick={handleCircleClick}
                    style={{
                      transform: `scale(${circleScale})`,
                    }}
                    aria-label={
                      breathingStatus === "running"
                        ? "Pause breathing exercise"
                        : breathingStatus === "paused"
                        ? "Resume breathing exercise"
                        : "Start breathing exercise"
                    }
                  >
                    <strong>
                      {breathingStatus === "idle"
                        ? "Tap to Begin"
                        : breathingStatus === "paused"
                        ? "Paused"
                        : breathingStatus === "finished"
                        ? "Well Done!"
                        : currentPhase.label}
                    </strong>

                    <span>
                      {breathingStatus === "running" ||
                      breathingStatus === "paused"
                        ? `${secondsLeft}s`
                        : breathingStatus === "finished"
                        ? "✓"
                        : "4 · 4 · 6"}
                    </span>
                  </button>
                </div>

                {/* CYCLE PROGRESS */}
                <p className="cc-breath-cycle">
                  {breathingStatus === "finished"
                    ? "Session completed!"
                    : `Cycle ${Math.min(
                        completedCycles + 1,
                        TOTAL_CYCLES
                      )} of ${TOTAL_CYCLES}`}
                </p>

                <div className="cc-breath-dots">
                  {Array.from(
                    { length: TOTAL_CYCLES },
                    (_, index) => (
                      <span
                        key={index}
                        className={
                          index < completedCycles
                            ? "completed"
                            : ""
                        }
                      />
                    )
                  )}
                </div>
              </div>

              {/* BREATHING INSTRUCTIONS */}
              <div className="cc-breathing-right">

                <div className="cc-breath-phases">
                  {PHASES.map((phase, index) => (
                    <div
                      key={phase.label}
                      className={`cc-breath-phase ${
                        phaseIndex === index &&
                        breathingStatus === "running"
                          ? "active"
                          : ""
                      }`}
                    >
                      <span className="cc-phase-dot" />

                      <span>{phase.label}</span>

                      <strong>{phase.duration}s</strong>
                    </div>
                  ))}
                </div>

                {/* SIMPLE CLICK-TO-BREATHE MESSAGE */}
                <p className="cc-breath-hint">
                  {breathingStatus === "idle" &&
                    "Tap the circle to begin breathing."}

                  {breathingStatus === "running" &&
                    "Tap the circle to pause whenever you need."}

                  {breathingStatus === "paused" &&
                    "Take your time. Tap the circle to resume."}

                  {breathingStatus === "finished" &&
                    "Wonderful! Tap the circle to practice again."}
                </p>

              </div>
            </div>
          </section>

          {/* ===================================
              GUIDED MEDITATION
          =================================== */}
          <section className="cc-calm-card">

            <div className="cc-calm-card-heading">
              <span className="cc-calm-card-icon">🧘</span>

              <div>
                <h2>Guided Meditation</h2>
                <p>
                  A peaceful, self-paced mindfulness practice.
                </p>
              </div>
            </div>

            {/* MEDITATION ILLUSTRATION */}
            <div className="cc-meditation-illustration">
              <div className="cc-meditation-sun" />
              <div className="cc-meditation-hill hill-one" />
              <div className="cc-meditation-hill hill-two" />

              <span className="cc-meditation-emoji">
                🧘‍♀️
              </span>
            </div>

            {/* MEDITATION CONTENT */}
            <div className="cc-meditation-content">

              {!meditationStarted && !meditationFinished && (
                <>
                  <span className="cc-meditation-eyebrow">
                    A moment for yourself
                  </span>

                  <h3>Ready to slow down?</h3>

                  <p>
                    Follow six gentle steps to relax your body,
                    observe your thoughts, and return to the
                    present. Take as long as you need with
                    each step.
                  </p>

                  <button
                    type="button"
                    className="cc-meditation-start"
                    onClick={startMeditation}
                  >
                    Begin Meditation →
                  </button>
                </>
              )}

              {meditationStarted && (
                <>
                  <span className="cc-meditation-eyebrow">
                    Step {meditationStep + 1} of{" "}
                    {MEDITATION_STEPS.length}
                  </span>

                  <h3>
                    {MEDITATION_STEPS[meditationStep].title}
                  </h3>

                  <p>
                    {MEDITATION_STEPS[meditationStep].text}
                  </p>

                  <p className="cc-meditation-tip">
                    🌿 {MEDITATION_STEPS[meditationStep].tip}
                  </p>

                  <div className="cc-meditation-actions">
                    <button
                      type="button"
                      className="cc-meditation-previous"
                      onClick={previousMeditation}
                      disabled={meditationStep === 0}
                    >
                      ← Previous
                    </button>

                    <button
                      type="button"
                      className="cc-meditation-start"
                      onClick={nextMeditation}
                    >
                      {meditationStep ===
                      MEDITATION_STEPS.length - 1
                        ? "Complete ✓"
                        : "Next Step →"}
                    </button>
                  </div>
                </>
              )}

              {meditationFinished && (
                <>
                  <span className="cc-meditation-eyebrow">
                    Practice completed
                  </span>

                  <h3>Beautifully Done! 🌸</h3>

                  <p>
                    You took a moment to care for yourself.
                    Notice how you feel before returning
                    to your day.
                  </p>

                  <button
                    type="button"
                    className="cc-meditation-start"
                    onClick={startMeditation}
                  >
                    Practice Again ↻
                  </button>
                </>
              )}
            </div>
          </section>
        </div>

        {/* BOTTOM NAVIGATION */}
        <div className="cc-calm-bottom">

          <button
            type="button"
            className="cc-calm-hobbies"
            onClick={handleExploreHobbies}
          >
            Explore Hobbies →
          </button>

          <button
            type="button"
            className="cc-calm-reflect"
            onClick={handleFinish}
          >
            Finish & Reflect →
          </button>

        </div>
      </div>
    </main>
  );
}

export default StressRelief;




