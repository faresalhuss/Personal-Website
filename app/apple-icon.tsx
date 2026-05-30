import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

async function loadAnton(text: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=Anton&text=${encodeURIComponent(
    text,
  )}`;
  const css = await (await fetch(url)).text();
  const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!src) throw new Error("apple-icon: could not load Anton");
  return (await fetch(src[1])).arrayBuffer();
}

// Full-bleed lime tile (iOS applies its own rounding) with "FH" in Anton.
export default async function AppleIcon() {
  const font = await loadAnton("FH");

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#dbff00",
      }}
    >
      <div
        style={{
          fontFamily: "Anton",
          fontSize: 112,
          color: "#000000",
          letterSpacing: 2,
          transform: "translateY(-3px)",
        }}
      >
        FH
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: "Anton", data: font, weight: 400, style: "normal" }],
    },
  );
}
