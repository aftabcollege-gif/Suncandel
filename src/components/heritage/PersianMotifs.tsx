export function ShamseMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="32" cy="32" r="10" fill="currentColor" />
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i * Math.PI) / 8;
        const x1 = 32 + Math.cos(a) * 14;
        const y1 = 32 + Math.sin(a) * 14;
        const x2 = 32 + Math.cos(a) * 27;
        const y2 = 32 + Math.sin(a) * 27;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1.1" />;
      })}
    </svg>
  );
}

export function IwanArch({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 800 900" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M40 900 V260 C40 80 220 20 400 20 C580 20 760 80 760 260 V900"
        fill="none"
        stroke="currentColor"
        strokeWidth="18"
      />
      <path
        d="M78 900 V270 C78 110 230 58 400 58 C570 58 722 110 722 270 V900"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        opacity="0.55"
      />
    </svg>
  );
}
