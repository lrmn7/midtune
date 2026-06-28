/** Core track model used throughout the app. */
export interface Track {
  id: string;
  title: string;
  author: string;
  /** ISO date string, e.g. "2024-08-27" — enables correct newest/oldest sorting */
  year: string;
  bpm: number;
  /** Human-readable duration, e.g. "3:42" */
  duration: string;
  /** Duration in seconds for filtering/sorting */
  durationSec: number;
  moods: string[];
  /** Musical key / chord, e.g. "G", "Am", "D" */
  tuning: string;
  downloads: number;
  audioUrl: string;
}

/** Shape used by the admin form when creating/editing a track. */
export interface TrackInput {
  id: string;
  title: string;
  author: string;
  year: string;
  bpm: number;
  duration: string;
  durationSec: number;
  moods: string[];
  tuning: string;
  audioUrl: string;
}

export interface PlayerState {
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
