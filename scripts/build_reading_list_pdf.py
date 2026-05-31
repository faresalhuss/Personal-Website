#!/usr/bin/env python3
"""
Generates the lead-magnet PDF: "The 25 Books That Shaped How I Build".

Dark + acid-lime brand to match fareshusseini.com. Each entry shows the cover,
title (hyperlinked to Fa'res's Amazon affiliate link), author, and a short blurb.
Title page carries a subtle affiliate disclosure; a "how I read" page mentions
the Kobo (also affiliate-linked).

Run:  python3 scripts/build_reading_list_pdf.py
Out:  assets/lead-magnets/the-25-books.pdf

NOTE: the blurbs below are first-draft copy meant to be edited into Fa'res's
own voice. Swap freely — re-run to regenerate.
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT = os.path.join(ROOT, "assets", "fonts", "Anton-Regular.ttf")
COVERS = os.path.join(ROOT, "public", "books")
OUT = os.path.join(ROOT, "assets", "lead-magnets", "the-25-books.pdf")

TAG = "fareshussein-20"
KOBO_URL = ("https://www.amazon.com/dp/B0CZXX465Z/?tag=fareshussein-20"
            "&linkCode=ll2&linkId=501a9bfa192b264e284d42a8d8dab5ff")

# Brand colors
NIGHT = (0.04, 0.04, 0.04)
CARD = (0.07, 0.07, 0.07)
LIME = (0.859, 1.0, 0.0)      # #DBFF00
INK = (1.0, 1.0, 1.0)
DIM = (0.65, 0.65, 0.65)
FAINT = (0.42, 0.42, 0.42)
LINE = (0.16, 0.16, 0.16)

PAGE_W, PAGE_H = letter
MARGIN = 54


def href(asin, link_id):
    return (f"https://www.amazon.com/dp/{asin}/?tag={TAG}"
            f"&linkCode=ll2&linkId={link_id}")


# Curated 25, grouped. (key, title, author, asin, linkId, blurb)
SECTIONS = [
    ("Business & Strategy", [
        ("100m-offers", "$100M Offers", "Alex Hormozi", "173747574X",
         "c398275a2b090029dfdff34c31160a5c",
         "The clearest thing I've read on building an offer so good people feel silly saying no. It reframed how I price and package everything."),
        ("100m-leads", "$100M Leads", "Alex Hormozi", "B0CFDR3TYV",
         "40b739068a4fdd93273f0fbef3bd5a43",
         "The follow-up on actually getting people to your offer. Tactical lead-gen you can put to work the same day."),
        ("100m-money-models", "$100M Money Models", "Alex Hormozi", "1963349156",
         "bbb33921ef0925d5dcf9db8d5574a513",
         "How to structure offers and payments so growth funds itself. Great for thinking past a single sale."),
        ("business-model-generation", "Business Model Generation",
         "Osterwalder & Pigneur", "0470876417",
         "0bd887089ebafbc240ffb73d5f5fdf34",
         "A visual way to map any business on a single page. I use the canvas to pressure-test ideas before committing."),
        ("the-personal-mba", "The Personal MBA", "Josh Kaufman", "0525543023",
         "a1e48c019f5e15ebf10b497efb36ff30",
         "A broad, no-fluff foundation across sales, marketing, finance, and ops. The closest thing to a business degree you can read on your own."),
        ("your-next-five-moves", "Your Next Five Moves", "Patrick Bet-David",
         "1982154810", "0fc659734454a6da9db8ea4977616d50",
         "Thinking several moves ahead like a chess player. Useful for strategy when everything feels urgent at once."),
        ("the-first-90-days", "The First 90 Days", "Michael D. Watkins",
         "1422188612", "37898626c52f499688284fb8e854368e",
         "How to step into any new role or venture and build momentum fast. Handy any time you're starting something."),
    ]),
    ("Sales & Persuasion", [
        ("never-split-the-difference", "Never Split the Difference",
         "Chris Voss", "0062407805", "c17aea676b75ca71bd0c7698d8b82017",
         "Negotiation from an FBI hostage negotiator. It changed how I handle every important conversation, not just deals."),
        ("the-greatest-salesman-in-the-world", "The Greatest Salesman in the World",
         "Og Mandino", "0593976746", "9ea43ef1ce89219cd5392c3dc7104d4c",
         "A short parable on discipline and persistence. More about who you become than about tactics."),
    ]),
    ("Money & Wealth", [
        ("rich-dad-poor-dad", "Rich Dad Poor Dad", "Robert T. Kiyosaki",
         "1612681131", "b1c213682da1d4d2f7e2fc663a51cb93",
         "The book that rewired how I think about assets, income, and making money work for you instead of the other way around."),
        ("the-richest-man-in-babylon", "The Richest Man in Babylon",
         "George S. Clason", "B0C1J5ML66", "0fd2837ea9b8cef0c6efa60bfa9fa3f4",
         "Timeless money principles told as ancient parables. Simple rules that still hold up."),
        ("principles", "Principles", "Ray Dalio", "1501124021",
         "96437442e1252ad0f5bc37780d287c57",
         "Dalio's system for making decisions and learning from mistakes. I borrowed a lot from his habit of writing down what works."),
    ]),
    ("Marketing & Personal Brand", [
        ("crushing-it", "Crushing It!", "Gary Vaynerchuk", "0062845020",
         "a86f58f66ef8ce56d0cc8e6cba601e4d",
         "The case for building a personal brand and showing up on the platforms. A big part of why I started putting myself out there."),
        ("jab-jab-jab-right-hook", "Jab, Jab, Jab, Right Hook",
         "Gary Vaynerchuk", "006227306X", "aa8a706c80d849fdbd249a94a5e80516",
         "Give value, give value, give value, then ask. The clearest framework I've found for content that actually converts."),
        ("show-your-work", "Show Your Work!", "Austin Kleon", "076117897X",
         "a44a1431c0c170f42955cde47122de74",
         "How to build an audience by sharing the process, not just the polished result. Permission to document as you go."),
        ("steal-like-an-artist", "Steal Like an Artist", "Austin Kleon",
         "1523516321", "02d26aab009efec7bcc17b610a30de99",
         "Creativity as remixing what you love. A quick, freeing read for when you're afraid to start."),
    ]),
    ("Leadership & Mindset", [
        ("extreme-ownership", "Extreme Ownership", "Willink & Babin",
         "1250183863", "d63987787069edc32a18d63872ce404a",
         "Leadership through total accountability. It's the mindset I try to bring to every problem in my businesses."),
        ("choose-your-enemies-wisely", "Choose Your Enemies Wisely",
         "Patrick Bet-David", "0593712846", "c98610b42b3f2de88047189daa99f48b",
         "On building a real business plan and knowing what you're up against. A strong companion to Your Next Five Moves."),
        ("doing-the-impossible", "Doing the Impossible", "Patrick Bet-David",
         "099762230X", "ecc6cbca967b6666d8545eaf9fbaee27",
         "The story behind building a company from nothing. Motivating when the odds feel long."),
    ]),
    ("Productivity & Performance", [
        ("deep-work", "Deep Work", "Cal Newport", "1455586692",
         "4137e63598751ae28b87c49bd6f1f754",
         "The argument for focus as a superpower. It's why I guard blocks of uninterrupted time."),
        ("atomic-habits", "Atomic Habits", "James Clear", "0735211299",
         "1ccae7d4e4783441c4e49807dddcd700",
         "Small habits, repeated, become who you are. The most practical book I've read on actually changing behavior."),
        ("the-power-of-habit", "The Power of Habit", "Charles Duhigg",
         "081298160X", "715731b42156e7e7037523cd78f60bd9",
         "Why habits work the way they do. Pairs well with Atomic Habits for the 'why' behind the 'how.'"),
        ("smarter-faster-better", "Smarter Faster Better", "Charles Duhigg",
         "0812983599", "4fbffca12a96c7b60e2f7e6ec4a5237d",
         "The science of productivity and motivation, with frameworks for getting more out of the same hours."),
        ("the-art-of-impossible", "The Art of Impossible", "Steven Kotler",
         "0062977539", "f1124855ce712c594ab33d625b133ab0",
         "A playbook for peak performance and flow. One of my favorites for doing hard things consistently."),
        ("the-motivation-hacker", "The Motivation Hacker", "Nick Winter",
         "0989279820", "03a192b081e008f09445221343a764de",
         "A short, fun read on engineering your own motivation. Punchy and immediately useful."),
    ]),
]


def set_fill(c, rgb):
    c.setFillColorRGB(*rgb)


def wrap(c, text, font, size, max_w):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if c.stringWidth(trial, font, size) <= max_w:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def paint_bg(c):
    set_fill(c, NIGHT)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)


def footer(c, page_num):
    set_fill(c, FAINT)
    c.setFont("Helvetica", 7.5)
    c.drawString(MARGIN, 30, "FARESHUSSEINI.COM")
    c.drawRightString(PAGE_W - MARGIN, 30, f"{page_num:02d}")
    c.setStrokeColorRGB(*LINE)
    c.setLineWidth(0.5)
    c.line(MARGIN, 42, PAGE_W - MARGIN, 42)


def title_page(c):
    paint_bg(c)
    # eyebrow
    set_fill(c, LIME)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(MARGIN, PAGE_H - 130, "F R E E   G U I D E")
    # title (Anton)
    set_fill(c, INK)
    c.setFont("Anton", 58)
    y = PAGE_H - 215
    for line in ["THE 25 BOOKS", "THAT SHAPED", "HOW I BUILD"]:
        c.drawString(MARGIN, y, line)
        y -= 60
    # lime rule
    c.setStrokeColorRGB(*LIME)
    c.setLineWidth(3)
    c.line(MARGIN, y - 6, MARGIN + 90, y - 6)
    # subtitle
    set_fill(c, DIM)
    c.setFont("Helvetica", 13)
    y -= 44
    for line in wrap(c, "The books I've found most helpful building businesses "
                        "from zero, and why each one earned a place on the list.",
                     "Helvetica", 13, PAGE_W - 2 * MARGIN - 120):
        c.drawString(MARGIN, y, line)
        y -= 18
    # byline
    set_fill(c, INK)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(MARGIN, y - 16, "Fa'res Husseini")
    set_fill(c, FAINT)
    c.setFont("Helvetica", 10)
    c.drawString(MARGIN, y - 32, "fareshusseini.com")

    # subtle affiliate disclosure, bottom
    set_fill(c, FAINT)
    c.setFont("Helvetica-Oblique", 8.5)
    disc = ("This guide contains Amazon affiliate links. If you buy through them "
            "I may earn a small commission, at no extra cost to you. I only list "
            "books I've actually read and found genuinely useful.")
    yy = 78
    for line in wrap(c, disc, "Helvetica-Oblique", 8.5, PAGE_W - 2 * MARGIN):
        c.drawString(MARGIN, yy, line)
        yy -= 12
    c.showPage()


def how_i_read_page(c):
    paint_bg(c)
    set_fill(c, LIME)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(MARGIN, PAGE_H - 120, "B E F O R E   Y O U   S T A R T")
    set_fill(c, INK)
    c.setFont("Anton", 40)
    c.drawString(MARGIN, PAGE_H - 168, "A NOTE ON")
    c.drawString(MARGIN, PAGE_H - 208, "HOW I READ")

    set_fill(c, DIM)
    c.setFont("Helvetica", 13)
    max_w = PAGE_W - 2 * MARGIN
    para1 = ("I read a mix of eBooks and physical books. But because my Kobo "
             "Libra Colour can carry far more books than I can practically "
             "carry or neatly store (I move around a lot), I lean toward "
             "reading on the Kobo more often than not.")
    y = PAGE_H - 252
    # Render with the phrase "Kobo Libra Colour" highlighted + linked.
    phrase = "Kobo Libra Colour"
    for line in wrap(c, para1, "Helvetica", 13, max_w):
        x = MARGIN
        if phrase in line:
            before, after = line.split(phrase, 1)
            set_fill(c, DIM)
            c.drawString(x, y, before)
            x += c.stringWidth(before, "Helvetica", 13)
            set_fill(c, LIME)
            c.setFont("Helvetica-Bold", 13)
            c.drawString(x, y, phrase)
            pw = c.stringWidth(phrase, "Helvetica-Bold", 13)
            c.linkURL(KOBO_URL, (x, y - 2, x + pw, y + 12), relative=0, thickness=0)
            # underline
            c.setStrokeColorRGB(*LIME)
            c.setLineWidth(0.6)
            c.line(x, y - 2, x + pw, y - 2)
            x += pw
            c.setFont("Helvetica", 13)
            set_fill(c, DIM)
            c.drawString(x, y, after)
        else:
            c.drawString(x, y, line)
        y -= 19

    set_fill(c, FAINT)
    c.setFont("Helvetica-Oblique", 10)
    y -= 14
    for line in wrap(c, "Tap any title in this guide to see the book on Amazon.",
                     "Helvetica-Oblique", 10, max_w):
        c.drawString(MARGIN, y, line)
        y -= 14
    footer(c, 2)
    c.showPage()


def draw_cover(c, key, x, y_top, h):
    """Draw a cover with its top at y_top, height h. Returns drawn width."""
    path = os.path.join(COVERS, f"{key}.jpg")
    if os.path.exists(path):
        try:
            iw, ih = Image.open(path).size
            w = h * (iw / ih)
            c.drawImage(ImageReader(path), x, y_top - h, width=w, height=h,
                        preserveAspectRatio=True, mask='auto')
            return w
        except Exception:
            pass
    # fallback placeholder
    w = h * 0.66
    set_fill(c, CARD)
    c.rect(x, y_top - h, w, h, fill=1, stroke=0)
    return w


class Layout:
    def __init__(self, c):
        self.c = c
        self.page = 3
        self.y = PAGE_H - 84
        paint_bg(c)
        self._header()

    def _header(self):
        set_fill(self.c, FAINT)
        self.c.setFont("Helvetica-Bold", 8)
        self.c.drawString(MARGIN, PAGE_H - 54, "THE READING LIST")
        self.c.setStrokeColorRGB(*LINE)
        self.c.setLineWidth(0.5)
        self.c.line(MARGIN, PAGE_H - 62, PAGE_W - MARGIN, PAGE_H - 62)

    def new_page(self):
        footer(self.c, self.page)
        self.c.showPage()
        self.page += 1
        paint_bg(self.c)
        self._header()
        self.y = PAGE_H - 84

    def space(self, needed):
        if self.y - needed < 60:
            self.new_page()

    def section(self, name):
        self.space(46)
        set_fill(self.c, LIME)
        self.c.setFont("Helvetica-Bold", 10)
        self.c.drawString(MARGIN, self.y, name.upper())
        self.y -= 8
        self.c.setStrokeColorRGB(*LIME)
        self.c.setLineWidth(1.5)
        self.c.line(MARGIN, self.y, MARGIN + 34, self.y)
        self.y -= 20

    def entry(self, n, title, author, url, key, blurb):
        c = self.c
        cover_h = 84
        text_x = MARGIN + cover_h * 0.66 + 18
        text_w = PAGE_W - MARGIN - text_x
        blurb_lines = wrap(c, blurb, "Helvetica", 10.5, text_w)
        block_h = max(cover_h, 22 + 14 + len(blurb_lines) * 14)
        self.space(block_h + 16)

        top = self.y
        cw = draw_cover(c, key, MARGIN, top, cover_h)
        # link the cover too
        c.linkURL(url, (MARGIN, top - cover_h, MARGIN + cw, top), relative=0, thickness=0)

        # number + title (Anton, lime, linked)
        set_fill(c, FAINT)
        c.setFont("Helvetica-Bold", 10)
        num = f"{n:02d}"
        c.drawString(text_x, top - 4, num)
        nx = text_x + c.stringWidth(num, "Helvetica-Bold", 10) + 8
        set_fill(c, LIME)
        c.setFont("Anton", 16)
        # title may need truncation to fit one line; wrap to max 2 lines
        t_lines = wrap(c, title, "Anton", 16, text_w - (nx - text_x))
        ty = top - 4
        for i, tl in enumerate(t_lines[:2]):
            c.drawString(nx if i == 0 else text_x, ty, tl)
            tw = c.stringWidth(tl, "Anton", 16)
            lx = nx if i == 0 else text_x
            c.linkURL(url, (lx, ty - 2, lx + tw, ty + 14), relative=0, thickness=0)
            ty -= 17
        # author
        set_fill(c, DIM)
        c.setFont("Helvetica-Oblique", 10)
        c.drawString(text_x, ty - 1, author)
        ty -= 16
        # blurb
        set_fill(c, (0.78, 0.78, 0.78))
        c.setFont("Helvetica", 10.5)
        for bl in blurb_lines:
            c.drawString(text_x, ty, bl)
            ty -= 14

        self.y = top - block_h - 16
        # divider
        c.setStrokeColorRGB(*LINE)
        c.setLineWidth(0.5)
        c.line(MARGIN, self.y + 6, PAGE_W - MARGIN, self.y + 6)


def main():
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    pdfmetrics.registerFont(TTFont("Anton", FONT))
    c = canvas.Canvas(OUT, pagesize=letter)
    c.setTitle("The 25 Books That Shaped How I Build")
    c.setAuthor("Fa'res Husseini")
    c.setSubject("Reading list — fareshusseini.com")

    title_page(c)
    how_i_read_page(c)

    lay = Layout(c)
    n = 1
    for name, books in SECTIONS:
        lay.section(name)
        for (key, title, author, asin, link_id, blurb) in books:
            lay.entry(n, title, author, href(asin, link_id), key, blurb)
            n += 1
    footer(c, lay.page)
    c.showPage()
    c.save()
    print(f"Wrote {OUT} ({n - 1} books)")


if __name__ == "__main__":
    main()
