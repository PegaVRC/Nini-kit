import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const Prueba: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 12 } });
  const opacity = interpolate(
    frame,
    [0, 15, durationInFrames - 15, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const y = interpolate(frame, [0, 30], [80, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(160deg, #1e1b4b 0%, #7c3aed 100%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          fontFamily: "sans-serif",
          fontSize: 260,
          fontWeight: 800,
          color: "white",
          margin: 0,
          opacity,
          transform: `translateY(${y}px) scale(${scale})`,
        }}
      >
        Hola
      </h1>
    </AbsoluteFill>
  );
};
