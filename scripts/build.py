#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""مولّد صفحات الكتب لموقع مكتبة النخبة.

يقرأ بيانات الكتب من scripts/books.json ومحتوى كل ملخص من content/<slug>.html
ثم يولّد صفحات books/<slug>.html من القالب scripts/template.html،
ويحدّث sitemap.xml تلقائياً.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASE_URL = "https://www.maktabatalnokhba.com"

STATIC_PAGES = [
    "index.html", "about.html", "contact.html",
    "privacy-policy.html", "terms.html", "disclaimer.html",
]


def build_toc(article_html: str) -> str:
    items = re.findall(r'<h2 id="([^"]+)">([^<]+)</h2>', article_html)
    return "\n".join(
        f'        <li><a href="#{i}">{t}</a></li>' for i, t in items
    )


def build_related(slugs, by_slug) -> str:
    rows = []
    for s in slugs:
        b = by_slug[s]
        rows.append(
            f'      <a class="mini-book" href="{s}.html">'
            f'<span class="mini-cover {b["grad"]}">{b["cover_title"]}</span>'
            f'<span><b>{b["title_ar"]}</b><span>{b["author_ar"]}</span></span></a>'
        )
    return "\n".join(rows)


def main() -> None:
    template = (ROOT / "scripts" / "template.html").read_text(encoding="utf-8")
    books = json.loads((ROOT / "scripts" / "books.json").read_text(encoding="utf-8"))
    by_slug = {b["slug"]: b for b in books}
    out_dir = ROOT / "books"
    out_dir.mkdir(exist_ok=True)

    n = len(books)
    for i, b in enumerate(books):
        frag_path = ROOT / "content" / f"{b['slug']}.html"
        if not frag_path.exists():
            print(f"  ⚠ تخطي {b['slug']} — لا يوجد ملف محتوى بعد")
            continue
        article = frag_path.read_text(encoding="utf-8").rstrip()
        prev_b, next_b = books[(i - 1) % n], books[(i + 1) % n]
        page = template
        repl = {
            "SLUG": b["slug"],
            "TITLE_AR": b["title_ar"],
            "COVER_TITLE": b["cover_title"],
            "TITLE_EN": b["title_en"],
            "AUTHOR_AR": b["author_ar"],
            "AUTHOR_EN": b["author_en"],
            "YEAR": str(b["year"]),
            "PAGES": str(b["pages"]),
            "CAT": b["cat"],
            "READTIME": str(b["readtime"]),
            "RATING": str(b["rating"]),
            "GRAD": b["grad"],
            "KICKER": b["kicker"],
            "INTRO": b["intro"],
            "META_DESC": b["meta_desc"],
            "ARTICLE": article,
            "TOC": build_toc(article),
            "RELATED": build_related(b["related"], by_slug),
            "PREV_SLUG": prev_b["slug"],
            "PREV_TITLE": prev_b["title_ar"],
            "NEXT_SLUG": next_b["slug"],
            "NEXT_TITLE": next_b["title_ar"],
        }
        for k, v in repl.items():
            page = page.replace(f"%%{k}%%", v)
        leftover = re.findall(r"%%[A-Z_]+%%", page)
        if leftover:
            raise SystemExit(f"placeholders غير مستبدلة في {b['slug']}: {leftover}")
        (out_dir / f"{b['slug']}.html").write_text(page, encoding="utf-8")
        print(f"  ✓ books/{b['slug']}.html")

    urls = [f"{BASE_URL}/" if p == "index.html" else f"{BASE_URL}/{p}" for p in STATIC_PAGES]
    urls += [f"{BASE_URL}/books/{b['slug']}.html" for b in books]
    sitemap = ['<?xml version="1.0" encoding="UTF-8"?>',
               '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u in urls:
        sitemap.append(f"  <url><loc>{u}</loc><changefreq>monthly</changefreq></url>")
    sitemap.append("</urlset>")
    (ROOT / "sitemap.xml").write_text("\n".join(sitemap) + "\n", encoding="utf-8")
    print("  ✓ sitemap.xml")


if __name__ == "__main__":
    main()
