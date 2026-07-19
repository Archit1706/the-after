import { ImageResponse } from "next/og";

// Apple touch / home-screen icon: the same "dawn over the horizon" mark as the
// favicon, rendered as a PNG. Built with divs (Satori-safe) rather than raw SVG.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#4e7c6b",
        }}
      >
        {/* dawn sun */}
        <div
          style={{
            position: "absolute",
            top: 44,
            left: 54,
            width: 72,
            height: 72,
            borderRadius: 999,
            background: "#efd3a3",
          }}
        />
        {/* horizon */}
        <div
          style={{
            position: "absolute",
            top: 104,
            left: 25,
            width: 130,
            height: 12,
            borderRadius: 999,
            background: "#faf6f0",
          }}
        />
        {/* fainter foreground line */}
        <div
          style={{
            position: "absolute",
            top: 130,
            left: 45,
            width: 90,
            height: 10,
            borderRadius: 999,
            background: "rgba(250,246,240,0.45)",
          }}
        />
      </div>
    ),
    size,
  );
}
