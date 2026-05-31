#!/usr/bin/env python3
"""
Generates the lead-magnet PDF for fareshusseini.com.

Layout/format is modeled on the "Modern Wisdom Reading List" style — a tall,
mobile-friendly guide with a big condensed title page, a personal Welcome
letter (with a script signature), a section divider, and one entry per book
(cover + highlighted category tag + description + "Buy on Amazon" link, with
the cover alternating left/right). Rendered in Fa'res's dark + acid-lime brand.

Run:  python3 scripts/build_reading_list_pdf.py
Out:  assets/lead-magnets/reading-list.pdf

NOTE: blurbs are first-draft copy meant to be edited into Fa'res's own voice.
"""

import os
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ANTON = os.path.join(ROOT, "assets", "fonts", "Anton-Regular.ttf")
SCRIPT = os.path.join(ROOT, "assets", "fonts", "Sacramento-Regular.ttf")
COVERS = os.path.join(ROOT, "public", "books")
OUT = os.path.join(ROOT, "assets", "lead-magnets", "reading-list.pdf")

TAG = "fareshussein-20"
KOBO_URL = ("https://www.amazon.com/dp/B0CZXX465Z/?tag=fareshussein-20"
            "&linkCode=ll2&linkId=501a9bfa192b264e284d42a8d8dab5ff")

# Tall, story-style page (matches the reference proportions).
PAGE_W, PAGE_H = 595.28, 1057.32
MARGIN = 46

# Brand palette
NIGHT = (0.039, 0.039, 0.039)   # #0A0A0A
LIME = (0.859, 1.0, 0.0)        # #DBFF00
INK = (1.0, 1.0, 1.0)
DIM = (0.78, 0.78, 0.78)
MUTE = (0.62, 0.62, 0.62)
FAINT = (0.42, 0.42, 0.42)
LINE = (0.18, 0.18, 0.18)


def href(asin, link_id):
    return (f"https://www.amazon.com/dp/{asin}/?tag={TAG}"
            f"&linkCode=ll2&linkId={link_id}")


