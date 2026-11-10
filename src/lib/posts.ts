import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const postsDirectory = path.join(process.cwd(), "content/posts");

export type LibraryInfo = {
  address?: string;
  hours?: string;
  closedDays?: string;
  collection?: string;
  lightNovels?: boolean;
  manga?: boolean;
  wifi?: boolean;
  power?: boolean;
  parking?: boolean;
  studyRoom?: boolean;
  officialUrl?: string;
};

/** Phase 6 の本屋・本の宿・本の街など、図書館以外の「本のある場所」の基本情報 */
export type BookSpotInfo = {
  /** 種類（例: "本屋" "古書店街" "本の宿" "本と出会う場所（入場料制）" "古本まつり"） */
  kind?: string;
  address?: string;
  hours?: string;
  closedDays?: string;
  /** 入場料・宿泊料の目安など */
  price?: string;
  stay?: boolean;
  cafe?: boolean;
  wifi?: boolean;
  power?: boolean;
  parking?: boolean;
  officialUrl?: string;
};

/** frontmatter の `related:` の1件 */
export type RelatedRef = {
  slug: string;
  /** なぜこの記事とつながるのか（一言） */
  reason?: string;
};

/** 表示用に解決済みの関連記事 */
export type RelatedPost = PostMeta & {
  reason?: string;
  /** "related" = この記事が紹介している / "backlink" = 相手の記事がこの記事を紹介している */
  direction: "related" | "backlink";
};

// frontmatter の日付を "YYYY-MM-DD" 文字列に正規化する
// （YAML でクォートし忘れると gray-matter が Date オブジェクトを返すため）
function toDateString(value: unknown): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value);
}

// 蔵書数を表示用の文字列にする
// 数値なら3桁区切り、"記載なし" や真偽値など表示できない値は undefined
function normalizeCollection(value: unknown): string | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return `${value.toLocaleString("ja-JP")}冊`;
  }
  if (typeof value === "string" && value !== "" && value !== "記載なし") {
    return value;
  }
  return undefined;
}

// `library:` キー（短縮形）を LibraryInfo に変換する
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeLibraryInfo(data: any): LibraryInfo | undefined {
  if (data.libraryInfo) return data.libraryInfo as LibraryInfo;
  if (!data.library) return undefined;
  const lib = data.library;
  return {
    address:    lib.address,
    hours:      lib.hours,
    closedDays: lib.closed,
    collection: normalizeCollection(lib.books),
    lightNovels: lib.lightnovel,
    manga:      lib.manga,
    wifi:       lib.wifi,
    power:      lib.power,
    parking:    lib.parking,
    studyRoom:  lib.studyroom,
    officialUrl: lib.official_url,
  };
}

// `bookspot:` キーを BookSpotInfo に変換する
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeBookSpot(data: any): BookSpotInfo | undefined {
  const s = data.bookspot;
  if (!s) return undefined;
  return {
    kind:        s.kind,
    address:     s.address,
    hours:       s.hours,
    closedDays:  s.closed,
    price:       s.price,
    stay:        s.stay,
    cafe:        s.cafe,
    wifi:        s.wifi,
    power:       s.power,
    parking:     s.parking,
    officialUrl: s.official_url,
  };
}

// `related:` を RelatedRef[] に正規化する
// 文字列だけの書き方（- yonezawa-manga-library）も受け付ける
function normalizeRelated(value: unknown): RelatedRef[] {
  if (!Array.isArray(value)) return [];
  const refs: RelatedRef[] = [];
  for (const item of value) {
    if (typeof item === "string" && item !== "") {
      refs.push({ slug: item });
    } else if (item && typeof item === "object" && "slug" in item) {
      const obj = item as { slug?: unknown; reason?: unknown };
      if (typeof obj.slug === "string" && obj.slug !== "") {
        refs.push({
          slug: obj.slug,
          reason: typeof obj.reason === "string" ? obj.reason : undefined,
        });
      }
    }
  }
  return refs;
}

// 本文中の記事リンク [名前](/posts/slug) から slug を順番どおり取り出す
function extractBodyLinks(content: string): string[] {
  const slugs: string[] = [];
  const re = /\]\(\/posts\/([a-z0-9-]+)\/?(?:#[^)]*)?\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    if (!slugs.includes(m[1])) slugs.push(m[1]);
  }
  return slugs;
}

// frontmatter の related に、本文中でリンクした記事を（重複なしで）後ろに足す
function mergeRelated(explicit: RelatedRef[], bodyLinks: string[], self: string): RelatedRef[] {
  const merged = explicit.filter((r) => r.slug !== self);
  for (const slug of bodyLinks) {
    if (slug === self || merged.some((r) => r.slug === slug)) continue;
    merged.push({ slug });
  }
  return merged;
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return undefined;
}

export type SpotType = "sightseeing" | "food" | "hotel" | "shopping" | "access";

export type NearbySpot = {
  name: string;
  description: string;
  distance?: string;
  category?: string;
  url?: string;
  spotType?: SpotType;
};

export type AffiliateItem = {
  title: string;
  description?: string;
  url: string;
  author?: string;
  label?: string;
  trackingPixel?: string;
};

export type AffiliateLinks = {
  book?: AffiliateItem;
  travel?: AffiliateItem;
  goods?: AffiliateItem;
};

