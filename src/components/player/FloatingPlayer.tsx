import {
  Play,
  Pause,
  Square,
  X,
  Download,
  Link2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { usePlayer, formatTime } from "@/context/PlayerContext";
import { TrackCover } from "@/components/tracks/TrackCover";
import { Waveform } from "@/components/tracks/Waveform";
import { copyAudioUrl, downloadTrack } from "@/services/api";
import { formatReleaseDate } from "@/data/tracks";

export function FloatingPlayer() {
  const {
    current,
    isVisible,
    isPlaying,
    isExpanded,
    currentTime,
    duration,
    toggle,
    stop,
    close,
    seek,
    setExpanded,
  } = usePlayer();

  if (!isVisible || !current) return null;

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!isExpanded) {
    return (
      <div
        className="fixed z-50 right-4 left-4 bottom-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-[300px]"
        role="region"
        aria-label="Now playing"
      >
        <div className="paper-card p-2.5 relative">
          <div className="absolute -top-2 left-6 right-6 h-1.5 bg-yellow-tape border border-foreground" />
          <div className="flex items-center gap-2.5">
            <div className="w-12 h-12 shrink-0 border border-foreground overflow-hidden">
              <TrackCover
                trackId={current.id}
                title={current.title}
                mood={current.moods[0]}
                year={current.year}
                showLabel={false}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-serif text-sm leading-tight truncate">{current.title}</div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground truncate">
                {current.author}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={toggle}
                className="w-8 h-8 flex items-center justify-center bg-foreground text-background cursor-pointer hover:bg-brown transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <button
                onClick={stop}
                className="w-8 h-8 flex items-center justify-center border border-foreground cursor-pointer hover:bg-secondary transition-colors"
                aria-label="Stop"
              >
                <Square size={10} />
              </button>
              <button
                onClick={() => setExpanded(true)}
                className="w-8 h-8 flex items-center justify-center border border-foreground cursor-pointer hover:bg-yellow-tape transition-colors"
                aria-label="Expand player"
              >
                <ChevronUp size={14} />
              </button>
              <button
                onClick={close}
                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="Close player"
              >
                <X size={14} />
              </button>
            </div>
          </div>
          <div className="mt-1.5 h-0.5 bg-input overflow-hidden">
            <div
              className="h-full bg-foreground transition-[width] duration-200"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed z-50 right-4 left-4 bottom-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-[360px]"
      role="region"
      aria-label="Now playing"
    >
      <div className="paper-card p-3 relative">
        <div className="absolute -top-2 left-6 right-6 h-1.5 bg-yellow-tape border border-foreground" />
        <div className="flex gap-3">
          <div className="w-20 h-20 shrink-0 border border-foreground overflow-hidden">
            <TrackCover
              trackId={current.id}
              title={current.title}
              mood={current.moods[0]}
              year={current.year}
              showLabel={false}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-serif text-base leading-tight block truncate">
                  {current.title}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5 truncate">
                  {current.author} · {formatReleaseDate(current.year)}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground truncate">
                  {current.moods[0]} · {current.bpm} bpm · key of {current.tuning}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => setExpanded(false)}
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label="Collapse player"
                >
                  <ChevronDown size={16} />
                </button>
                <button
                  onClick={close}
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label="Close player"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div
              className={`mt-1.5 h-5 text-foreground ${isPlaying ? "" : "opacity-70"}`}
              aria-hidden="true"
            >
              <Waveform seed={current.id} className="w-full h-full" active={isPlaying} />
            </div>
          </div>
        </div>
        <div className="mt-2">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            className="w-full h-1 cursor-pointer appearance-none bg-transparent"
            style={{
              background: `linear-gradient(to right, var(--ink) 0%, var(--ink) ${pct}%, var(--input) ${pct}%, var(--input) 100%)`,
            }}
            aria-label="Seek"
          />
          <div className="flex justify-between font-mono text-[10px] text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <button
            onClick={toggle}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-foreground text-background font-mono text-xs uppercase tracking-wider cursor-pointer hover:bg-brown transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaying ? "pause" : "play"}
          </button>
          <button
            onClick={stop}
            className="flex items-center gap-1.5 px-2.5 py-1.5 border border-foreground font-mono text-xs uppercase tracking-wider cursor-pointer hover:bg-secondary transition-colors"
            aria-label="Stop"
          >
            <Square size={12} />
            stop
          </button>
          <button
            onClick={() => downloadTrack(current.audioUrl, current.id)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 border border-foreground font-mono text-xs uppercase tracking-wider cursor-pointer hover:bg-yellow-tape transition-colors"
            aria-label="Download track"
          >
            <Download size={12} />
            dl
          </button>
          <button
            onClick={() => copyAudioUrl(current.audioUrl)}
            className="ml-auto flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Copy audio URL"
          >
            <Link2 size={11} />
            url
          </button>
        </div>
      </div>
    </div>
  );
}
