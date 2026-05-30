import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

async function loadAnton(text: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=Anton&text=${encodeURIComponent(
    text,
  )}`;
  const css = await (await fetch(url)).text();
  const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!src) throw new Error("icon: could not load Anton");
  return (await fetch(src[1])).arrayBuffer();
}

// Lime box with "FH" in the site's display face (Anton).
export default async function Icon() {
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
        borderRadius: 14,
      }}
    >
      <div
        style={{
          fontFamily: "Anton",
          fontSize: 40,
          color: "#000000",
          letterSpacing: 1,
          // optical centering
          transform: "translateY(-1px)",
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