// `hotel:` キーを travel スロットにマップする
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeAffiliate(data: any): AffiliateLinks | undefined {
  const aff = data.affiliate;
  if (!aff) return undefined;
  return {
    book:   aff.book,
    travel: aff.travel ?? aff.hotel,
    goods:  aff.goods,
  };
}

export type PostMeta = {
  slug: string;
  title: string;
  /** 初出日。加筆改稿しても変更しない */
  date: string;
  /** 加筆改稿した日。未設定なら未改稿 */
  updated?: string;
  excerpt: string;
  location: string;
  coverImage?: string;
  imageAlt?: string;
  readingTime: string;
  tags?: string[];
  /** シリーズのキー（例: "phase5"）。src/lib/series.ts で表示名に変換 */
  series?: string;
  /** シリーズ内の番号（例: 16） */
  seriesNumber?: number;
  /** この記事が紹介している関連記事（frontmatter の related ＋ 本文中のリンク） */
  related: RelatedRef[];
};

export type Post = PostMeta & {
  content: string;
  libraryInfo?: LibraryInfo;
  bookSpot?: BookSpotInfo;
  nearbySpots?: NearbySpot[];
  affiliate?: AffiliateLinks;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPostMeta(slug: string, data: any, content: string): PostMeta {
  const rt = readingTime(content);
  return {
    slug,
    title: data.title ?? "",
    date: toDateString(data.date) ?? "",
    updated: toDateString(data.updated),
    excerpt: data.excerpt ?? "",
    location: data.location ?? "",
    coverImage: data.image ?? data.coverImage,
    imageAlt: data.imageAlt,
    readingTime: `約${Math.ceil(rt.minutes)}分`,
    tags: data.tags ?? [],
    series: typeof data.series === "string" ? data.series : undefined,
    seriesNumber: toNumber(data.seriesNumber),
    related: mergeRelated(normalizeRelated(data.related), extractBodyLinks(content), slug),
  };
}

// ビルド中は同じファイルを何度も読むので、一覧の結果をキャッシュする
// （npm run dev では記事の編集をすぐ反映したいのでキャッシュしない）
let allPostsCache: PostMeta[] | null = null;
const useCache = process.env.NODE_ENV === "production";

export function getAllPosts(): PostMeta[] {
  if (useCache && allPostsCache) return allPostsCache;
  if (!fs.existsSync(postsDirectory)) return [];

  const fileNames = fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const posts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.(mdx|md)$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    return toPostMeta(slug, data, content);
  });

  // 並び順は「最終更新日」の新しい順。updated がなければ初出日を使う
  const sortKey = (post: PostMeta) => post.updated ?? post.date;
  allPostsCache = posts.sort((a, b) => (sortKey(a) < sortKey(b) ? 1 : -1));
  return allPostsCache;
}

export function getPostBySlug(slug: string): Post | null {
  const mdxPath = path.join(postsDirectory, `${slug}.mdx`);
  const mdPath = path.join(postsDirectory, `${slug}.md`);
  const fullPath = fs.existsSync(mdxPath) ? mdxPath : mdPath;

  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    ...toPostMeta(slug, data, content),
    content,
    libraryInfo: normalizeLibraryInfo(data),
    bookSpot: normalizeBookSpot(data),
    nearbySpots: data.nearbySpots,
    affiliate: normalizeAffiliate(data),
  };
}

/**
 * 関連記事を返す。
 * 1. この記事の `related:` に書いた記事（順番どおり）
 * 2. この記事の本文中でリンクしている記事（自動）
 * 3. ほかの記事の related・本文リンクでこの記事が紹介されている記事（逆リンク、自動）
 * 最大 limit 件。
 * 存在しない slug は黙って捨てる（ビルドは止めない）
 */
export function getRelatedPosts(post: PostMeta, limit = 10): RelatedPost[] {
  const all = getAllPosts();
  const bySlug = new Map(all.map((p) => [p.slug, p]));
  const result: RelatedPost[] = [];
  const seen = new Set<string>([post.slug]);

  for (const ref of post.related) {
    const target = bySlug.get(ref.slug);
    if (!target || seen.has(target.slug)) continue;
    seen.add(target.slug);
    result.push({ ...target, reason: ref.reason, direction: "related" });
  }

  for (const other of all) {
    if (seen.has(other.slug)) continue;
    const ref = other.related.find((r) => r.slug === post.slug);
    if (!ref) continue;
    seen.add(other.slug);
    result.push({ ...other, reason: ref.reason, direction: "backlink" });
  }

  return result.slice(0, limit);
}

/** 同じシリーズの前後の記事を返す（seriesNumber 順） */
export function getSeriesNeighbors(post: PostMeta): {
  prev: PostMeta | null;
  next: PostMeta | null;
  total: number;
} {
  if (!post.series || post.seriesNumber === undefined) {
    return { prev: null, next: null, total: 0 };
  }
  const members = getAllPosts()
    .filter((p) => p.series === post.series && p.seriesNumber !== undefined)
    .sort((a, b) => (a.seriesNumber ?? 0) - (b.seriesNumber ?? 0));
  const index = members.findIndex((p) => p.slug === post.slug);
  return {
    prev: index > 0 ? members[index - 1] : null,
    next: index >= 0 && index < members.length - 1 ? members[index + 1] : null,
    total: members.length,
  };
}
