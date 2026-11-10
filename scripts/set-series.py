#!/usr/bin/env python3
"""
記事の frontmatter に series と seriesNumber を入れる（すでにあれば上書き）。

  python3 scripts/set-series.py phase5              # 下見
  python3 scripts/set-series.py phase5 --write      # 書き換え

シリーズごとの slug の並び順は下の SERIES に書く。
date: の行のすぐ下に入れるので、ほかの行には触らない。
"""
import argparse
import re
import sys
from pathlib import Path

POSTS_DIR = Path("content/posts")

SERIES = {
    "phase5": [
        "kenbuchi-ehon-yakata",
        "shiwa-library",
        "chihitsudo-bunko",
        "yamatsuri-mottainai-library",
        "naritasan-buddhist-library",
        "bungakukan-komaba",
        "oya-bunko",
        "yonezawa-manga-library",
        "tokyo-children-library",
        "nittento-library",
        "tabi-no-toshokan",
        "syokubunka-library",
        "baseball-hall-library",
        "shiojiri-enpark",
        "iga-central-library",
        "kyoto-manga-museum",
        "tenri-central-library",
        "machi-library-morinomiya",
        "kodomo-honnomori-nakanoshima",
        "setouchi-momiwa",
        "ama-central-library",
        "kitakyushu-manga-museum",
        "imari-city-library",
        "miyakonojo-city-library",
    ],
    # "phase4": [...],  公開順の slug を入れれば同じように使える
    # "phase6": [...],
}


def set_series(text: str, key: str, number: int) -> str:
    end = text.find("\n---", 3)
    fm, rest = text[:end], text[end:]
    fm = re.sub(r"^series:.*\n", "", fm + "\n", flags=re.M).rstrip("\n")
    fm = re.sub(r"^seriesNumber:.*\n?", "", fm + "\n", flags=re.M).rstrip("\n")
    m = re.search(r"^date:.*$", fm, flags=re.M)
    if not m:
        raise ValueError("date: の行がありません")
    insert = f'\nseries: "{key}"\nseriesNumber: {number}'
    fm = fm[: m.end()] + insert + fm[m.end() :]
    return fm + rest


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("series", choices=SERIES.keys())
    ap.add_argument("--write", action="store_true")
    ap.add_argument("--dir", default=str(POSTS_DIR))
    args = ap.parse_args()

    for i, slug in enumerate(SERIES[args.series], 1):
        f = Path(args.dir) / f"{slug}.mdx"
        if not f.exists():
            print(f"!! 見つかりません: {f}")
            continue
        new = set_series(f.read_text(encoding="utf-8"), args.series, i)
        print(f"#{i:>2} {slug}")
        if args.write:
            f.write_text(new, encoding="utf-8")
    if not args.write:
        print("（下見のみ。--write で書き換え）")


if __name__ == "__main__":
    sys.exit(main())