# (key, title, author, asin, linkId, tag, blurb) — in the order Fa'res gave.
BOOKS = [
    ("the-art-of-impossible", "The Art of Impossible", "Steven Kotler",
     "0062977539", "f1124855ce712c594ab33d625b133ab0",
     "Peak Performance, Flow",
     "A practical playbook for peak performance and getting into flow. It's "
     "one of my favorites for doing hard things consistently, instead of in "
     "bursts."),
    ("deep-work", "Deep Work", "Cal Newport", "1455586692",
     "4137e63598751ae28b87c49bd6f1f754", "Focus, Productivity",
     "The case for focus as a competitive advantage. It's why I guard long, "
     "uninterrupted blocks for the work that actually moves things forward."),
    ("never-split-the-difference", "Never Split the Difference", "Chris Voss",
     "0062407805", "c17aea676b75ca71bd0c7698d8b82017", "Negotiation, Sales",
     "Negotiation tactics from an FBI hostage negotiator. It changed how I "
     "handle every important conversation, not just deals."),
    ("100m-offers", "$100M Offers", "Alex Hormozi", "173747574X",
     "c398275a2b090029dfdff34c31160a5c", "Offers, Pricing",
     "The clearest thing I've read on building an offer so good people feel "
     "silly saying no. It reframed how I price and package everything."),
    ("principles", "Principles", "Ray Dalio", "1501124021",
     "96437442e1252ad0f5bc37780d287c57", "Decision-Making, Leadership",
     "Ray Dalio's system for making decisions and learning from mistakes. I "
     "borrowed his habit of writing down what works and turning it into rules."),
    ("the-greatest-salesman-in-the-world", "The Greatest Salesman in the World",
     "Og Mandino", "0593976746", "9ea43ef1ce89219cd5392c3dc7104d4c",
     "Sales, Discipline",
     "A short parable about persistence and discipline in selling. It's more "
     "about who you become than about any particular tactic."),
    ("unlimited-power", "Unlimited Power", "Tony Robbins", "0684845776",
     "68d50e753ea1662c1d20dea829a6e06e", "Mindset, Psychology",
     "Tony Robbins on the psychology of performance and state. Dated in "
     "places, but the core ideas on belief and modeling stuck with me."),
    ("the-power-of-habit", "The Power of Habit", "Charles Duhigg", "081298160X",
     "715731b42156e7e7037523cd78f60bd9", "Habits, Behavior",
     "Why habits form and how to change them. Useful alongside anything "
     "you're trying to build or break."),
    ("make-time", "Make Time", "Jake Knapp & John Zeratsky", "0525572422",
     "c2d4e7c7bd84955a53edceb46feb1261", "Productivity, Focus",
     "A simple, flexible system for spending your attention on what matters. "
     "Small daily tweaks, not a rigid productivity religion."),
    ("the-richest-man-in-babylon", "The Richest Man in Babylon",
     "George S. Clason", "B0C1J5ML66", "0fd2837ea9b8cef0c6efa60bfa9fa3f4",
     "Money, Wealth",
     "Timeless money principles told as ancient parables. Simple rules that "
     "still hold up a century later."),
    ("100m-money-models", "$100M Money Models", "Alex Hormozi", "1963349156",
     "bbb33921ef0925d5dcf9db8d5574a513", "Offers, Monetization",
     "How to structure offers and payments so growth funds itself. Great for "
     "thinking past a single sale."),
    ("100m-leads", "$100M Leads", "Alex Hormozi", "B0CFDR3TYV",
     "40b739068a4fdd93273f0fbef3bd5a43", "Lead Generation, Marketing",
     "The follow-up to $100M Offers, all about actually getting people to "
     "your offer. Tactical lead-gen you can put to work the same day."),
    ("build-a-business-you-love", "Build a Business You Love", "Dave Ramsey",
     "B0D8BQWJVK", "f6d5030ff2d5e66a0ed4a1c323796980",
     "Entrepreneurship, Leadership",
     "Dave Ramsey on building a company without losing yourself in it. "
     "Practical and grounded in clear values."),
    ("the-goal", "The Goal", "Eliyahu M. Goldratt", "0884271951",
     "c0369e34ddd9353dc33bbea3af46c2de", "Operations, Systems",
     "A business novel about finding and fixing bottlenecks. It quietly "
     "rewired how I think about systems and constraints."),
    ("awaken-the-giant-within", "Awaken the Giant Within", "Tony Robbins",
     "1471188426", "acec396bfc79b7beca6ea93d234ffd87", "Mindset, Self-Mastery",
     "Tony Robbins on taking control of your decisions and standards. A big, "
     "motivating read for raising your own bar."),
]


def fill(c, rgb):
    c.setFillColorRGB(*rgb)


def stroke(c, rgb):
    c.setStrokeColorRGB(*rgb)


def wrap(c, text, font, size, max_w):
    out, cur = [], ""
    for w in text.split():
        t = (cur + " " + w).strip()
        if c.stringWidth(t, font, size) <= max_w:
            cur = t
        else:
            if cur:
                out.append(cur)
            cur = w
    if cur:
        out.append(cur)
    return out


def bg(c):
    fill(c, NIGHT)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)


def footer(c, page_num):
    fill(c, FAINT)
    c.setFont("Helvetica", 8)
    c.drawString(MARGIN, 34, "THE READING LIST")
    c.drawRightString(PAGE_W - MARGIN, 34, str(page_num))


# ---------- pages ----------

def title_page(c):
    bg(c)
    band_h = PAGE_H * 0.30
    # lime band at bottom
    fill(c, LIME)
    c.rect(0, 0, PAGE_W, band_h, fill=1, stroke=0)

    fill(c, LIME)
    c.setFont("Anton", 26)
    c.drawString(MARGIN, PAGE_H - 300, "FA'RES HUSSEINI")
    fill(c, INK)
    c.setFont("Anton", 96)
    c.drawString(MARGIN - 4, PAGE_H - 400, "READING")
    c.drawString(MARGIN - 4, PAGE_H - 492, "LIST")

    # band text (black on lime)
    fill(c, NIGHT)
    c.setFont("Anton", 40)
    y = band_h - 70
    for line in ["15 BOOKS THAT", "SHAPED HOW", "I BUILD"]:
        c.drawString(MARGIN, y, line)
        y -= 42
    c.showPage()


