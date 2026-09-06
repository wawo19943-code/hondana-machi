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
};

export type Post = PostMeta & {
  content: string;
  libraryInfo?: LibraryInfo;
  nearbySpots?: NearbySpot[];
  affiliate?: AffiliateLinks;
};

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const fileNames = fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const posts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.(mdx|md)$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
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
    } satisfies PostMeta;
  });

  // 並び順は「最終更新日」の新しい順。updated がなければ初出日を使う
  const sortKey = (post: PostMeta) => post.updated ?? post.date;
  return posts.sort((a, b) => (sortKey(a) < sortKey(b) ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | null {
  const mdxPath = path.join(postsDirectory, `${slug}.mdx`);
  const mdPath = path.join(postsDirectory, `${slug}.md`);
  const fullPath = fs.existsSync(mdxPath) ? mdxPath : mdPath;

  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
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
    content,
    libraryInfo: normalizeLibraryInfo(data),
    nearbySpots: data.nearbySpots,
    affiliate: normalizeAffiliate(data),
  };
}
