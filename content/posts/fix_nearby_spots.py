#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
15記事のnearbySpots URLを『検索クエリ形式』から『place_id直リンク』へ一括置換する。

使い方:
    cd ~/Desktop/hondana-machi
    python3 fix_nearby_spots.py

・各ファイルについて、旧URL文字列がちょうど1回だけ出現することを確認してから置換する。
・見つからなかった／複数回見つかったものはエラーとして報告するだけで、該当ファイルはスキップする（安全のため）。
・実際に書き換える前に --dry-run で確認できる。
"""

import sys
from pathlib import Path

POSTS_DIR = Path("content/posts")

def maps_url(place_id: str) -> str:
    return f"https://www.google.com/maps/place/?q=place_id:{place_id}"

# (ファイル名, [(旧URL, place_id, スポット名 for logging), ...])
FIXES = {
    "kasugai-library.mdx": [
        ("https://maps.google.com/?q=高蔵寺ニュータウン+春日井市", "ChIJe-x92Q9sA2ARTrITiFSCZos", "高蔵寺ニュータウン"),
        ("https://maps.google.com/?q=春日井市都市緑化植物園", "ChIJ9Vl_HohrA2ARPDBLtqEiSO4", "春日井市都市緑化植物園"),
        ("https://maps.google.com/?q=落合公園+春日井市", "ChIJD3yNdI5tA2ARmJWJSxWGAuc", "落合公園"),
    ],
    "inuyama-library.mdx": [
        ("https://maps.google.com/?q=犬山城+愛知県犬山市", "ChIJke1IrfUOA2ARNfYDRkP6Wig", "国宝犬山城"),
        ("https://maps.google.com/?q=犬山城下町+本町通り", "ChIJAQCc1osOA2ARlq5mePVtBLo", "犬山城下町（本町通り）"),
        ("https://maps.google.com/?q=本町茶寮+犬山", "ChIJq3V6UYoOA2ARTLlc0Ez9JvU", "本町茶寮"),
        ("https://maps.google.com/?q=有楽苑+犬山", "ChIJ31NajV8OA2ARFBBPxZQ8Z3Y", "有楽苑（国宝茶室 如庵）"),
    ],
    "yokosuka-library.mdx": [
        ("https://www.google.com/maps/search/?api=1&query=平洲記念館+東海市", "ChIJIc6J8st9A2ARtje84emq0d0", "平洲記念館"),
        ("https://www.google.com/maps/search/?api=1&query=加家公園+東海市", "ChIJHVC9boF-A2ARmWujKHU_nhw", "加家公園"),
        ("https://www.google.com/maps/search/?api=1&query=玉林寺+東海市横須賀", "ChIJL7_8TF1-A2AR8tA1O1PCSsk", "玉林寺"),
    ],
    "handa-library.mdx": [
        ("https://maps.google.com/?q=半田市立博物館", "ChIJlUQn9zKEBGAR5iXKMJCb1GI", "半田市立博物館"),
        ("https://maps.google.com/?q=みんなの森cafe+半田市", "ChIJS_-WVqKFBGARGsxowh3tUi4", "みんなの森cafe"),
        ("https://maps.google.com/?q=半田運河+愛知県半田市", "ChIJAQ6NGwCFBGARq1kidG_Dh9c", "半田運河・蔵の街"),
        ("https://maps.google.com/?q=半田赤レンガ建物", "ChIJobOz6U6EBGARiIHF3mGm8EA", "半田赤レンガ建物"),
        ("https://maps.google.com/?q=ミツカンミュージアム+半田市", "ChIJ6WKwYq6FBGAReI08ODMpsLM", "MIZKAN MUSEUM"),
    ],
    "chita-library.mdx": [
        ("https://www.google.com/maps/search/?api=1&query=岡田の古い街並み+知多市", "ChIJgxSui06BBGARg46xIlZSTrU", "岡田の古い街並み"),
        ("https://www.google.com/maps/search/?api=1&query=木綿蔵ちた+知多市", "ChIJhR8hR8yBBGARrsFGcJeZFPc", "手織の里 木綿蔵ちた"),
        ("https://www.google.com/maps/search/?api=1&query=佐布里池+知多市", "ChIJnexqX5OBBGARKqBfooxE67w", "佐布里池梅林"),
    ],
    "iwakura-library.mdx": [
        # 注意: このスポットはピンポイントのplace_idが取得できず、岩倉市全体のlocality IDになっています。
        ("https://www.google.com/maps/search/?api=1&query=五条川+岩倉市", "ChIJUYVNDyALA2ARGZ16CsrJTkc", "岩倉市民広場・五条川（要目視確認）"),
        ("https://www.google.com/maps/search/?api=1&query=岩倉市生涯学習センター", "ChIJl850yiQLA2ARzSJne_zklRc", "岩倉市生涯学習センター"),
        ("https://www.google.com/maps/search/?api=1&query=アピタ岩倉店", "ChIJAQAAWyULA2AR3viurWt3VbM", "アピタ岩倉店"),
    ],
    "minato-library.mdx": [
        ("https://www.google.com/maps/search/?api=1&query=ららぽーと名古屋みなとアクルス", "ChIJfXvoVD55A2AR1Ewv9iSCRAY", "ららぽーと名古屋みなとアクルス"),
        ("https://www.google.com/maps/search/?api=1&query=邦和みなとスポーツ&カルチャー+名古屋", "ChIJLbByNr55A2AREhl0zL--qRM", "邦和みなと スポーツ＆カルチャー"),
        ("https://www.google.com/maps/search/?api=1&query=名古屋港水族館", "ChIJsyTJ06B5A2ARvt6FJ9xiqaE", "名古屋港水族館"),
    ],
    "ebina-library.mdx": [
        ("https://www.google.com/maps/search/?api=1&query=鎌倉", "ChIJGVasgJtFGGARAiWfOXp0AFc", "鎌倉"),
        ("https://www.google.com/maps/search/?api=1&query=江の島", "ChIJpQqJoOZOGGAR7FpKUYhZ_gQ", "江の島"),
        ("https://www.google.com/maps/search/?api=1&query=ビナウォーク+海老名", "ChIJZ2eboW9VGGARfUbaVGH_EaE", "ビナウォーク"),
        ("https://www.google.com/maps/search/?api=1&query=海老名サービスエリア", "ChIJMcLlmQFVGGAR5UARUf-qVK0", "海老名SA"),
    ],
    "ichinomiya-library.mdx": [
        ("https://www.google.com/maps/search/?api=1&query=成城石井+アスティ一宮店", "ChIJ_9BXoM2gA2AR0mP9nrvO99M", "成城石井 名鉄一宮駅店"),
        ("https://www.google.com/maps/search/?api=1&query=尾張一宮駅", "ChIJ9V_9l82gA2AR6c5-288CZcI", "尾張一宮駅"),
    ],
    "toyohashi-library.mdx": [
        ("https://www.google.com/maps/search/?api=1&query=のぐろ亭+豊橋", "ChIJAzZdCJHTBGAR7aKHGSaN5EI", "Kitchen のぐろ亭"),
        ("https://www.google.com/maps/search/?api=1&query=のんほいパーク+豊橋", "ChIJ0-Jtb17TBGARu0FQBGYkBh4", "のんほいパーク"),
        ("https://www.google.com/maps/search/?api=1&query=豊橋まちなか図書館", "ChIJExDeWgbTBGARGrmRffnPRFA", "豊橋まちなか図書館"),
        ("https://www.google.com/maps/search/?api=1&query=伊良湖岬", "ChIJlVE-9wblBGARqr9M8wheltU", "伊良湖岬"),
    ],
    "kariya-library.mdx": [
        ("https://maps.google.com/?q=刈谷市美術館", "ChIJbWB4ieycBGARCXd3MUkWGzw", "刈谷市美術館"),
        ("https://maps.google.com/?q=亀城公園+刈谷市", "ChIJxcWRXNScBGAR8v9sY6lsGxA", "亀城公園"),
        ("https://maps.google.com/?q=刈谷ハイウェイオアシス", "ChIJJeTYz-edBGARmA1bIJYmaBA", "刈谷ハイウェイオアシス"),
        ("https://maps.google.com/?q=フローラルガーデンよさみ+刈谷市", "ChIJNfUeq4GcBGAR13ZOpKfti18", "フローラルガーデンよさみ"),
    ],
    "oguchi-library.mdx": [
        ("https://www.google.com/maps/search/?api=1&query=大口町総合福祉会館", "ChIJ2W2uDHAMA2ARuoCjmfQf2-Q", "憩いの湯（大口町総合福祉会館）"),
        ("https://www.google.com/maps/search/?api=1&query=大口町健康文化センター", "ChIJefQIiHAMA2ARdwbkQm-IwRw", "喫茶さくら屋（大口町健康文化センター）"),
        ("https://www.google.com/maps/search/?api=1&query=五条川+大口町+桜並木", "ChIJmdgFS3EMA2ARqyl20gdSsCU", "五条川沿い桜並木"),
        ("https://www.google.com/maps/search/?api=1&query=大口町歴史民俗資料館", "ChIJIV4JiHAMA2ARwePb-gAZkAg", "大口町歴史民俗資料館"),
    ],
    "bangkok-library.mdx": [
        ("https://www.google.com/maps/search/?api=1&query=カオサン通り+バンコク", "ChIJDR23yhKZ4jARdqd5AHsct0A", "カオサン通り"),
        ("https://www.google.com/maps/search/?api=1&query=ワット・アルン+バンコク", "ChIJaSv_6gaZ4jARnbiUVn6Z_YY", "ワット・アルン（暁の寺）"),
        ("https://www.google.com/maps/search/?api=1&query=ワットパークナム+バンコク", "ChIJvwXXwEWY4jARC2dj117syBA", "ワット・パークナム"),
        ("https://www.google.com/maps/search/?api=1&query=民主記念塔+バンコク", "ChIJcSDAnBSZ4jARttNZeRA3Wec", "民主記念塔"),
    ],
    "tokoname-library.mdx": [
        ("https://www.google.com/maps/search/?api=1&query=常滑やきもの散歩道", "ChIJ_fTz9UuHBGAR9x7ADIKLBrU", "常滑やきもの散歩道"),
        ("https://www.google.com/maps/search/?api=1&query=INAXライブミュージアム+常滑", "ChIJwf7qjj6HBGAR3RUTZZqVLk8", "INAXライブミュージアム"),
        ("https://www.google.com/maps/search/?api=1&query=中部国際空港+常滑", "ChIJzynM7ZN9BGARJQAsbih9mEI", "中部国際空港（セントレア）"),
    ],
    "yokkaichi-library.mdx": [
        ("https://maps.google.com/?q=四日市港ポートビル+うみてらす14", "ChIJsyD-u52PA2ARsotPd3KNQWQ", "四日市港ポートビル「うみてらす14」"),
        ("https://maps.google.com/?q=四日市港+夜景クルーズ", "ChIJbZCDUJaPA2AR5Yef9Jn0sVY", "四日市コンビナート夜景クルーズ"),
        ("https://maps.google.com/?q=諏訪公園+四日市市", "ChIJ9ebJc_COA2ARtzAenDs18YM", "諏訪公園"),
        ("https://maps.google.com/?q=博多ラーメンなみへい+四日市", "ChIJHYSLycGNA2ARCnIG-5YK2C4", "博多ラーメン なみへい"),
        ("https://maps.google.com/?q=東京おぎくぼラーメンゑびすや+四日市", "ChIJ3ejXI_COA2ARvvC_KdCp2rQ", "東京おぎくぼラーメン ゑびすや"),
        ("https://maps.google.com/?q=四日市市公害と環境未来館", "ChIJ773omfOOA2ARHMVM8X3mB50", "四日市市公害と環境未来館"),
    ],
    # 前回セッションで確認済み・未修正だった岐阜メディアコスモスも一緒に直す
    "gifu-mediacosmos.mdx": [
        ("https://www.city.gifu.lg.jp/kanko/1004013/1004022/1004023.html", "ChIJqw4uj3mpA2ARSslCVWXDcSg", "岐阜城・金華山"),
        ("https://www.ukai-gifu.com/", "ChIJr7gmWwCrA2AR2thX5d34cms", "長良川鵜飼"),
        ("https://www.city.gifu.lg.jp/kanko/1004013/1004017/1004018.html", "ChIJf7es72OpA2ARFvgza1z0nME", "岐阜市歴史博物館"),
    ],
}


def main():
    dry_run = "--dry-run" in sys.argv
    if not POSTS_DIR.exists():
        print(f"エラー: {POSTS_DIR} が見つかりません。リポジトリのルートで実行してください。")
        sys.exit(1)

    total_ok, total_fail = 0, 0
    for filename, fixes in FIXES.items():
        path = POSTS_DIR / filename
        if not path.exists():
            print(f"[SKIP] {filename} が見つかりません")
            continue

        text = path.read_text(encoding="utf-8")
        changed = False
        for old_url, place_id, label in fixes:
            new_url = maps_url(place_id)
            count = text.count(old_url)
            if count == 0:
                print(f"[NOT FOUND] {filename}: 「{label}」の旧URLが見つかりません（手動確認してください）")
                total_fail += 1
                continue
            if count > 1:
                print(f"[WARNING] {filename}: 「{label}」の旧URLが{count}回出現。全て置換します")
            text = text.replace(old_url, new_url)
            changed = True
            total_ok += 1

        if changed:
            if dry_run:
                print(f"[DRY-RUN] {filename} を更新予定")
            else:
                path.write_text(text, encoding="utf-8")
                print(f"[DONE] {filename} を更新しました")

    print(f"\n合計: 成功 {total_ok} 件 / 失敗 {total_fail} 件")
    if dry_run:
        print("（--dry-run のため実際のファイルは変更していません）")


if __name__ == "__main__":
    main()
