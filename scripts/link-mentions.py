#!/usr/bin/env python3
"""
本文中で、ほかの記事の図書館名（スポット名）が出てきたら、記事へのリンクにする。

  python3 scripts/link-mentions.py            # 下見（何も書き換えない）
  python3 scripts/link-mentions.py --write    # 実際に書き換える
  python3 scripts/link-mentions.py --only shiojiri-enpark   # 1記事だけ

ルール
- リンク先の名前は、各記事の title の「——」より後ろ（例: 「…——伊万里市民図書館」→ 伊万里市民図書館）。
  「塩尻市立図書館（えんぱーく）」のような括弧つきは、括弧の外と中の両方を名前として使う。
  「A・B」は A と B も、「野球殿堂博物館 図書室」は「野球殿堂博物館」も名前として使う。
- frontmatter に linkNames: [別名, 別名] を書くと、その名前でもリンクする（例: 天理図書館）。
  linkNames: [] と空にすると、その記事へは自動リンクしない。
- 1記事の中で、同じリンク先へは最初の1回だけリンクする（すでにリンク済みなら何もしない）。
- 同じ名前を持つ記事が2つ以上あるときは、その名前では自動リンクしない（警告を出す）。
- frontmatter、見出し行（#）、表の行（|）、引用（>）、コードブロック、すでにリンクの中の文字は触らない。
- 長い名前から先に当てる（「天理大学附属天理図書館」が「天理図書館」より先）。
- 自分自身へはリンクしない。
- 名前の直前が漢字・カタカナ・英数字なら、長い別の名前の一部とみなしてリンクしない。
- --skip "名前" で、その名前では自動リンクしない。
"""
import argparse
import re
import sys
from pathlib import Path

import yaml

POSTS_DIR = Path("content/posts")
MIN_NAME_LEN = 4  # 「図書館」のような短すぎる名前は使わない


def split_frontmatter(text: str):
    if not text.startswith("---"):
        return None, text
    end = text.find("\n---", 3)
    if end == -1:
        return None, text
    end_line = text.find("\n", end + 4)
    if end_line == -1:
        end_line = len(text)
    return text[: end_line + 1], text[end_line + 1 :]


def names_for(meta: dict) -> list[str]:
    if "linkNames" in meta:
        return [n for n in (meta.get("linkNames") or []) if isinstance(n, str) and len(n) >= MIN_NAME_LEN]
    title = str(meta.get("title") or "")
    if "——" not in title:
        return []
    name = title.split("——")[-1].strip()
    names = {name}
    m = re.match(r"^(.+?)（(.+?)）$", name)
    if m:
        names.add(m.group(1).strip())
        names.add(m.group(2).strip())
    # 「米沢嘉博記念図書館・現代マンガ図書館」→ それぞれの名前も
    for n in list(names):
        if "・" in n:
            names.update(part.strip() for part in n.split("・"))
    # 「野球殿堂博物館 図書室」→「野球殿堂博物館」も
    for n in list(names):
        if " " in n:
            names.add(n.split(" ")[0])
    return [n for n in names if len(n) >= MIN_NAME_LEN]


LINK_RE = re.compile(r"\[[^\]]*\]\([^)]*\)")
# 名前の直前がこの文字なら、もっと長い別の名前の一部とみなしてリンクしない
# （「焼津市立図書館」の中の「津市立図書館」、「会津図書館」の中の「津図書館」など）
COMPOUND_RE = re.compile(r"[\u4e00-\u9fff\u3005\u30a0-\u30ffA-Za-z0-9]")


def find_name(work: str, name: str) -> int:
    start = 0
    while True:
        idx = work.find(name, start)
        if idx == -1:
            return -1
        if idx == 0 or not COMPOUND_RE.match(work[idx - 1]):
            return idx
        start = idx + 1


def link_body(body: str, targets: list[tuple[str, str]], self_slug: str):
    """targets: [(name, slug)] 長い順。戻り値: (新しい本文, [(name, slug)])"""
    # すでに本文でリンク済みの記事には、もう一度リンクしない（何回実行しても同じ結果になるように）
    done_slugs: set[str] = set(re.findall(r"\]\(/posts/([a-z0-9-]+)", body))
    changes = []
    out_lines = []
    in_code = False

    for line in body.split("\n"):
        stripped = line.lstrip()
        if stripped.startswith("```"):
            in_code = not in_code
            out_lines.append(line)
            continue
        if (
            in_code
            or stripped.startswith("#")
            or stripped.startswith("|")
            or stripped.startswith(">")
            or stripped.startswith("※")
            or stripped == "---"
        ):
            out_lines.append(line)
            continue

        # 既存リンクを退避
        saved = []

        def stash(m):
            saved.append(m.group(0))
            return f"\x00{len(saved) - 1}\x00"

        work = LINK_RE.sub(stash, line)

        for name, slug in targets:
            if slug == self_slug or slug in done_slugs:
                continue
            idx = find_name(work, name)
            if idx == -1:
                continue
            link = f"[{name}](/posts/{slug})"
            saved.append(link)
            work = work[:idx] + f"\x00{len(saved) - 1}\x00" + work[idx + len(name) :]
            done_slugs.add(slug)
            changes.append((name, slug))

        work = re.sub(r"\x00(\d+)\x00", lambda m: saved[int(m.group(1))], work)
        out_lines.append(work)

    return "\n".join(out_lines), changes


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--write", action="store_true", help="実際に書き換える")
    ap.add_argument("--only", help="この slug の記事だけ処理する")
    ap.add_argument("--dir", default=str(POSTS_DIR))
    ap.add_argument("--skip", action="append", default=[], help="この名前では自動リンクしない（何回でも指定可）")
    args = ap.parse_args()

    posts_dir = Path(args.dir)
    files = sorted(list(posts_dir.glob("*.mdx")) + list(posts_dir.glob("*.md")))
    if not files:
        sys.exit(f"記事が見つかりません: {posts_dir}")

    metas = {}
    for f in files:
        fm, _ = split_frontmatter(f.read_text(encoding="utf-8"))
        if fm is None:
            continue
        try:
            meta = yaml.safe_load(fm.strip().strip("-")) or {}
        except yaml.YAMLError as e:
            print(f"!! YAMLエラーのため飛ばします: {f.name}: {e}")
            continue
        metas[f.stem] = meta

    # 名前 → slug（同じ名前が複数の記事にあるときは使わない）
    owner: dict[str, set[str]] = {}
    for slug, meta in metas.items():
        for n in names_for(meta):
            owner.setdefault(n, set()).add(slug)
    targets = []
    for n, slugs in owner.items():
        if n in args.skip:
            continue
        if len(slugs) == 1:
            targets.append((n, next(iter(slugs))))
        else:
            print(f"!! 名前が重複しているので自動リンクしません: {n} → {sorted(slugs)}")
    targets.sort(key=lambda x: -len(x[0]))

    total = 0
    for f in files:
        if args.only and f.stem != args.only:
            continue
        text = f.read_text(encoding="utf-8")
        fm, body = split_frontmatter(text)
        if fm is None:
            continue
        new_body, changes = link_body(body, targets, f.stem)
        if not changes:
            continue
        total += len(changes)
        print(f"\n■ {f.name}")
        for name, slug in changes:
            print(f"   {name}  →  /posts/{slug}")
        if args.write:
            f.write_text(fm + new_body, encoding="utf-8")

    print(f"\n合計 {total} か所{'を書き換えました' if args.write else '（下見のみ。--write で書き換え）'}")


if __name__ == "__main__":
    main()
