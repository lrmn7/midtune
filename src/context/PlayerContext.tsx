import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { Track } from "@/types";

interface PlayerState {
  current: Track | null;
  isPlaying: boolean;
  isVisible: boolean;
  isExpanded: boolean;
  currentTime: number;
  duration: number;
  play: (t: Track) => void;
  toggle: () => void;
  stop: () => void;
  close: () => void;
  seek: (s: number) => void;
  setExpanded: (v: boolean) => void;
}

const Ctx = createContext<PlayerState | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [current, setCurrent] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const a = new Audio();
    a.preload = "metadata";
    audioRef.current = a;

    const onTime = () => setCurrentTime(a.currentTime);
    const onMeta = () => setDuration(a.duration || 0);
    const onEnd = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("durationchange", onMeta);
    a.addEventListener("ended", onEnd);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);

    return () => {
      a.pause();
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("durationchange", onMeta);
      a.removeEventListener("ended", onEnd);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
    };
  }, []);

  const play = (t: Track) => {
    const a = audioRef.current;
    if (!a) return;
    setIsVisible(true);
    if (current?.id !== t.id) {
      setCurrent(t);
      setCurrentTime(0);
      setDuration(0);
      a.src = t.audioUrl;
      a.currentTime = 0;
      a.play().catch(() => setIsPlaying(false));
    } else {
      a.play().catch(() => setIsPlaying(false));
    }
  };

  const toggle = () => {
    const a = audioRef.current;
    if (!a || !current) return;
    if (a.paused) a.play().catch(() => setIsPlaying(false));
    else a.pause();
  };

  const stop = () => {
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    a.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const close = () => {
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.currentTime = 0;
    }
    setIsVisible(false);
    setIsPlaying(false);
    setIsExpanded(false);
    setCurrentTime(0);
  };

  const seek = (s: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = s;
    setCurrentTime(s);
  };

  return (
    <Ctx.Provider
      value={{
        current,
        isPlaying,
        isVisible,
        isExpanded,
        currentTime,
        duration,
        play,
        toggle,
        stop,
        close,
        seek,
        setExpanded: setIsExpanded,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function usePlayer() {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePlayer must be used within PlayerProvider");
  return v;
}

export function formatTime(s: number) {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${ss}`;
}
