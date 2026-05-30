// Second pass for covers that weren't keyed by ISBN in Open Library.
// Uses OL title search (cover_i) then Google Books, with delays.
import { writeFile } from "node:fs/promises";

const misses = [
  ["awaken-the-giant-within", "Awaken the Giant Within", "Tony Robbins"],
  ["build-a-business-you-love", "Build a Business You Love", "Dave Ramsey"],
  ["100m-leads", "100M Leads", "Alex Hormozi"],
  [
    "choose-your-enemies-wisely",
    "Choose Your Enemies Wisely",
    "Patrick Bet-David",
  ],
  ["the-richest-man-in-babylon", "The Richest Man in Babylon", "George Clason"],
  ["smarter-faster-better", "Smarter Faster Better", "Charles Duhigg"],
  ["feel-good-productivity", "Feel Good Productivity", "Ali Abdaal"],
  [
    "the-greatest-salesman-in-the-world",
    "The Greatest Salesman in the World",
    "Og Mandino",
  ],
  ["steal-like-an-artist", "Steal Like an Artist", "Austin Kleon"],
  ["the-pathless-path", "The Pathless Path", "Paul Millerd"],
  ["win-every-argument", "Win Every Argument", "Mehdi Hasan"],
  [
    "the-israel-lobby",
    "The Israel Lobby and US Foreign Policy",
    "John Mearsheimer",
  ],
  [
    "angry-about-capitalism",
    "Its OK to Be Angry About Capitalism",
    "Bernie Sanders",
  ],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function grab(url) {
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    const buf = Buffer.from(await r.arrayBuffer());
    return buf.length > 1500 ? buf : null;
  } catch {
    return null;
  }
}

async function olSearch(title, author) {
  try {
    const u = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&limit=3&fields=cover_i`;
    const r = await fetch(u);
    if (!r.ok) return null;
    const j = await r.json();
    const doc = (j.docs || []).find((d) => d.cover_i);
    if (!doc) return null;
    return grab(`https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`);
  } catch {
    return null;
  }
}

async function gb(title, author) {
  try {
    const r = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(`intitle:${title} inauthor:${author}`)}&maxResults=1&country=US`,
    );
    if (!r.ok) return null;
    const il = (await r.json()).items?.[0]?.volumeInfo?.imageLinks;
    if (!il) return null;
    let u = il.large || il.medium || il.thumbnail || il.smallThumbnail;
    if (!u) return null;
    u = u
      .replace("http://", "https://")
      .replace("&edge=curl", "")
      .replace(/zoom=\d/, "zoom=1");
    return grab(u);
  } catch {
    return null;
  }
}

const stillMissing = [];
for (const [key, title, author] of misses) {
  let buf = await olSearch(title, author);
  let src = "ol-search";
  if (!buf) {
    await sleep(1200);
    buf = await gb(title, author);
    src = "googlebooks";
  }
  if (!buf) {
    stillMissing.push(key);
    console.log("MISS  ", key);
  } else {
    await writeFile(`public/books/${key}.jpg`, buf);
    console.log("OK    ", key.padEnd(36), src, `${buf.length}b`);
  }
  await sleep(400);
}
console.log(
  "\nSTILL MISSING:",
  stillMissing.length ? stillMissing.join(", ") : "none",
);
