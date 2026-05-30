/**
 * ── BOOKS DATA ─────────────────────────────────────────────────────────
 * `readingHistory` is the single source of truth for finished books — the
 * "books read" counter is just its length, so books are never counted twice
 * even when they're also featured in a list.
 *
 * Featured lists reference books from the history by `key` (see `pick()`), so a
 * favorite is automatically part of the history with no duplicated data.
 *
 * To mark a currently-reading book as finished: move its object from
 * `currentlyReading` into `readingHistory`. To feature it, add its `key` to a
 * list. Covers load by ISBN from Open Library; set `coverUrl` to override.
 */

export type Book = {
  key: string;
  title: string;
  author: string;
  isbn?: string;
  coverUrl?: string;
  asin?: string;
  linkId?: string; // Amazon SiteStripe per-link id (optional)
  amazonUrl?: string; // full link (overrides asin/linkId)
  note?: string;
};

export type BookList = {
  slug: string;
  title: string;
  blurb?: string;
  books: Book[];
};

export const AMAZON_ASSOCIATES_TAG = "fareshussein-20";

// Fa'res's e-reader (Amazon affiliate link; covered by the page's disclosure).
export const eReader = {
  name: "Kobo Libra Colour",
  url: "https://www.amazon.com/dp/B0CZXX465Z/?tag=fareshussein-20&linkCode=ll2&linkId=501a9bfa192b264e284d42a8d8dab5ff",
};

export const currentlyReading: Book[] = [
  {
    key: "the-goal",
    title: "The Goal",
    author: "Eliyahu M. Goldratt",
    isbn: "0884271951",
    asin: "0884271951",
    linkId: "c0369e34ddd9353dc33bbea3af46c2de",
  },
  {
    key: "awaken-the-giant-within",
    title: "Awaken the Giant Within",
    author: "Tony Robbins",
    isbn: "1471188426",
    asin: "1471188426",
    linkId: "acec396bfc79b7beca6ea93d234ffd87",
  },
  {
    key: "build-a-business-you-love",
    title: "Build a Business You Love",
    author: "Dave Ramsey",
    asin: "B0D8BQWJVK",
    linkId: "f6d5030ff2d5e66a0ed4a1c323796980",
  },
];

