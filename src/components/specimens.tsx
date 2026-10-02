import type { SpecimenId } from "@/lib/types";

export function Specimen({ id, className = "" }: { id: SpecimenId; className?: string }) {
  const art = {
    observatory: <Observatory />,
    archive: <Archive />,
    loom: <Loom />,
    armature: <Armature />,
    herbarium: <Herbarium />,
    film: <Film />,
    chart: <Chart />,
    terminal: <Terminal />,
  }[id];
  return (
    <div className={`text-ink ${className}`} aria-hidden="true">
      {art}
    </div>
  );
}

function Observatory() {
  return (
    <svg viewBox="0 0 360 240" className="h-auto w-full">
      <path d="M20 190h320" stroke="currentColor" strokeWidth="0.8" />
      <path d="M70 190c20-70 50-110 110-120 70-12 130 20 150 120" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <path d="M168 78c8-40 28-58 48-62" fill="none" stroke="#6b2d3c" strokeWidth="1.2" />
      <path d="M210 20l46 8-8 18-40-6z" fill="none" stroke="#6b2d3c" strokeWidth="1" />
      <circle cx="248" cy="48" r="2" fill="#8a6a2f" />
      <circle cx="90" cy="60" r="1.4" fill="#8a6a2f" />
      <circle cx="300" cy="80" r="1.2" fill="#8a6a2f" />
      <path d="M40 190v18M320 190v18" stroke="currentColor" strokeWidth="0.6" />
      <text x="24" y="224" style={{ fontFamily: "var(--font-mono)", fontSize: 10 }} fill="#6e6a5e">
        FIG. OBSERVATORY
      </text>
    </svg>
  );
}

function Archive() {
  return (
    <svg viewBox="0 0 360 240" className="h-auto w-full">
      <rect x="36" y="28" width="288" height="176" fill="none" stroke="currentColor" />
      {Array.from({ length: 6 }, (_, row) => (
        <g key={row}>
          <line x1="36" y1={52 + row * 24} x2="324" y2={52 + row * 24} stroke="currentColor" strokeWidth="0.5" />
          {Array.from({ length: 8 }, (_, col) => (
            <rect key={col} x={48 + col * 34} y={56 + row * 24} width="22" height="12" fill="none" stroke={row === 2 ? "#6b2d3c" : "currentColor"} strokeWidth="0.6" />
          ))}
        </g>
      ))}
      <text x="36" y="224" style={{ fontFamily: "var(--font-mono)", fontSize: 10 }} fill="#6e6a5e">
        FIG. STACKS, CROSS SECTION
      </text>
    </svg>
  );
}

function Loom() {
  return (
    <svg viewBox="0 0 360 240" className="h-auto w-full">
      <rect x="48" y="36" width="200" height="140" fill="none" stroke="currentColor" />
      {Array.from({ length: 10 }, (_, index) => (
        <line key={index} x1={64 + index * 16} y1="36" x2={64 + index * 16} y2="176" stroke="currentColor" strokeWidth="0.4" />
      ))}
      {Array.from({ length: 14 }, (_, row) =>
        Array.from({ length: 8 }, (_, col) =>
          (row + col) % 3 === 0 ? <rect key={`${row}-${col}`} x={70 + col * 18} y={48 + row * 8} width="6" height="4" fill="#171714" /> : null,
        ),
      )}
      <circle cx="290" cy="90" r="36" fill="none" stroke="#6b2d3c" />
      <circle cx="290" cy="90" r="8" fill="none" stroke="#6b2d3c" />
      <text x="48" y="214" style={{ fontFamily: "var(--font-mono)", fontSize: 10 }} fill="#6e6a5e">
        FIG. CARD AND DRUM
      </text>
    </svg>
  );
}

function Armature() {
  return (
    <svg viewBox="0 0 360 240" className="h-auto w-full">
      <path d="M40 190h80l30-70 70-10 40-60" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="120" cy="190" r="8" fill="none" stroke="#6b2d3c" />
      <circle cx="150" cy="120" r="7" fill="none" stroke="#6b2d3c" />
      <circle cx="220" cy="110" r="7" fill="none" stroke="#6b2d3c" />
      <path d="M260 50l28 8-18 22" fill="none" stroke="currentColor" />
      <path d="M40 200h240" stroke="currentColor" strokeWidth="0.6" />
      <text x="40" y="224" style={{ fontFamily: "var(--font-mono)", fontSize: 10 }} fill="#6e6a5e">
        FIG. ARM, THREE JOINTS
      </text>
    </svg>
  );
}

