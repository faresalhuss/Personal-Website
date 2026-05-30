// One-off: download each book cover into /public/books/{key}.jpg so covers are
// self-hosted (reliable + fast). Tries Open Library (high-res) then Google Books.
//   node scripts/fetch-covers.mjs
import { mkdir, writeFile } from "node:fs/promises";

const books = [
  [
    "awaken-the-giant-within",
    "1471188426",
    "Awaken the Giant Within",
    "Tony Robbins",
  ],
  ["build-a-business-you-love", "", "Build a Business You Love", "Dave Ramsey"],
  ["100m-offers", "173747574X", "$100M Offers", "Alex Hormozi"],
  ["100m-leads", "", "$100M Leads", "Alex Hormozi"],
  ["100m-money-models", "1963349156", "$100M Money Models", "Alex Hormozi"],
  [
    "never-split-the-difference",
    "0062407805",
    "Never Split the Difference",
    "Chris Voss",
  ],
  [
    "business-model-generation",
    "0470876417",
    "Business Model Generation",
    "Alexander Osterwalder",
  ],
  ["the-personal-mba", "0525543023", "The Personal MBA", "Josh Kaufman"],
  [
    "your-next-five-moves",
    "1982154810",
    "Your Next Five Moves",
    "Patrick Bet-David",
  ],
  [
    "choose-your-enemies-wisely",
    "0593712846",
    "Choose Your Enemies Wisely",
    "Patrick Bet-David",
  ],
  [
    "doing-the-impossible",
    "099762230X",
    "Doing the Impossible",
    "Patrick Bet-David",
  ],
  ["the-first-90-days", "1422188612", "The First 90 Days", "Michael Watkins"],
  ["the-goal", "0884271951", "The Goal", "Eliyahu Goldratt"],
  ["rich-dad-poor-dad", "1612681131", "Rich Dad Poor Dad", "Robert Kiyosaki"],
  ["unshakeable", "1501164589", "Unshakeable", "Tony Robbins"],
  [
    "the-richest-man-in-babylon",
    "",
    "The Richest Man in Babylon",
    "George Clason",
  ],
  ["deep-work", "1455586692", "Deep Work", "Cal Newport"],
  ["atomic-habits", "0735211299", "Atomic Habits", "James Clear"],
  ["the-power-of-habit", "081298160X", "The Power of Habit", "Charles Duhigg"],
  [
    "smarter-faster-better",
    "0812983599",
    "Smarter Faster Better",
    "Charles Duhigg",
  ],
  [
    "the-art-of-impossible",
    "0062977539",
    "The Art of Impossible",
    "Steven Kotler",
  ],
  [
    "the-motivation-hacker",
    "0989279820",
    "The Motivation Hacker",
    "Nick Winter",
  ],
  ["make-time", "0525572422", "Make Time", "Jake Knapp"],
  [
    "feel-good-productivity",
    "1250865034",
    "Feel-Good Productivity",
    "Ali Abdaal",
  ],
  ["tools-of-titans", "1328683788", "Tools of Titans", "Tim Ferriss"],
  ["principles", "1501124021", "Principles Life and Work", "Ray Dalio"],
  ["unlimited-power", "0684845776", "Unlimited Power", "Tony Robbins"],
  [
    "the-greatest-salesman-in-the-world",
    "0593976746",
    "The Greatest Salesman in the World",
    "Og Mandino",
  ],
  ["12-rules-for-life", "0345816021", "12 Rules for Life", "Jordan Peterson"],
  ["extreme-ownership", "1250183863", "Extreme Ownership", "Jocko Willink"],
  ["crushing-it", "0062845020", "Crushing It", "Gary Vaynerchuk"],
  ["crush-it", "0061914177", "Crush It", "Gary Vaynerchuk"],
  [
    "jab-jab-jab-right-hook",
    "006227306X",
    "Jab Jab Jab Right Hook",
    "Gary Vaynerchuk",
  ],
  ["show-your-work", "076117897X", "Show Your Work", "Austin Kleon"],
  [
    "steal-like-an-artist",
    "1523516321",
    "Steal Like an Artist",
    "Austin Kleon",
  ],
  ["the-pathless-path", "", "The Pathless Path", "Paul Millerd"],
  [
    "getting-from-college-to-career",
    "006114259X",
    "Getting from College to Career",
    "Lindsey Pollak",
  ],
  ["win-every-argument", "1250853478", "Win Every Argument", "Mehdi Hasan"],
  ["redefining-anxiety", "194212144X", "Redefining Anxiety", "John Delony"],
  ["i-cant-make-this-up", "1501155571", "I Can't Make This Up", "Kevin Hart"],
  [
    "arnold-education-of-a-bodybuilder",
    "0671797484",
    "Arnold The Education of a Bodybuilder",
    "Arnold Schwarzenegger",
  ],
  [
    "the-israel-lobby",
    "0374531501",
    "The Israel Lobby and US Foreign Policy",
    "John Mearsheimer",
  ],
  ["bullies", "1476710007", "Bullies Ben Shapiro", "Ben Shapiro"],
  [
    "angry-about-capitalism",
    "0593238737",
    "It's OK to Be Angry About Capitalism",
    "Bernie Sanders",
  ],
];

async function ok(url) {
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    const buf = Buffer.from(await r.arrayBuffer());
    return buf.length > 1500 ? buf : null; // skip 1px placeholders
  } catch {
    return null;
  }
}

async function gbThumb(q) {
  try {
    const r = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=1&country=US`,
    );
    if (!r.ok) return null;
    const j = await r.json();
    const il = j.items?.[0]?.volumeInfo?.imageLinks;
    if (!il) return null;
    let u = il.large || il.medium || il.thumbnail || il.smallThumbnail;
    if (!u) return null;
    u = u.replace("http://", "https://").replace("&edge=curl", "");
    u = u.replace(/zoom=\d/, "zoom=1");
    return u;
  } catch {
    return null;
  }
}

async function findCover([key, isbn, title, author]) {
  if (isbn) {
    const ol = await ok(
      `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`,
    );
    if (ol) return { buf: ol, src: "openlibrary" };
    const gb = await gbThumb(`isbn:${isbn}`);
    if (gb) {
      const b = await ok(gb);
      if (b) return { buf: b, src: "googlebooks-isbn" };
    }
  }
  const gb2 = await gbThumb(`intitle:${title} inauthor:${author}`);
  if (gb2) {
    const b = await ok(gb2);
    if (b) return { buf: b, src: "googlebooks-title" };
  }
  return null;
}

await mkdir("public/books", { recursive: true });
const misses = [];
for (const b of books) {
  const found = await findCover(b);
  if (!found) {
    misses.push(b[0]);
    console.log("MISS  ", b[0]);
    continue;
  }
  await writeFile(`public/books/${b[0]}.jpg`, found.buf);
  console.log("OK    ", b[0].padEnd(36), found.src, `${found.buf.length}b`);
}
console.log("\nMISSES:", misses.length ? misses.join(", ") : "none");