export const readingHistory: Book[] = [
  {
    key: "100m-offers",
    title: "$100M Offers",
    author: "Alex Hormozi",
    isbn: "173747574X",
    asin: "173747574X",
    linkId: "c398275a2b090029dfdff34c31160a5c",
  },
  {
    key: "100m-leads",
    title: "$100M Leads",
    author: "Alex Hormozi",
    asin: "B0CFDR3TYV",
    linkId: "40b739068a4fdd93273f0fbef3bd5a43",
  },
  {
    key: "100m-money-models",
    title: "$100M Money Models",
    author: "Alex Hormozi",
    isbn: "1963349156",
    asin: "1963349156",
    linkId: "bbb33921ef0925d5dcf9db8d5574a513",
  },
  {
    key: "never-split-the-difference",
    title: "Never Split the Difference",
    author: "Chris Voss",
    isbn: "0062407805",
    asin: "0062407805",
    linkId: "c17aea676b75ca71bd0c7698d8b82017",
  },
  {
    key: "business-model-generation",
    title: "Business Model Generation",
    author: "Alexander Osterwalder & Yves Pigneur",
    isbn: "0470876417",
    asin: "0470876417",
    linkId: "0bd887089ebafbc240ffb73d5f5fdf34",
  },
  {
    key: "the-personal-mba",
    title: "The Personal MBA",
    author: "Josh Kaufman",
    isbn: "0525543023",
    asin: "0525543023",
    linkId: "a1e48c019f5e15ebf10b497efb36ff30",
  },
  {
    key: "your-next-five-moves",
    title: "Your Next Five Moves",
    author: "Patrick Bet-David",
    isbn: "1982154810",
    asin: "1982154810",
    linkId: "0fc659734454a6da9db8ea4977616d50",
  },
  {
    key: "choose-your-enemies-wisely",
    title: "Choose Your Enemies Wisely",
    author: "Patrick Bet-David",
    isbn: "0593712846",
    asin: "0593712846",
    linkId: "c98610b42b3f2de88047189daa99f48b",
  },
  {
    key: "doing-the-impossible",
    title: "Doing the Impossible",
    author: "Patrick Bet-David",
    isbn: "099762230X",
    asin: "099762230X",
    linkId: "ecc6cbca967b6666d8545eaf9fbaee27",
  },
  {
    key: "the-first-90-days",
    title: "The First 90 Days",
    author: "Michael D. Watkins",
    isbn: "1422188612",
    asin: "1422188612",
    linkId: "37898626c52f499688284fb8e854368e",
  },
  {
    key: "rich-dad-poor-dad",
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    isbn: "1612681131",
    asin: "1612681131",
    linkId: "b1c213682da1d4d2f7e2fc663a51cb93",
  },
  {
    key: "unshakeable",
    title: "Unshakeable",
    author: "Tony Robbins",
    isbn: "1501164589",
    asin: "1501164589",
    linkId: "992e797d431c9eafb9ccf1d0419ea89c",
  },
  {
    key: "the-richest-man-in-babylon",
    title: "The Richest Man in Babylon",
    author: "George S. Clason",
    asin: "B0C1J5ML66",
    linkId: "0fd2837ea9b8cef0c6efa60bfa9fa3f4",
  },
  {
    key: "deep-work",
    title: "Deep Work",
    author: "Cal Newport",
    isbn: "1455586692",
    asin: "1455586692",
    linkId: "4137e63598751ae28b87c49bd6f1f754",
  },
  {
    key: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    isbn: "0735211299",
    asin: "0735211299",
    linkId: "1ccae7d4e4783441c4e49807dddcd700",
  },
  {
    key: "the-power-of-habit",
    title: "The Power of Habit",
    author: "Charles Duhigg",
    isbn: "081298160X",
    asin: "081298160X",
    linkId: "715731b42156e7e7037523cd78f60bd9",
  },
  {
    key: "smarter-faster-better",
    title: "Smarter Faster Better",
    author: "Charles Duhigg",
    isbn: "0812983599",
    asin: "0812983599",
    linkId: "4fbffca12a96c7b60e2f7e6ec4a5237d",
  },
  {
    key: "the-art-of-impossible",
    title: "The Art of Impossible",
    author: "Steven Kotler",
    isbn: "0062977539",
    asin: "0062977539",
    linkId: "f1124855ce712c594ab33d625b133ab0",
  },
  {
    key: "the-motivation-hacker",
    title: "The Motivation Hacker",
    author: "Nick Winter",
    isbn: "0989279820",
    asin: "0989279820",
    linkId: "03a192b081e008f09445221343a764de",
  },
  {
    key: "make-time",
    title: "Make Time",
    author: "Jake Knapp & John Zeratsky",
    isbn: "0525572422",
    asin: "0525572422",
    linkId: "c2d4e7c7bd84955a53edceb46feb1261",
  },
  {
    key: "feel-good-productivity",
    title: "Feel-Good Productivity",
    author: "Ali Abdaal",
    isbn: "1250865034",
    asin: "1250865034",
    linkId: "1ac19947f0ce097260dca188823ca279",
  },
  {
    key: "tools-of-titans",
    title: "Tools of Titans",
    author: "Tim Ferriss",
    isbn: "1328683788",
    asin: "1328683788",
    linkId: "116d6981aedce3c9856fea85e5b35621",
  },
  {
    key: "principles",
    title: "Principles",
    author: "Ray Dalio",
    isbn: "1501124021",
    asin: "1501124021",
    linkId: "96437442e1252ad0f5bc37780d287c57",
  },
  {
    key: "unlimited-power",
    title: "Unlimited Power",
    author: "Tony Robbins",
    isbn: "0684845776",
    asin: "0684845776",
    linkId: "68d50e753ea1662c1d20dea829a6e06e",
  },
  {
    key: "the-greatest-salesman-in-the-world",
    title: "The Greatest Salesman in the World",
    author: "Og Mandino",
    isbn: "0593976746",
    asin: "0593976746",
    linkId: "9ea43ef1ce89219cd5392c3dc7104d4c",
  },
  {
    key: "12-rules-for-life",
    title: "12 Rules for Life",
    author: "Jordan B. Peterson",
    isbn: "0345816021",
    asin: "0345816021",
    linkId: "a658156cc8c9d99a4bc8427d0429e7a1",
  },
  {
    key: "extreme-ownership",
    title: "Extreme Ownership",
    author: "Jocko Willink & Leif Babin",
    isbn: "1250183863",
    asin: "1250183863",
    linkId: "d63987787069edc32a18d63872ce404a",
  },
  {
    key: "crushing-it",
    title: "Crushing It!",
    author: "Gary Vaynerchuk",
    isbn: "0062845020",
    asin: "0062845020",
    linkId: "a86f58f66ef8ce56d0cc8e6cba601e4d",
  },
  {
    key: "crush-it",
    title: "Crush It!",
    author: "Gary Vaynerchuk",
    isbn: "0061914177",
    asin: "0061914177",
    linkId: "d01102c9dfcf9bc2bed278233bd338b0",
  },
  {
    key: "jab-jab-jab-right-hook",
    title: "Jab, Jab, Jab, Right Hook",
    author: "Gary Vaynerchuk",
    isbn: "006227306X",
    asin: "006227306X",
    linkId: "aa8a706c80d849fdbd249a94a5e80516",
  },
  {
    key: "show-your-work",
    title: "Show Your Work!",
    author: "Austin Kleon",
    isbn: "076117897X",
    asin: "076117897X",
    linkId: "a44a1431c0c170f42955cde47122de74",
  },
  {
    key: "steal-like-an-artist",
    title: "Steal Like an Artist",
    author: "Austin Kleon",
    isbn: "1523516321",
    asin: "1523516321",
    linkId: "02d26aab009efec7bcc17b610a30de99",
  },
  {
    key: "the-pathless-path",
    title: "The Pathless Path",
    author: "Paul Millerd",
    asin: "B09QF6Q421",
    linkId: "02a4fe7c145bc9b8adf6cb1a24516c05",
  },
  {
    key: "getting-from-college-to-career",
    title: "Getting from College to Career",
    author: "Lindsey Pollak",
    isbn: "006114259X",
    asin: "006114259X",
    linkId: "371df624be0cef31ad6088d5a48be53e",
  },
  {
    key: "win-every-argument",
    title: "Win Every Argument",
    author: "Mehdi Hasan",
    isbn: "1250853478",
    asin: "1250853478",
    linkId: "e50bfecc76f44ec2e4010884076a0949",
  },
  {
    key: "redefining-anxiety",
    title: "Redefining Anxiety",
    author: "John Delony",
    isbn: "194212144X",
    asin: "194212144X",
    linkId: "109e11f6d8668cc1150e1737cd6bc7f9",
  },
  {
    key: "i-cant-make-this-up",
    title: "I Can't Make This Up",
    author: "Kevin Hart",
    isbn: "1501155571",
    asin: "1501155571",
    linkId: "7ea8b55b9e8480b2b142237639ed062d",
  },
  {
    key: "arnold-education-of-a-bodybuilder",
    title: "Arnold: The Education of a Bodybuilder",
    author: "Arnold Schwarzenegger",
    isbn: "0671797484",
    asin: "0671797484",
    linkId: "4f2f2607889540ed6068f3c14405c0d4",
  },
  {
    key: "the-israel-lobby",
    title: "The Israel Lobby and U.S. Foreign Policy",
    author: "John J. Mearsheimer & Stephen M. Walt",
    isbn: "0374531501",
    asin: "0374531501",
    linkId: "54794630e3ababc81ecd8934a250fa44",
  },
  {
    key: "bullies",
    title: "Bullies",
    author: "Ben Shapiro",
    isbn: "1476710007",
    asin: "1476710007",
    linkId: "e306fd9e2107569d757f16fd7bb8ddd1",
  },
  {
    key: "angry-about-capitalism",
    title: "It's OK to Be Angry About Capitalism",
    author: "Bernie Sanders",
    isbn: "0593238737",
    asin: "0593238737",
    linkId: "10ab6a8317592a7b061639a8e693a826",
  },
  {
    key: "introduction-to-islamic-economics",
    title: "Introduction to Islamic Economics",
    author: "Hossein Askari, Zamir Iqbal & Abbas Mirakhor",
    isbn: "1118732960",
    asin: "1118732960",
    linkId: "ce760f84a77fa20af2c508338319bfa5",
  },
];

