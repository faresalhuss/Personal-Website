import { ImageResponse } from "next/og";

export const runtime = "edge";

const NIGHT = "#000000";
const INK = "#ffffff";
const INK_DIM = "#a6a6a6";
const LIME = "#dbff00";

async function loadGoogleFont(
  family: string,
  text: string,
): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(
    text,
  )}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+?)\) format\('(opentype|truetype)'\)/,
  );
  if (!resource) throw new Error(`Could not load font: ${family}`);
  const res = await fetch(resource[1]);
  if (!res.ok) throw new Error(`Could not fetch font: ${family}`);
  return res.arrayBuffer();
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawTitle = searchParams.get("title");
  const isEssay = Boolean(rawTitle);

  // Default share image mirrors the hero. Essays show their title instead.
  const eyebrow = (
    isEssay ? "Writing" : "Entrepreneur · Creator · Writer"
  ).toUpperCase();
  const headline = isEssay
    ? rawTitle!.slice(0, 110).toUpperCase()
    : "FA'RES\nHUSSEINI";
  const subline = isEssay
    ? ""
    : "I build small businesses, and I'm having fun along the way.";

  const fontText =
    headline.replace("\n", "") + eyebrow + subline + "FA'RES HUSSEINI";
  const [display, sans] = await Promise.all([
    loadGoogleFont("Anton", fontText),
    loadGoogleFont("Geist:wght@500", eyebrow + subline + "FA'RES HUSSEINI"),
  ]);

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: NIGHT,
        padding: "72px 80px",
      }}
    >
      <div
        style={{
          display: "flex",
          fontFamily: "Geist",
          fontWeight: 500,
          fontSize: 26,
          letterSpacing: 4,
          color: LIME,
          marginBottom: 24,
        }}
      >
        {eyebrow}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontFamily: "Anton",
          fontSize: isEssay ? 84 : 132,
          lineHeight: 0.92,
          letterSpacing: 1,
          color: INK,
          textTransform: "uppercase",
          maxWidth: 1040,
        }}
      >
        {headline.split("\n").map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>

      {subline ? (
        <div
          style={{
            display: "flex",
            fontFamily: "Geist",
            fontWeight: 500,
            fontSize: 30,
            color: INK_DIM,
            marginTop: 28,
            maxWidth: 760,
          }}
        >
          {subline}
        </div>
      ) : null}

      {isEssay ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: "Geist",
            fontWeight: 500,
            fontSize: 26,
            color: INK_DIM,
            marginTop: 36,
          }}
        >
          <div
            style={{
              width: 44,
              height: 4,
              backgroundColor: LIME,
              display: "flex",
            }}
          />
          FA&rsquo;RES HUSSEINI
        </div>
      ) : null}
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Anton", data: display, weight: 400, style: "normal" },
        { name: "Geist", data: sans, weight: 500, style: "normal" },
      ],
    },
  );
}
