import { Play, Pause, Download, Link2, ArrowDown } from "lucide-react";
import type { Track } from "@/types";
import { TrackCover } from "@/components/tracks/TrackCover";
import { Waveform } from "@/components/tracks/Waveform";
import { usePlayer } from "@/context/PlayerContext";
import { copyAudioUrl, downloadTrack } from "@/services/api";
import { formatReleaseDate } from "@/data/tracks";

export function TrackCard({ track }: { track: Track }) {
  const { current, isPlaying, play, toggle } = usePlayer();
  const isThis = current?.id === track.id;
  const playing = isThis && isPlaying;

  return (
    <article className="paper-card p-3 flex flex-col gap-3 hover:-translate-y-0.5 transition-transform">
      <div className="border border-foreground overflow-hidden">
        <TrackCover trackId={track.id} title={track.title} mood={track.moods[0]} year={track.year} />
      </div>

      <div>
        <h3 className="font-serif text-xl leading-tight">{track.title}</h3>
        <p className="text-sm text-muted-foreground mt-0.5">{track.author}</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {track.moods.map((m) => (
          <span key={m} className="tape-chip">
            {m}
          </span>
        ))}
      </div>

      <dl className="grid grid-cols-4 gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        <div>
          <dt className="opacity-60">date</dt>
          <dd className="text-foreground">{formatReleaseDate(track.year)}</dd>
        </div>
        <div>
          <dt className="opacity-60">bpm</dt>
          <dd className="text-foreground">{track.bpm}</dd>
        </div>
        <div>
          <dt className="opacity-60">len</dt>
          <dd className="text-foreground">{track.duration}</dd>
        </div>
        <div>
          <dt className="opacity-60">key</dt>
          <dd className="text-foreground">{track.tuning}</dd>
        </div>
      </dl>

      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        <ArrowDown size={10} />
        <span>{track.downloads.toLocaleString()} downloads</span>
      </div>

      <div className="h-7 text-brown">
        <Waveform seed={track.id} className="w-full h-full" active={playing} />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => (isThis ? toggle() : play(track))}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-foreground text-background font-mono text-xs uppercase tracking-wider cursor-pointer hover:bg-brown transition-colors"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <Pause size={14} /> : <Play size={14} />}
          {playing ? "pause" : "play"}
        </button>
        <button
          onClick={() => downloadTrack(track.audioUrl, track.id)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 border border-foreground font-mono text-xs uppercase tracking-wider cursor-pointer hover:bg-yellow-tape transition-colors"
          aria-label="Download track"
        >
          <Download size={12} />
          dl
        </button>
        <button
          onClick={() => copyAudioUrl(track.audioUrl)}
          className="ml-auto flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground cursor-pointer"
          aria-label="Copy audio URL"
        >
          <Link2 size={12} />
          audio url
        </button>
      </div>
    </article>
  );
}