def welcome_page(c):
    bg(c)
    band_h = PAGE_H * 0.22
    fill(c, LIME)
    c.rect(0, PAGE_H - band_h, PAGE_W, band_h, fill=1, stroke=0)
    fill(c, NIGHT)
    c.setFont("Anton", 84)
    c.drawString(MARGIN - 4, PAGE_H - band_h + 44, "WELCOME")

    max_w = PAGE_W - 2 * MARGIN
    y = PAGE_H - band_h - 56
    fill(c, DIM)
    c.setFont("Helvetica", 13.5)
    c.drawString(MARGIN, y, "Hi friend,")
    y -= 30

    paras = [
        "These are the 15 books I've found most helpful while building my "
        "businesses from zero. It isn't a list of the greatest books ever "
        "written. It's the ones that actually changed how I think, sell, and "
        "work.",
        "I read a mix of physical books and eBooks. But because my "
        "<<Kobo Libra Colour>> can carry far more than I can practically "
        "carry or neatly store (I move around a lot), I lean toward reading "
        "on the Kobo more often than not.",
        "I hope at least one of these ends up being as useful to you as it "
        "was to me.",
    ]
    for p in paras:
        y = draw_rich_paragraph(c, p, MARGIN, y, max_w, 13.5, 20)
        y -= 14

    # signature
    fill(c, INK)
    c.setFont("Sacramento", 46)
    c.drawString(MARGIN, y - 18, "Fa'res")

    # subtle affiliate disclosure
    fill(c, FAINT)
    c.setFont("Helvetica-Oblique", 8.5)
    disc = ("This guide contains Amazon affiliate links. If you buy through "
            "them I may earn a small commission, at no extra cost to you. I "
            "only include books I've actually read and found genuinely useful.")
    yy = 70
    for line in wrap(c, disc, "Helvetica-Oblique", 8.5, max_w):
        c.drawString(MARGIN, yy, line)
        yy -= 11
    footer(c, 1)
    c.showPage()


def draw_rich_paragraph(c, text, x, y, max_w, size, leading):
    """Body paragraph; <<...>> marks a lime, underlined Kobo affiliate link."""
    link_phrase = None
    if "<<" in text:
        pre, rest = text.split("<<", 1)
        link_phrase, post = rest.split(">>", 1)
        text = pre + link_phrase + post
    lines = wrap(c, text, "Helvetica", size, max_w)
    for line in lines:
        cx = x
        if link_phrase and link_phrase in line:
            before, after = line.split(link_phrase, 1)
            fill(c, DIM)
            c.setFont("Helvetica", size)
            c.drawString(cx, y, before)
            cx += c.stringWidth(before, "Helvetica", size)
            fill(c, LIME)
            c.setFont("Helvetica-Bold", size)
            c.drawString(cx, y, link_phrase)
            pw = c.stringWidth(link_phrase, "Helvetica-Bold", size)
            c.linkURL(KOBO_URL, (cx, y - 2, cx + pw, y + size),
                      relative=0, thickness=0)
            stroke(c, LIME)
            c.setLineWidth(0.6)
            c.line(cx, y - 2, cx + pw, y - 2)
            cx += pw
            fill(c, DIM)
            c.setFont("Helvetica", size)
            c.drawString(cx, y, after)
        else:
            fill(c, DIM)
            c.setFont("Helvetica", size)
            c.drawString(cx, y, line)
        y -= leading
    return y


def divider_page(c, label, page_num):
    bg(c)
    fill(c, LIME)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    fill(c, NIGHT)
    c.setFont("Anton", 92)
    c.drawString(MARGIN, PAGE_H / 2 + 10, label)
    fill(c, NIGHT)
    c.setFont("Helvetica", 8)
    c.drawString(MARGIN, 34, "THE READING LIST")
    c.drawRightString(PAGE_W - MARGIN, 34, str(page_num))
    c.showPage()


