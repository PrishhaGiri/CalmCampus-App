
import { useEffect, useState } from "react";

const TOTAL_SECONDS = 60;
const INHALE_SECONDS = 4;
const EXHALE_SECONDS = 4;

function BreathingCircle() {
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((previous) => {
        if (previous <= 1) {
          setIsRunning(false);
          return 0;
        }
        return previous - 1;
      });

      setElapsed((previous) => previous + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const cycleLength = INHALE_SECONDS + EXHALE_SECONDS;
  const phase = elapsed % cycleLength < INHALE_SECONDS
    ? "Inhale"
    : "Exhale";

  const progress = ((TOTAL_SECONDS - secondsLeft) / TOTAL_SECONDS) * 100;

  const restart = () => {
    setIsRunning(false);
    setSecondsLeft(TOTAL_SECONDS);
    setElapsed(0);
  };

  return (
    <div className="breathing-exercise">
      <p className="breathing-instruction">
        Follow the circle and breathe gently at your own pace.
      </p>

      <div className="breathing-visual">
        <div
          className={`breathing-circle ${
            isRunning ? "breathing-active" : ""
          }`}
        >
          <span className="breathing-phase">
            {secondsLeft === 0
              ? "Well done!"
              : isRunning
              ? phase
              : "Ready?"}
          </span>

          <span className="breathing-timer">
            {`0:${String(secondsLeft).padStart(2, "0")}`}
          </span>
        </div>
      </div>

      <div
        className="breathing-progress"
        role="progressbar"
        aria-label="Breathing exercise progress"
        aria-valuemin={0}
        aria-valuemax={60}
        aria-valuenow={TOTAL_SECONDS - secondsLeft}
      >
        <div
          className="breathing-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="breathing-controls">
        <button
          type="button"
          className="breathing-primary-btn"
          onClick={() => setIsRunning((previous) => !previous)}
          disabled={secondsLeft === 0}
        >
          {isRunning ? "Pause" : secondsLeft === TOTAL_SECONDS
            ? "Start Breathing"
            : "Resume"}
        </button>

        <button
          type="button"
          className="breathing-secondary-btn"
          onClick={restart}
        >
          Restart
        </button>
      </div>

      {secondsLeft === 0 && (
        <p className="breathing-complete">
          You completed your one-minute breathing exercise.
        </p>
      )}
    </div>
  );
}

export default BreathingCircle;
