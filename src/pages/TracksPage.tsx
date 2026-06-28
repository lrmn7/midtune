import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { TrackCard } from "@/components/tracks/TrackCard";
import { useTracks } from "@/hooks/useTracks";
import type { Track } from "@/types";

type Sort = "newest" | "oldest" | "downloads" | "shortest" | "longest";

export default function TracksPage() {
  const { tracks, loading } = useTracks();
  const [q, setQ] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const [year, setYear] = useState<string | null>(null);
  const [tuning, setTuning] = useState<string | null>(null);
  const [bpmMax, setBpmMax] = useState(160);
  const [durMax, setDurMax] = useState(360);
  const [sort, setSort] = useState<Sort>("newest");

  const dynamicMoods = useMemo(() => {
    const s = new Set<string>();
    tracks.forEach(t => t.moods.forEach(m => s.add(m)));
    return Array.from(s).sort();
  }, [tracks]);

  const dynamicYears = useMemo(() => {
    const s = new Set<string>();
    tracks.forEach(t => {
      if (t.year) s.add(t.year.substring(0, 4));
    });
    return Array.from(s).sort((a, b) => b.localeCompare(a));
  }, [tracks]);

  const dynamicKeys = useMemo(() => {
    const s = new Set<string>();
    tracks.forEach(t => {
      if (t.tuning) s.add(t.tuning);
    });
    return Array.from(s).sort();
  }, [tracks]);

  const filtered = useMemo(() => {
    let r: Track[] = tracks.filter((t) => {
      if (q && !t.title.toLowerCase().includes(q.toLowerCase()) && !t.author.toLowerCase().includes(q.toLowerCase())) return false;
      if (mood && !t.moods.includes(mood)) return false;
      if (year && !t.year.startsWith(year)) return false;
      if (tuning && t.tuning !== tuning) return false;
      if (t.bpm > bpmMax) return false;
      if (t.durationSec > durMax) return false;
      return true;
    });
    r = [...r].sort((a, b) => {
      switch (sort) {
        case "newest":
          return b.year.localeCompare(a.year);
        case "oldest":
          return a.year.localeCompare(b.year);
        case "downloads":
          return (b.downloads || 0) - (a.downloads || 0);
        case "shortest":
          return a.durationSec - b.durationSec;
        case "longest":
          return b.durationSec - a.durationSec;
      }
    });
    return r;
  }, [q, mood, year, tuning, bpmMax, durMax, sort, tracks]);

  const activeFilters = [mood, year, tuning].filter(Boolean).length;

  const clear = () => {
    setQ("");
    setMood(null);
    setYear(null);
    setTuning(null);
    setBpmMax(160);
    setDurMax(360);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <header className="mb-8">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          the archive
        </div>
        <h1 className="font-serif text-5xl mt-1">all tracks</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          {loading ? "loading..." : `${tracks.length} instrumentals`} · all free · filter by mood, year, key, length, or speed.
        </p>
      </header>
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="search titles, authors, moods…"
            className="w-full bg-surface border border-foreground pl-9 pr-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brown"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="bg-surface border border-foreground px-3 py-2.5 font-mono text-xs uppercase tracking-wider cursor-pointer"
        >
          <option value="newest">sort: newest</option>
          <option value="oldest">sort: oldest</option>
          <option value="downloads">sort: most downloaded</option>
          <option value="shortest">sort: shortest</option>
          <option value="longest">sort: longest</option>
        </select>
      </div>
      <div className="paper-card p-4 mb-6">
        {dynamicMoods.length > 0 && (
          <FilterRow label="mood">
            {dynamicMoods.map((m) => (
              <Chip key={m} active={mood === m} onClick={() => setMood(mood === m ? null : m)}>
                {m}
              </Chip>
            ))}
          </FilterRow>
        )}
        {dynamicYears.length > 0 && (
          <FilterRow label="year">
            {dynamicYears.map((y) => (
              <Chip key={y} active={year === y} onClick={() => setYear(year === y ? null : y)}>
                {y}
              </Chip>
            ))}
          </FilterRow>
        )}
        {dynamicKeys.length > 0 && (
          <FilterRow label="key">
            {dynamicKeys.map((t) => (
              <Chip
                key={t}
                active={tuning === t}
                onClick={() => setTuning(tuning === t ? null : t)}
              >
                {t}
              </Chip>
            ))}
          </FilterRow>
        )}
        <div className="grid sm:grid-cols-2 gap-6 mt-4">
          <RangeRow
            label="bpm"
            max={bpmMax}
            maxLabel={`≤ ${bpmMax}`}
            min={60}
            hardMax={160}
            step={4}
            onChange={setBpmMax}
          />
          <RangeRow
            label="duration"
            max={durMax}
            maxLabel={`≤ ${Math.floor(durMax / 60)}:${String(durMax % 60).padStart(2, "0")}`}
            min={60}
            hardMax={360}
            step={15}
            onChange={setDurMax}
          />
        </div>
        {(activeFilters > 0 || q) && (
          <button
            onClick={clear}
            className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X size={12} /> clear filters
          </button>
        )}
      </div>

      <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-4">
        showing {filtered.length} of {loading ? "-" : tracks.length}
      </div>

      {filtered.length === 0 ? (
        <div className="paper-card p-10 text-center">
          <div className="font-serif text-2xl">nothing matches.</div>
          <p className="text-muted-foreground mt-1">try loosening a filter or two.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((t) => (
            <TrackCard key={t.id} track={t} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-1.5">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground w-16 pt-1 shrink-0">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`tape-chip cursor-pointer transition-colors ${active ? "bg-foreground text-background" : "hover:bg-yellow-tape"}`}
    >
      {children}
    </button>
  );
}

function RangeRow({
  label,
  max,
  maxLabel,
  min,
  hardMax,
  step,
  onChange,
}: {
  label: string;
  max: number;
  maxLabel: string;
  min: number;
  hardMax: number;
  step: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
        <span>{label}</span>
        <span className="text-foreground">{maxLabel}</span>
      </div>
      <input
        type="range"
        min={min}
        max={hardMax}
        step={step}
        value={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer"
      />
    </div>
  );
}