SLOT_W = 104        # uniform cover-column width so every text column aligns
COVER_MAX_H = 168


def cover_fit(key):
    """Fit a cover into a fixed-width slot. Returns (path, width, height)."""
    path = os.path.join(COVERS, f"{key}.jpg")
    if os.path.exists(path):
        try:
            iw, ih = Image.open(path).size
            h = SLOT_W * ih / iw
            if h > COVER_MAX_H:  # unusually tall cover — clamp by height
                return path, COVER_MAX_H * iw / ih, COVER_MAX_H
            return path, SLOT_W, h
        except Exception:
            pass
    return None, SLOT_W, SLOT_W * 1.5


class Flow:
    def __init__(self, c, start_page):
        self.c = c
        self.page = start_page
        bg(c)  # paint the dark background on the first entry page
        self.y = PAGE_H - 70

    def new_page(self):
        footer(self.c, self.page)
        self.c.showPage()
        self.page += 1
        bg(self.c)
        self.y = PAGE_H - 70

    def entry(self, n, book, cover_left):
        c = self.c
        key, title, author, asin, link_id, tag, blurb = book
        url = href(asin, link_id)

        # spacing constants (all measured from the entry's top y, going down)
        NUM_TO_TITLE = 27   # number baseline -> first title baseline
        TITLE_LEAD = 24
        TITLE_TO_AUTHOR = 22
        AUTHOR_TO_ROW = 22  # author baseline -> top of cover/text row
        TAG_TO_BLURB = 30
        BLURB_LEAD = 15
        BLURB_TO_BUY = 20
        DIV_GAP = 22        # content bottom -> divider line
        ENTRY_GAP = 26      # divider -> next entry top

        gap = 22
        path, cw, ch = cover_fit(key)
        text_w = PAGE_W - 2 * MARGIN - SLOT_W - gap

        title_lines = wrap(c, title.upper(), "Anton", 22, PAGE_W - 2 * MARGIN)
        blurb_lines = wrap(c, blurb, "Helvetica", 11, text_w)
        n_title = len(title_lines)

        head_h = (NUM_TO_TITLE + TITLE_LEAD * (n_title - 1)
                  + TITLE_TO_AUTHOR + AUTHOR_TO_ROW)
        text_depth = TAG_TO_BLURB + BLURB_LEAD * (len(blurb_lines) - 1) + BLURB_TO_BUY
        row_depth = max(ch, text_depth)
        total = head_h + row_depth + DIV_GAP + ENTRY_GAP

        if self.y - total < 60:
            self.new_page()

        top = self.y
        # number
        fill(c, LIME)
        c.setFont("Helvetica-Bold", 10)
        c.drawString(MARGIN, top, f"{n:02d}")
        # title
        fill(c, INK)
        c.setFont("Anton", 22)
        ty = top - NUM_TO_TITLE
        for i, tl in enumerate(title_lines):
            c.drawString(MARGIN, ty, tl)
            tw = c.stringWidth(tl, "Anton", 22)
            c.linkURL(url, (MARGIN, ty - 3, MARGIN + tw, ty + 16),
                      relative=0, thickness=0)
            if i < n_title - 1:
                ty -= TITLE_LEAD
        # author
        fill(c, MUTE)
        c.setFont("Helvetica-Oblique", 11.5)
        ay = ty - TITLE_TO_AUTHOR
        c.drawString(MARGIN, ay, author)
        row_top = ay - AUTHOR_TO_ROW

        # cover (uniform slot, alternating side)
        if cover_left:
            cover_x = MARGIN
            text_x = MARGIN + SLOT_W + gap
        else:
            cover_x = PAGE_W - MARGIN - SLOT_W
            text_x = MARGIN
        if path:
            c.drawImage(ImageReader(path), cover_x, row_top - ch, width=cw,
                        height=ch, preserveAspectRatio=True, mask='auto')
        else:
            fill(c, (0.1, 0.1, 0.1))
            c.rect(cover_x, row_top - ch, cw, ch, fill=1, stroke=0)
        c.linkURL(url, (cover_x, row_top - ch, cover_x + cw, row_top),
                  relative=0, thickness=0)

        # text column: tag highlight + blurb + buy link
        tx = text_x
        c.setFont("Helvetica-Bold", 9)
        tag_w = c.stringWidth(tag, "Helvetica-Bold", 9)
        fill(c, LIME)
        c.roundRect(tx, row_top - 13, tag_w + 14, 18, 3, fill=1, stroke=0)
        fill(c, NIGHT)
        c.drawString(tx + 7, row_top - 8, tag)

        by = row_top - TAG_TO_BLURB
        fill(c, DIM)
        c.setFont("Helvetica", 11)
        for bl in blurb_lines:
            c.drawString(tx, by, bl)
            by -= BLURB_LEAD
        by += BLURB_LEAD  # back to last blurb baseline
        buy_y = by - BLURB_TO_BUY
        fill(c, LIME)
        c.setFont("Helvetica-Bold", 10.5)
        buy = "Buy on Amazon  →"
        c.drawString(tx, buy_y, buy)
        bw = c.stringWidth(buy, "Helvetica-Bold", 10.5)
        c.linkURL(url, (tx, buy_y - 3, tx + bw, buy_y + 11),
                  relative=0, thickness=0)

        # divider sits below whichever column is deeper
        content_bottom = min(row_top - ch, buy_y - 5)
        div_y = content_bottom - DIV_GAP
        stroke(c, LINE)
        c.setLineWidth(0.5)
        c.line(MARGIN, div_y, PAGE_W - MARGIN, div_y)
        self.y = div_y - ENTRY_GAP


