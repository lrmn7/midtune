type Props = {
  trackId: string;
  title: string;
  mood?: string;
  /** ISO date string, e.g. "2024-08-27" */
  year?: string;
  className?: string;
  showLabel?: boolean;
};

const PALETTES: Record<string, [string, string, string]> = {
  melancholy: ["#7c8fa6", "#3a4a5c", "#f4efe3"],
  nostalgic: ["#e8c76f", "#8b5e3c", "#fffaf0"],
  quiet: ["#cdd2c0", "#8a8f68", "#f4efe3"],
  lonely: ["#9aa6b2", "#4d5764", "#f4efe3"],
  bittersweet: ["#d49a6a", "#7c8fa6", "#fffaf0"],
  warm: ["#e8a86f", "#8b5e3c", "#fffaf0"],
  dreamy: ["#b9b0d6", "#7c8fa6", "#fffaf0"],
  cold: ["#b6c4cf", "#4d5764", "#f4efe3"],
  energetic: ["#e8c76f", "#a14b3a", "#fffaf0"],
};

const PATTERNS = ["lines", "dots", "grid", "blocks", "arcs", "tape"] as const;

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function TrackCover({
  trackId,
  title,
  mood,
  year,
  className = "",
  showLabel = true,
}: Props) {
  const h = hash(trackId);
  const palette =
    (mood && PALETTES[mood]) || Object.values(PALETTES)[h % Object.keys(PALETTES).length];
  const [accent, deep, paper] = palette;
  const variant = PATTERNS[h % PATTERNS.length];
  const rot = (h % 9) - 4;
  const displayYear = year ? year.slice(0, 4) : "";

  return (
    <div
      className={`relative w-full aspect-square overflow-hidden ${className}`}
      style={{ background: paper }}
      role="img"
      aria-label={`Cover art for ${title}`}
    >
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id={`grain-${trackId}`} width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.3" fill={deep} opacity="0.25" />
          </pattern>
        </defs>
        <rect width="200" height="200" fill={paper} />
        {variant === "lines" && (
          <g stroke={deep} strokeWidth="1.2" opacity="0.85">
            {Array.from({ length: 18 }).map((_, i) => (
              <line
                key={i}
                x1="0"
                y1={i * 12 + (h % 6)}
                x2="200"
                y2={i * 12 - 20 + (h % 6)}
              />
            ))}
            <rect x="20" y="60" width="160" height="80" fill={accent} opacity="0.85" />
          </g>
        )}
        {variant === "dots" && (
          <g fill={deep}>
            {Array.from({ length: 12 }).map((_, r) =>
              Array.from({ length: 12 }).map((_, c) => (
                <circle
                  key={`${r}-${c}`}
                  cx={c * 17 + 8}
                  cy={r * 17 + 8}
                  r={((r + c + h) % 4) + 1}
                  opacity="0.7"
                />
              ))
            )}
            <circle cx="100" cy="100" r="55" fill={accent} opacity="0.9" />
          </g>
        )}
        {variant === "grid" && (
          <g stroke={deep} strokeWidth="1" opacity="0.7">
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 22} y1="0" x2={i * 22} y2="200" />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`hh${i}`} x1="0" y1={i * 22} x2="200" y2={i * 22} />
            ))}
            <rect
              x={30 + (h % 30)}
              y={40 + (h % 20)}
              width="90"
              height="90"
              fill={accent}
              stroke={deep}
              strokeWidth="1.6"
            />
          </g>
        )}
        {variant === "blocks" && (
          <g>
            <rect x="0" y="0" width="120" height="120" fill={accent} />
            <rect x="80" y="80" width="120" height="120" fill={deep} opacity="0.85" />
            <rect
              x="60"
              y="60"
              width="60"
              height="60"
              fill={paper}
              stroke={deep}
              strokeWidth="1.4"
            />
          </g>
        )}
        {variant === "arcs" && (
          <g fill="none" stroke={deep} strokeWidth="1.4">
            {Array.from({ length: 8 }).map((_, i) => (
              <circle key={i} cx="100" cy="200" r={30 + i * 18} opacity="0.7" />
            ))}
            <circle cx="100" cy="60" r="22" fill={accent} stroke={deep} />
          </g>
        )}
        {variant === "tape" && (
          <g>
            <rect
              x="10"
              y="70"
              width="180"
              height="60"
              fill={accent}
              stroke={deep}
              strokeWidth="1.6"
            />
            <circle cx="55" cy="100" r="14" fill={paper} stroke={deep} strokeWidth="1.4" />
            <circle cx="55" cy="100" r="3" fill={deep} />
            <circle cx="145" cy="100" r="14" fill={paper} stroke={deep} strokeWidth="1.4" />
            <circle cx="145" cy="100" r="3" fill={deep} />
            <path d="M55 114 Q100 130 145 114" stroke={deep} strokeWidth="1" fill="none" />
            <rect
              x="10"
              y="20"
              width="180"
              height="34"
              fill={paper}
              stroke={deep}
              strokeWidth="1.2"
            />
          </g>
        )}
        <rect width="200" height="200" fill={`url(#grain-${trackId})`} />
      </svg>

      {showLabel && (
        <div
          className="absolute left-3 right-3 bottom-3 paper-card px-2.5 py-1.5"
          style={{ transform: `rotate(${rot * 0.15}deg)` }}
        >
          <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            midtune · {displayYear}
          </div>
          <div className="font-serif text-sm leading-tight text-foreground line-clamp-1">
            {title}
          </div>
        </div>
      )}
    </div>
  );
}
