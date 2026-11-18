import { random, useCurrentFrame } from "remotion";
import { PALETA } from "./tema";

const Estrellita: React.FC<{ color: string; size: number }> = ({
  color,
  size,
}) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100">
    <path
      d="M0,-50 C6,-12 12,-6 50,0 C12,6 6,12 0,50 C-6,12 -12,6 -50,0 C-12,-6 -6,-12 0,-50Z"
      fill={color}
      stroke="white"
      strokeWidth={6}
    />
  </svg>
);

/** Destellos que titilan en posiciones fijas (deterministas). */
export const Destellos: React.FC<{ cantidad?: number; semilla?: string }> = ({
  cantidad = 16,
  semilla = "destellos",
}) => {
  const frame = useCurrentFrame();
  return (
    <>
      {new Array(cantidad).fill(0).map((_, i) => {
        const x = random(`${semilla}-x-${i}`) * 100;
        const y = random(`${semilla}-y-${i}`) * 100;
        const size = 30 + random(`${semilla}-s-${i}`) * 60;
        const fase = random(`${semilla}-f-${i}`) * Math.PI * 2;
        const brillo = (Math.sin(frame / 7 + fase) + 1) / 2;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              opacity: 0.35 + brillo * 0.65,
              scale: String(0.5 + brillo * 0.7),
              rotate: `${frame * 1.5 + i * 20}deg`,
              translate: "-50% -50%",
            }}
          >
            <Estrellita color={PALETA[i % PALETA.length]} size={size} />
          </div>
        );
      })}
    </>
  );
};
