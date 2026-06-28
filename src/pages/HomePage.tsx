import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Play, Download, ArrowRight, Headphones, Filter, Heart, Radio, Pause } from "lucide-react";
import { formatReleaseDate } from "@/data/tracks";
import { TrackCover } from "@/components/tracks/TrackCover";
import { Waveform } from "@/components/tracks/Waveform";
import { usePlayer } from "@/context/PlayerContext";
import { useTracks } from "@/hooks/useTracks";
import type { Track } from "@/types";

export default function HomePage() {
  const { tracks, totalDownloads, loading } = useTracks();
  const { play, current, isPlaying, toggle } = usePlayer();

  const featured = tracks.length > 0 ? tracks[0] : null;
  const isFeaturedPlaying = featured ? current?.id === featured.id && isPlaying : false;

  const recentTracks = useMemo(
    () => [...tracks].sort((a, b) => b.year.localeCompare(a.year)).slice(0, 6),
    [tracks]
  );

  return (
    <div>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-16 grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-5 flex items-center gap-2">
            <span className="inline-block w-6 border-t border-foreground" />
            vol. 01 · the midtune archive
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-tight">
            free midwest emo<br />
            <span className="italic text-brown">instrumentals.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
            a curated archive of free, copyright-safe midwest emo instrumental tracks. preview,
            copy the audio url, and download tracks for videos, games, streams, edits, and indie
            projects. no signups, no ads, no paperwork.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/tracks"
              className="inline-flex items-center gap-2 px-5 py-3 bg-foreground text-background font-mono text-sm uppercase tracking-wider hover:bg-brown transition-colors"
            >
              browse the archive <ArrowRight size={16} />
            </Link>
            <Link
              to="/license"
              className="inline-flex items-center gap-2 px-5 py-3 border border-foreground font-mono text-sm uppercase tracking-wider hover:bg-yellow-tape transition-colors"
            >
              read the license
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-3 max-w-md font-mono text-[11px] uppercase tracking-widest text-muted-foreground gap-4">
            <div>
              <div className="text-2xl font-serif text-foreground">{loading ? "-" : tracks.length}</div>tracks
            </div>
            <div>
              <div className="text-2xl font-serif text-foreground">
                {loading ? "-" : totalDownloads.toLocaleString()}
              </div>
              downloads
            </div>
            <div>
              <div className="text-2xl font-serif text-foreground">100%</div>free
            </div>
          </div>
        </div>
        <div className="relative max-w-[320px] mx-auto lg:ml-auto lg:mr-0 lg:mt-4">
          <div className="absolute -top-3 -left-3 tape-chip bg-yellow-tape rotate-[-4deg] z-10">
            ◉ featured
          </div>
          {featured && (
          <div className="paper-card p-4 rotate-[0.6deg]">
            <div className="border border-foreground overflow-hidden">
              <TrackCover
                trackId={featured.id}
                title={featured.title}
                mood={featured.moods[0]}
                year={featured.year}
              />
            </div>
            <div className="mt-4">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {featured.author} · {formatReleaseDate(featured.year)} ·{" "}
                {featured.moods.join(" · ")} · key of {featured.tuning}
              </div>
              <h2 className="font-serif text-2xl mt-1 leading-tight">{featured.title}</h2>
            </div>
            <div className="h-8 text-brown my-3">
              <Waveform seed={featured.id} className="w-full h-full" active={isFeaturedPlaying} />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => (current?.id === featured.id ? toggle() : play(featured))}
                className="flex items-center gap-2 px-4 py-2 bg-foreground text-background font-mono text-xs uppercase tracking-wider cursor-pointer hover:bg-brown transition-colors"
                aria-label={isFeaturedPlaying ? "Pause" : "Play"}
              >
                {isFeaturedPlaying ? <Pause size={14} /> : <Play size={14} />}{" "}
                {isFeaturedPlaying ? "playing…" : "play"}
              </button>
              <a
                href={featured.audioUrl}
                download
                className="flex items-center gap-2 px-4 py-2 border border-foreground font-mono text-xs uppercase tracking-wider cursor-pointer hover:bg-yellow-tape transition-colors"
                aria-label="Download track"
              >
                <Download size={14} /> download
              </a>
            </div>
          </div>
          )}
        </div>
      </section>
      <section className="border-y border-foreground/60 bg-surface/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Heart,
              k: "free to use",
              v: "every track here is free for personal & commercial projects. take what fits, leave what doesn't.",
            },
            {
              icon: Headphones,
              k: "midwest emo only",
              v: "no genre grab-bag. just twinkly guitars, open tunings, and quiet feelings.",
            },
            {
              icon: Filter,
              k: "filter by mood",
              v: "search by mood, year, bpm, key, length. find the one that matches the scene.",
            },
            {
              icon: Radio,
              k: "instant download",
              v: "one click, no signup. preview it first, copy the audio url, or download.",
            },
          ].map((f) => (
            <div key={f.k}>
              <div className="w-9 h-9 border border-foreground flex items-center justify-center bg-paper mb-3">
                <f.icon size={16} />
              </div>
              <div className="font-serif text-xl">{f.k}</div>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{f.v}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-6 gap-4">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              side b
            </div>
            <h2 className="font-serif text-4xl mt-1">recently added</h2>
          </div>
          <Link
            to="/tracks"
            className="font-mono text-xs uppercase tracking-widest hover:text-brown shrink-0"
          >
            see all {tracks.length} →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentTracks.map((t) => (
            <MiniCard key={t.id} track={t} />
          ))}
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="paper-card p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              the whole thing
            </div>
            <h3 className="font-serif text-3xl mt-1">use them in something you care about.</h3>
          </div>
          <Link
            to="/tracks"
            className="inline-flex items-center gap-2 px-5 py-3 bg-foreground text-background font-mono text-sm uppercase tracking-wider hover:bg-brown transition-colors shrink-0"
          >
            open the archive <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function MiniCard({ track }: { track: Track }) {
  const { play, current, isPlaying, toggle } = usePlayer();
  const isThis = current?.id === track.id && isPlaying;
  return (
    <div className="paper-card p-3 flex gap-3">
      <button
        onClick={() => (current?.id === track.id ? toggle() : play(track))}
        className="w-20 h-20 border border-foreground overflow-hidden shrink-0 cursor-pointer relative group"
        aria-label={`Play ${track.title}`}
      >
        <TrackCover
          trackId={track.id}
          title={track.title}
          mood={track.moods[0]}
          year={track.year}
          showLabel={false}
        />
        <span className="absolute inset-0 flex items-center justify-center bg-foreground/0 group-hover:bg-foreground/30 transition-colors">
          <span className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full bg-paper border border-foreground flex items-center justify-center">
            <Play size={14} />
          </span>
        </span>
      </button>
      <div className="min-w-0 flex-1">
        <div className="font-serif text-base leading-tight block truncate">{track.title}</div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
          {track.author} · {formatReleaseDate(track.year)} · {track.bpm} bpm
        </div>
        <div className="h-5 text-brown mt-1">
          <Waveform seed={track.id} className="w-full h-full" active={isThis} />
        </div>
        <div className="flex gap-1.5 mt-1.5">
          {track.moods.slice(0, 2).map((m) => (
            <span key={m} className="tape-chip">
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
