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
        const v = ((h * (i + 1) * 9301 + 49297) % 233280) / 233280;
        const height = 4 + v * 22;
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
              <animate
                attributeName="height"
                values={`${height};${Math.max(2, height - 6)};${height}`}
                dur={`${0.6 + (i % 5) * 0.15}s`}
                repeatCount="indefinite"
              />
            )}
          </rect>
        );
      })}
    </svg>
  );
}
