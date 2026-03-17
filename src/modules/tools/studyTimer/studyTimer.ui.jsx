"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Pause, Play, RotateCcw, Sparkles } from "lucide-react";
import {
  clampMinutes,
  clearTimerState,
  formatTime,
  getInitialTimerSnapshot,
  saveSessionState,
  saveTimerState,
  studyTimerDefaults,
} from "@/modules/tools/studyTimer/studyTimer.logic";

function playChime() {
  if (typeof window === "undefined") return;

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = 880;
  gain.gain.value = 0.05;

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start();
  oscillator.stop(context.currentTime + 0.2);
  oscillator.onended = () => context.close();
}

export default function StudyTimerUI({ defaults = studyTimerDefaults }) {
  const initialSnapshot = useMemo(() => getInitialTimerSnapshot(defaults), [defaults]);
  const initialState = initialSnapshot.state;
  const [mode, setMode] = useState(initialState.mode);
  const [status, setStatus] = useState(initialState.status);
  const [focusMinutes, setFocusMinutes] = useState(initialState.focusMinutes);
  const [breakMinutes, setBreakMinutes] = useState(initialState.breakMinutes);
  const [timeLeft, setTimeLeft] = useState(initialState.timeLeft);
  const [sessionsCompleted, setSessionsCompleted] = useState(initialState.sessionsCompleted);
  const [message, setMessage] = useState(initialState.message);
  const [endTime, setEndTime] = useState(initialState.endTime);
  const completionGuard = useRef(false);
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const totalSeconds = useMemo(() => {
    const minutes = mode === "focus" ? focusMinutes : breakMinutes;
    return Math.max(1, minutes) * 60;
  }, [mode, focusMinutes, breakMinutes]);

  const progress = useMemo(() => {
    if (!totalSeconds) return 0;
    const percent = ((totalSeconds - timeLeft) / totalSeconds) * 100;
    return Math.min(100, Math.max(0, percent));
  }, [totalSeconds, timeLeft]);

  const renderMode = isMounted ? mode : "focus";
  const renderFocusMinutes = isMounted ? focusMinutes : defaults.focusMinutes;
  const renderBreakMinutes = isMounted ? breakMinutes : defaults.breakMinutes;
  const renderTotalSeconds =
    (renderMode === "focus" ? renderFocusMinutes : renderBreakMinutes) * 60;
  const renderTimeLeft = isMounted ? timeLeft : renderTotalSeconds;
  const renderProgress = isMounted ? progress : 0;
  const renderStatus = isMounted ? status : "idle";
  const renderMessage = isMounted ? message : "Ready to focus when you are.";
  const renderSessions = isMounted ? sessionsCompleted : 0;

  const handleComplete = useCallback(() => {
    if (completionGuard.current) return;
    completionGuard.current = true;
    setStatus("idle");
    setEndTime(null);
    playChime();

    if (mode === "focus") {
      const nextTime = breakMinutes * 60;
      setMode("break");
      setTimeLeft(nextTime);
      setMessage("Focus complete! Time for a break.");
      saveTimerState({
        status: "idle",
        mode: "break",
        timeLeft: nextTime,
        focusMinutes,
        breakMinutes,
      });
      return;
    }

    setSessionsCompleted((previous) => {
      const nextCount = previous + 1;
      saveSessionState(nextCount);
      return nextCount;
    });
    const nextTime = focusMinutes * 60;
    setMode("focus");
    setTimeLeft(nextTime);
    setMessage("Break complete! Ready to focus again.");
    saveTimerState({
      status: "idle",
      mode: "focus",
      timeLeft: nextTime,
      focusMinutes,
      breakMinutes,
    });
  }, [mode, breakMinutes, focusMinutes]);

  useEffect(() => {
    completionGuard.current = false;
    if (initialSnapshot.persist?.timerState) {
      saveTimerState(initialSnapshot.persist.timerState);
    }
    if (typeof initialSnapshot.persist?.sessionCount === "number") {
      saveSessionState(initialSnapshot.persist.sessionCount);
    }
  }, [initialSnapshot.persist]);

  useEffect(() => {
    if (status !== "running" || !endTime) return undefined;

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        handleComplete();
      }
    };

    tick();
    const interval = window.setInterval(tick, 1000);

    return () => window.clearInterval(interval);
  }, [status, endTime, handleComplete]);

  useEffect(() => {
    const handleVisibility = () => {
      if (status !== "running" || !endTime) return;
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        handleComplete();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [status, endTime, handleComplete]);

  function handleStartPause() {
    if (status === "running") {
      setStatus("paused");
      setEndTime(null);
      setMessage("Timer paused. Resume when ready.");
      saveTimerState({
        status: "paused",
        mode,
        timeLeft,
        focusMinutes,
        breakMinutes,
      });
      return;
    }

    const nextTime = timeLeft > 0 ? timeLeft : totalSeconds;
    const nextEndTime = Date.now() + nextTime * 1000;
    setTimeLeft(nextTime);
    setEndTime(nextEndTime);
    setStatus("running");
    completionGuard.current = false;
    setMessage(mode === "focus" ? "Stay focused. You are building momentum." : "Break time. Recharge.");
    saveTimerState({
      status: "running",
      mode,
      endTime: nextEndTime,
      focusMinutes,
      breakMinutes,
    });
  }

  function handleReset() {
    setStatus("idle");
    setEndTime(null);
    setTimeLeft(totalSeconds);
    completionGuard.current = false;
    setMessage("Session reset. Ready when you are.");
    clearTimerState();
  }

  function handleFocusChange(event) {
    const value = clampMinutes(Number(event.target.value), 5, 90);
    setFocusMinutes(value);
    if (mode === "focus" && status === "idle") {
      const nextTime = value * 60;
      setTimeLeft(nextTime);
      saveTimerState({
        status: "idle",
        mode,
        timeLeft: nextTime,
        focusMinutes: value,
        breakMinutes,
      });
      return;
    }
    if (status !== "running") {
      saveTimerState({
        status,
        mode,
        timeLeft,
        focusMinutes: value,
        breakMinutes,
      });
    }
  }

  function handleBreakChange(event) {
    const value = clampMinutes(Number(event.target.value), 3, 30);
    setBreakMinutes(value);
    if (mode === "break" && status === "idle") {
      const nextTime = value * 60;
      setTimeLeft(nextTime);
      saveTimerState({
        status: "idle",
        mode,
        timeLeft: nextTime,
        focusMinutes,
        breakMinutes: value,
      });
      return;
    }
    if (status !== "running") {
      saveTimerState({
        status,
        mode,
        timeLeft,
        focusMinutes,
        breakMinutes: value,
      });
    }
  }

  const modeLabel = renderMode === "focus" ? "Focus" : "Break";
  const goalText = `Complete ${defaults.goalSessions} sessions today`;
  const isRunning = status === "running";

  return (
    <section className="tool-page study-timer">
      <header className="tool-header">
        <div>
          <p className="tool-kicker">Focus Workspace</p>
          <h1>Study Timer</h1>
          <p>Stay focused with guided study sessions.</p>
        </div>
        <div className="study-timer-meta">
          <span className={`study-chip ${renderMode}`}>Mode: {modeLabel}</span>
          <span className="study-chip">Sessions today: {renderSessions}</span>
        </div>
      </header>

      <div className="dashboard-panel study-timer-panel">
        <div className="study-timer-main">
          <div className={`study-timer-display ${renderMode}`}>{formatTime(renderTimeLeft)}</div>
          <div className={`study-timer-progress ${renderMode}`} aria-hidden="true">
            <span style={{ width: `${renderProgress}%` }} />
          </div>
          <div className="study-timer-controls">
            <button
              type="button"
              className="btn-cta-green study-timer-primary"
              onClick={handleStartPause}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRunning ? "Pause" : status === "paused" ? "Resume" : "Start"}
            </button>
            <button
              type="button"
              className="study-timer-reset"
              onClick={handleReset}
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
          <p className="study-timer-message" aria-live="polite">{renderMessage}</p>
          <div className="study-timer-goal">
            <Sparkles className="w-4 h-4" />
            <span>{goalText}</span>
          </div>
        </div>

        <div className="study-timer-settings">
          <h3>Customize your session</h3>
          <p>Adjust focus and break durations to match your rhythm.</p>
          <div className="study-timer-inputs">
            <label className="study-timer-input">
              <span>Focus minutes</span>
              <input
                type="number"
                min={5}
                max={90}
                value={renderFocusMinutes}
                onChange={handleFocusChange}
                disabled={isRunning}
              />
            </label>
            <label className="study-timer-input">
              <span>Break minutes</span>
              <input
                type="number"
                min={3}
                max={30}
                value={renderBreakMinutes}
                onChange={handleBreakChange}
                disabled={isRunning}
              />
            </label>
          </div>
          <p className="study-timer-hint">
            Tip: Finish a focus session to unlock a short, refreshing break.
          </p>
        </div>
      </div>
    </section>
  );
}
