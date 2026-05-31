#!/usr/bin/env python3
"""
Generates Beehiiv publication assets in the fareshusseini.com brand
(lime #DBFF00 + black, Anton display face — same style as the site favicon).

Outputs to assets/brand/beehiiv/:
  logo-*.png    800x800 publication logo variants (favicon style)
  thumb-*.png   1200x630 default thumbnail / social preview variants

Run: python3 scripts/build_beehiiv_assets.py
"""

import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ANTON = os.path.join(ROOT, "assets", "fonts", "Anton-Regular.ttf")
OUT = os.path.join(ROOT, "assets", "brand", "beehiiv")

LIME = (219, 255, 0)
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
DIM = (165, 165, 165)


def font(px):
    return ImageFont.truetype(ANTON, px)


def draw_centered(d, cx, cy, text, fnt, fill):
    """Center text on its actual glyph ink box (not font line metrics)."""
    x0, y0, x1, y1 = d.textbbox((0, 0), text, font=fnt)
    w, h = x1 - x0, y1 - y0
    d.text((cx - w / 2 - x0, cy - h / 2 - y0), text, font=fnt, fill=fill)


# ---------- 800x800 logos ----------

def logo(name, bg, fg, rounded=False, ring=False):
    s = 800
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    radius = 150
    if rounded:
        d.rounded_rectangle([0, 0, s - 1, s - 1], radius=radius, fill=bg)
    else:
        d.rectangle([0, 0, s, s], fill=bg)
    if ring:
        inset = 46
        d.rounded_rectangle(
            [inset, inset, s - 1 - inset, s - 1 - inset],
            radius=radius - 60 if rounded else 90,
            outline=fg, width=14,
        )
    draw_centered(d, s / 2, s / 2, "FH", font(430), fg)
    img.save(os.path.join(OUT, name))


# ---------- 1200x630 thumbnails ----------

def chip(d, x, y, box, bg, fg):
    d.rounded_rectangle([x, y, x + box, y + box], radius=26, fill=bg)
    draw_centered(d, x + box / 2, y + box / 2, "FH", font(int(box * 0.5)), fg)


def thumb_dark(name):
    w, h = 1200, 630
    img = Image.new("RGB", (w, h), BLACK)
    d = ImageDraw.Draw(img)
    pad = 80
    chip(d, pad, pad, 116, LIME, BLACK)
    big = font(126)
    d.text((pad, 330), "THE WEEKLY", font=big, fill=WHITE, anchor="lm")
    d.text((pad, 330 + 126), "NOTE", font=big, fill=LIME, anchor="lm")
    d.text((pad, h - 66), "FA'RES HUSSEINI   ·   FARESHUSSEINI.COM",
           font=font(34), fill=DIM, anchor="lm")
    img.save(os.path.join(OUT, name))


def thumb_lime(name):
    w, h = 1200, 630
    img = Image.new("RGB", (w, h), LIME)
    d = ImageDraw.Draw(img)
    pad = 80
    chip(d, pad, pad, 116, BLACK, LIME)
    big = font(126)
    d.text((pad, 330), "THE WEEKLY", font=big, fill=BLACK, anchor="lm")
    d.text((pad, 330 + 126), "NOTE", font=big, fill=BLACK, anchor="lm")
    d.text((pad, h - 66), "FA'RES HUSSEINI   ·   FARESHUSSEINI.COM",
           font=font(34), fill=(40, 47, 0), anchor="lm")
    img.save(os.path.join(OUT, name))


def main():
    os.makedirs(OUT, exist_ok=True)
    logo("logo-1-lime-square.png", LIME, BLACK)
    logo("logo-2-black-square.png", BLACK, LIME)
    logo("logo-3-lime-rounded.png", LIME, BLACK, rounded=True)
    logo("logo-4-black-rounded.png", BLACK, LIME, rounded=True)
    logo("logo-5-black-ring.png", BLACK, LIME, rounded=True, ring=True)
    thumb_dark("thumb-1-dark.png")
    thumb_lime("thumb-2-lime.png")
    print("Wrote assets to", OUT)
    for f in sorted(os.listdir(OUT)):
        print("  ", f)


if __name__ == "__main__":
    main()