const historyByKey = new Map(readingHistory.map((b) => [b.key, b]));

function pick(keys: string[]): Book[] {
  return keys
    .map((k) => historyByKey.get(k))
    .filter((b): b is Book => Boolean(b));
}

export const featuredLists: BookList[] = [
  {
    slug: "favorite-business-books",
    title: "My favorite business books",
    blurb: "The ones I've found the most helpful.",
    books: pick([
      "100m-offers",
      "100m-leads",
      "never-split-the-difference",
      "business-model-generation",
    ]),
  },
  {
    slug: "favorite-personal-development-books",
    title: "My favorite personal development books",
    blurb: "The ones that changed how I work.",
    books: pick([
      "the-art-of-impossible",
      "smarter-faster-better",
      "the-motivation-hacker",
      "deep-work",
    ]),
  },
];

/** The "books read" counter. Counts only finished books, never duplicates. */
export const totalBooksRead = readingHistory.length;

export function bookCoverSrc(book: Book): string {
  // Self-hosted in /public/books (downloaded via scripts/fetch-covers*.mjs) so
  // covers are reliable and fast. Missing ones fall back in <BookCover>.
  return book.coverUrl ?? `/books/${book.key}.jpg`;
}

export function amazonHref(book: Book): string {
  if (book.amazonUrl) return book.amazonUrl;
  const tag = AMAZON_ASSOCIATES_TAG;
  if (book.asin) {
    const linkId = book.linkId ? `&linkId=${book.linkId}` : "";
    return `https://www.amazon.com/dp/${book.asin}/?tag=${tag}&linkCode=ll2${linkId}`;
  }
  const q = encodeURIComponent(`${book.title} ${book.author}`);
  return `https://www.amazon.com/s?k=${q}&tag=${tag}`;
}
