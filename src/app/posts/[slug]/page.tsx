import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { getTagType } from "@/lib/tags";
import MdxContent from "@/components/MdxContent";
import LibraryInfoBox from "@/components/LibraryInfoBox";
import NearbySpots from "@/components/NearbySpots";
import AffiliateArea from "@/components/AffiliateArea";
import LibraryPlaceholder from "@/components/LibraryPlaceholder";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

function tagClassName(tag: string, variant: "header" | "footer"): string {
  const type = getTagType(tag);
  if (variant === "header") {
    if (type === "region") return "text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full hover:bg-amber-100 transition-colors";
    if (type === "feature") return "text-xs text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full hover:bg-teal-100 transition-colors";
    return "text-xs text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full hover:bg-stone-200 transition-colors";
  }
  // footer variant: outlined
  if (type === "region") return "text-xs text-amber-700 border border-amber-200 px-3 py-1 rounded-full hover:bg-amber-50 transition-colors";
  if (type === "feature") return "text-xs text-teal-700 border border-teal-200 px-3 py-1 rounded-full hover:bg-teal-50 transition-colors";
  return "text-xs text-stone-500 border border-stone-200 px-3 py-1 rounded-full hover:bg-stone-50 transition-colors";
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const newerPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const olderPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const formattedDate = new Date(post.date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-[720px] mx-auto px-4 py-10">
      {/* 戻るリンク */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-stone-400 hover:text-stone-600 transition-colors mb-8"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
        記事一覧へ
      </Link>

      {/* 1. タイトル・場所・日付 */}
      <header className="mb-8">
        <div className="flex items-center gap-2 text-xs text-stone-400 mb-4">
          <time dateTime={post.date}>{formattedDate}</time>
          <span>·</span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {post.location}
          </span>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-stone-800 leading-snug mb-4">
          {post.title}
        </h1>

        <p className="text-stone-500 text-base leading-[1.8]">{post.excerpt}</p>

        {/* ヘッダータグ（リンク付き） */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-2 mt-4 flex-wrap">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/?tag=${encodeURIComponent(tag)}`} className={tagClassName(tag, "header")}>
                {tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* 2. サムネイル画像エリア */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10 bg-stone-100">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.imageAlt ?? post.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <LibraryPlaceholder />
        )}
      </div>

      {/* 3. 本文 */}
      <MdxContent source={post.content} />

      {/* 4. 図書館基本情報ボックス */}
      {post.libraryInfo && <LibraryInfoBox info={post.libraryInfo} />}

      {/* 5. 周辺スポット */}
      {post.nearbySpots && post.nearbySpots.length > 0 && (
        <NearbySpots spots={post.nearbySpots} />
      )}

      {/* 6. アフィリエイトエリア */}
      {post.affiliate && <AffiliateArea links={post.affiliate} />}

      {/* 7. 末尾タグ（クリックでTOPページのフィルターへ） */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-12 pt-8 border-t border-stone-100">
          <p className="text-xs text-stone-400 mb-3">この記事のタグ</p>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/?tag=${encodeURIComponent(tag)}`} className={tagClassName(tag, "footer")}>
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 8. 前後の記事ナビゲーション */}
      <nav className="mt-10 pt-8 border-t border-stone-100 grid grid-cols-2 gap-4">
        <div>
          {olderPost && (
            <Link
              href={`/posts/${olderPost.slug}`}
              className="group flex flex-col gap-1 p-4 rounded-xl border border-stone-100 hover:border-stone-200 hover:bg-white transition-all"
            >
              <span className="text-xs text-stone-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                前の記事
              </span>
              <span className="text-sm font-medium text-stone-700 group-hover:text-amber-700 transition-colors line-clamp-2 leading-snug">
                {olderPost.title}
              </span>
            </Link>
          )}
        </div>
        <div className="flex justify-end">
          {newerPost && (
            <Link
              href={`/posts/${newerPost.slug}`}
              className="group flex flex-col gap-1 p-4 rounded-xl border border-stone-100 hover:border-stone-200 hover:bg-white transition-all text-right w-full"
            >
              <span className="text-xs text-stone-400 flex items-center gap-1 justify-end">
                次の記事
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
              <span className="text-sm font-medium text-stone-700 group-hover:text-amber-700 transition-colors line-clamp-2 leading-snug">
                {newerPost.title}
              </span>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
