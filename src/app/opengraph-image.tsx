import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — ${site.role} based in ${site.location}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#DC143C",
          color: "#0A0A0A",
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <span>Portfolio / 2026</span>
          <span>Kathmandu, Nepal</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 164,
                fontWeight: 900,
                lineHeight: 0.82,
                letterSpacing: "-0.06em",
              }}
            >
              SYAMI
            </div>
            <div
              style={{
                marginTop: 18,
                fontSize: 36,
                fontWeight: 700,
                letterSpacing: "-0.01em",
              }}
            >
              Creative Developer
            </div>
          </div>

          <div
            style={{
              display: "flex",
              width: 236,
              height: 236,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              border: "10px solid #003893",
              background: "#0A0A0A",
              color: "#F3EEE5",
              fontSize: 96,
              fontWeight: 900,
              letterSpacing: "-0.08em",
            }}
          >
            S.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          <span>Design + Engineering</span>
          <span>27.7172 N / 85.3240 E</span>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
