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
    collection: lib.books !== "記載なし" ? lib.books : undefined,
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
  date: string;
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
      date: data.date ?? "",
      excerpt: data.excerpt ?? "",
      location: data.location ?? "",
      coverImage: data.image ?? data.coverImage,
      imageAlt: data.imageAlt,
      readingTime: `約${Math.ceil(rt.minutes)}分`,
      tags: data.tags ?? [],
    } satisfies PostMeta;
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
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
    date: data.date ?? "",
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
