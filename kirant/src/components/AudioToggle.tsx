import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./AudioToggle.css";

declare global {
  interface Window {
    hasEnteredIntro?: boolean;
  }
}

const BGM_SRC = "/audios/bgm.mp3";
const VOLUME = 0.4;

type Props = {
  imgClassName?: string;
};

export function AudioToggle({ imgClassName = "" }: Props) {
  const { pathname } = useLocation();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const pref = localStorage.getItem("audioPreference");
    const entered = window.hasEnteredIntro === true;
    if (pref === "on" && (pathname !== "/" || entered)) {
      const id = window.setTimeout(() => setPlaying(true), 0);
      return () => window.clearTimeout(id);
    }
  }, [pathname]);

  useEffect(() => {
    const onPref = () => {
      const on = localStorage.getItem("audioPreference") === "on";
      setPlaying(on);
      if (on && audioRef.current) {
        const el = audioRef.current;
        el.volume = VOLUME;
        el.play().catch(() => {
          /* autoplay may still sync via playing effect */
        });
      }
    };
    window.addEventListener("audioPreferenceChanged", onPref);
    return () => window.removeEventListener("audioPreferenceChanged", onPref);
  }, []);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    try {
      const path = el.src ? new URL(el.src, window.location.origin).pathname : "";
      if (path !== BGM_SRC) {
        el.src = BGM_SRC;
        el.load();
      }
    } catch {
      el.src = BGM_SRC;
      el.load();
    }
    if (playing) {
      if (el.paused) {
        el.volume = VOLUME;
        el.play().catch(() => {});
      }
    } else {
      el.pause();
    }
  }, [playing]);

  function toggle() {
    const next = !playing;
    setPlaying(next);
    localStorage.setItem("audioPreference", next ? "on" : "off");
    window.dispatchEvent(new Event("audioPreferenceChanged"));
  }

  return (
    <div className="audio-toggle">
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Mute Audio" : "Unmute Audio"}
        className="audio-toggle__btn"
      >
        <img
          src={playing ? "/icons/volume.png" : "/icons/mute.png"}
          alt="sound-bar"
          width={32}
          height={32}
          className={`audio-toggle__icon ${imgClassName}`.trim()}
          decoding="async"
        />
      </button>
      <audio ref={audioRef} src={BGM_SRC} loop preload="auto">
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
