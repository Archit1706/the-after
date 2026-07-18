import { ImageResponse } from "next/og";

export const alt = "The After — a gentle guide through what comes after";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          color: "#332b25",
          background: "#faf6f0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 34 }}>
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#a85a44",
              marginRight: 16,
            }}
          />
          The After
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "serif", fontSize: 76, lineHeight: 1.08 }}>
            A gentle guide through
          </div>
          <div style={{ fontFamily: "serif", fontSize: 76, lineHeight: 1.08 }}>
            what comes after
          </div>
          <div style={{ fontSize: 30, marginTop: 28, color: "#705f54" }}>
            Practical support, one calm step at a time.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#8b786a" }}>
          A companion for the practical side of loss
        </div>
      </div>
    ),
    size,
  );
}
