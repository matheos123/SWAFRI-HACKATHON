import { ImageResponse } from "next/og";

export const alt = "RPS Arena — Play, Win, Earn, Own";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #070A13 0%, #111a35 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ color: "#67e8f9", fontSize: 24, letterSpacing: 10, textTransform: "uppercase" }}>
          Play · Win · Earn · Own
        </div>
        <div style={{ marginTop: 28, fontSize: 88, fontWeight: 900, letterSpacing: -3 }}>
          RPS ARENA
        </div>
        <div style={{ marginTop: 18, color: "#c7d2fe", fontSize: 32 }}>
          Real-Time Web3 Rock Paper Scissors
        </div>
      </div>
    ),
    size,
  );
}
