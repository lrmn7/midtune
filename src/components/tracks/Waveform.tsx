type Props = { seed: string; className?: string; active?: boolean };

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function Waveform({ seed, className = "", active = false }: Props) {
  const h = hash(seed);
  const bars = 48;
  return (
    <svg viewBox={`0 0 ${bars * 3} 28`} className={className} preserveAspectRatio="none">
      {Array.from({ length: bars }).map((_, i) => {
        // Create a track-like envelope (quieter at start/end, louder in middle)
        const progress = i / (bars - 1);
        const envelope = Math.sin(progress * Math.PI);
        
        // Pseudo-random noise based on seed and index
        const noise = Math.abs(Math.sin(h + i * 13.73) * Math.cos(h + i * 7.19));
        
        // Combine noise and envelope, scale to max height (26)
        // Add a small baseline (2) so it's never completely flat
        const height = Math.max(2, (noise * 0.7 + 0.3) * envelope * 26);
        
        return (
          <rect
            key={i}
            x={i * 3}
            y={(28 - height) / 2}
            width={1.6}
            height={height}
            fill="currentColor"
            opacity={active ? 0.85 : 0.55}
          >
            {active && (
              <>
                <animate
                  attributeName="height"
                  values={`${height};${Math.max(2, height - 6)};${height}`}
                  dur={`${0.6 + (i % 5) * 0.15}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="y"
                  values={`${(28 - height) / 2};${(28 - Math.max(2, height - 6)) / 2};${(28 - height) / 2}`}
                  dur={`${0.6 + (i % 5) * 0.15}s`}
                  repeatCount="indefinite"
                />
              </>
            )}
          </rect>
        );
      })}
    </svg>
  );
}
