export function CaroKeyframes() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
@keyframes caro-holo {
  0%, 100% { transform: translateX(-100%) skewX(-12deg); opacity: 0; }
  40% { opacity: 0.55; }
  60% { opacity: 0.35; }
  100% { transform: translateX(200%) skewX(-12deg); opacity: 0; }
}
@keyframes caro-legend-pulse {
  0%, 100% { opacity: 0.35; }
  50% { opacity: 0.75; }
}
@keyframes caro-sparkle {
  0%, 100% { transform: scale(0.6) rotate(0deg); opacity: 0.2; }
  50% { transform: scale(1) rotate(180deg); opacity: 0.9; }
}
`,
      }}
    />
  );
}