def closing_page(c, page_num):
    bg(c)
    fill(c, LIME)
    c.setFont("Anton", 56)
    c.drawString(MARGIN, PAGE_H - 200, "THAT'S")
    c.drawString(MARGIN, PAGE_H - 252, "THE LIST.")
    fill(c, DIM)
    c.setFont("Helvetica", 13.5)
    y = PAGE_H - 320
    for line in wrap(c, "If you read just one, pick the one that scares you a "
                        "little. That's usually the one worth your time.",
                     "Helvetica", 13.5, PAGE_W - 2 * MARGIN):
        c.drawString(MARGIN, y, line)
        y -= 20
    y -= 26
    fill(c, INK)
    c.setFont("Anton", 20)
    c.drawString(MARGIN, y, "FIND ME HERE")
    y -= 30
    fill(c, DIM)
    c.setFont("Helvetica", 12.5)
    for label, url in [
        ("fareshusseini.com  →  The Weekly Note + more",
         "https://www.fareshusseini.com"),
        ("TikTok  →  @fareshusseini", "https://www.tiktok.com/@fareshusseini"),
        ("Instagram  →  @fareshusseini",
         "https://www.instagram.com/fareshusseini"),
        ("X  →  @fareshusseini", "https://x.com/fareshusseini"),
    ]:
        c.drawString(MARGIN, y, label)
        c.linkURL(url, (MARGIN, y - 3, PAGE_W - MARGIN, y + 12),
                  relative=0, thickness=0)
        y -= 24
    footer(c, page_num)
    c.showPage()


def main():
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    pdfmetrics.registerFont(TTFont("Anton", ANTON))
    pdfmetrics.registerFont(TTFont("Sacramento", SCRIPT))
    c = canvas.Canvas(OUT, pagesize=(PAGE_W, PAGE_H))
    c.setTitle("The Reading List — Fa'res Husseini")
    c.setAuthor("Fa'res Husseini")
    c.setSubject("15 books that shaped how I build — fareshusseini.com")

    title_page(c)
    welcome_page(c)
    divider_page(c, "THE LIST", 2)

    flow = Flow(c, 3)
    for i, book in enumerate(BOOKS):
        flow.entry(i + 1, book, cover_left=(i % 2 == 0))
    footer(c, flow.page)
    c.showPage()

    closing_page(c, flow.page + 1)
    c.save()
    print(f"Wrote {OUT} ({len(BOOKS)} books)")


if __name__ == "__main__":
    main()