function Herbarium() {
  return (
    <svg viewBox="0 0 360 240" className="h-auto w-full">
      <path d="M180 200 C176 140 170 100 150 60" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <path d="M160 150c-40-10-58-28-60-48 28 4 48 20 60 48z" fill="none" stroke="currentColor" />
      <path d="M168 120c36-16 62-14 78 6-30 8-52 8-78-6z" fill="none" stroke="#24382c" />
      <path d="M156 88c-30-20-28-42-10-54 8 24 14 38 10 54z" fill="none" stroke="#24382c" />
      <circle cx="148" cy="52" r="3" fill="#8a6a2f" />
      <rect x="214" y="150" width="96" height="36" fill="none" stroke="#6b2d3c" />
      <text x="222" y="172" style={{ fontFamily: "var(--font-mono)", fontSize: 9 }} fill="#6b2d3c">
        SPECIMEN
      </text>
      <text x="40" y="224" style={{ fontFamily: "var(--font-mono)", fontSize: 10 }} fill="#6e6a5e">
        FIG. HERBARIUM SHEET
      </text>
    </svg>
  );
}

function Film() {
  return (
    <svg viewBox="0 0 360 240" className="h-auto w-full">
      <circle cx="90" cy="110" r="46" fill="none" stroke="currentColor" />
      <circle cx="90" cy="110" r="12" fill="none" stroke="currentColor" />
      <circle cx="250" cy="78" r="28" fill="none" stroke="currentColor" />
      <circle cx="250" cy="78" r="8" fill="none" stroke="currentColor" />
      <path d="M136 100c30-30 70-36 114-24" fill="none" stroke="#6b2d3c" />
      <rect x="150" y="124" width="120" height="68" fill="none" stroke="currentColor" />
      <path d="M150 140h120M150 156h120M150 172h120" stroke="currentColor" strokeWidth="0.4" />
      <text x="40" y="224" style={{ fontFamily: "var(--font-mono)", fontSize: 10 }} fill="#6e6a5e">
        FIG. GATE AND REEL
      </text>
    </svg>
  );
}

function Chart() {
  return (
    <svg viewBox="0 0 360 240" className="h-auto w-full">
      <path d="M30 40c40 20 50 80 30 120-20 30 10 50 40 48 40-4 30-40 70-46 36-6 40 20 80 16 30-4 40-30 70-20" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <path d="M40 180h280" stroke="#8a6a2f" strokeWidth="0.5" />
      <path d="M40 150h280M40 120h280" stroke="currentColor" strokeWidth="0.3" />
      {[80, 140, 210, 270].map((x) => (
        <g key={x}>
          <circle cx={x} cy={x === 140 ? 132 : 168} r="2.2" fill="#6b2d3c" />
        </g>
      ))}
      <text x="30" y="214" style={{ fontFamily: "var(--font-mono)", fontSize: 10 }} fill="#6e6a5e">
        FIG. SOUNDINGS
      </text>
    </svg>
  );
}

function Terminal() {
  return (
    <svg viewBox="0 0 360 240" className="h-auto w-full">
      <rect x="40" y="28" width="280" height="150" fill="none" stroke="currentColor" />
      <path d="M58 52h90M58 70h150M58 88h70M58 106h120" stroke="#6b2d3c" strokeWidth="0.8" />
      <rect x="70" y="186" width="220" height="16" fill="none" stroke="currentColor" />
      {Array.from({ length: 18 }, (_, index) => (
        <line key={index} x1={78 + index * 12} y1="186" x2={78 + index * 12} y2="202" stroke="currentColor" strokeWidth="0.5" />
      ))}
      <text x="40" y="230" style={{ fontFamily: "var(--font-mono)", fontSize: 10 }} fill="#6e6a5e">
        FIG. CONSOLE
      </text>
    </svg>
  );
}
