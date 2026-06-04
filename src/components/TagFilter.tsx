"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import PostCard from "@/components/PostCard";

const POSTS_PER_PAGE = 9;

type Props = {
  posts: PostMeta[];
  regionTags: string[];
  featureTags: string[];
};

function buildHref(tag: string | null, page: number): string {
  const params = new URLSearchParams();
  if (tag) params.set("tag", tag);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}

function tagHref(tag: string, activeTag: string | null): string {
  return tag === activeTag ? "/" : buildHref(tag, 1);
}

export default function TagFilter({ posts, regionTags, featureTags }: Props) {
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag");
  const currentPage = Number(searchParams.get("page") ?? "1");

  const filteredPosts = activeTag
    ? posts.filter((p) => p.tags?.includes(activeTag))
    : posts;

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const pagedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const hasFilters = regionTags.length > 0 || featureTags.length > 0;

  return (
    <div>
      {hasFilters && (
        <div className="mb-8 space-y-2.5">
          {regionTags.length > 0 && (
            <div className="flex items-start gap-3">
              <span className="text-xs text-stone-400 pt-1.5 w-10 shrink-0">地域</span>
              <div className="flex flex-wrap gap-2">
                {regionTags.map((tag) => (
                  <Link key={tag} href={tagHref(tag, activeTag)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                      activeTag === tag
                        ? "bg-amber-600 text-white border-amber-600"
                        : "text-stone-600 border-stone-200 hover:border-amber-400 hover:text-amber-700 bg-white"
                    }`}>
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {featureTags.length > 0 && (
            <div className="flex items-start gap-3">
              <span className="text-xs text-stone-400 pt-1.5 w-10 shrink-0">特徴</span>
              <div className="flex flex-wrap gap-2">
                {featureTags.map((tag) => (
                  <Link key={tag} href={tagHref(tag, activeTag)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                      activeTag === tag
                        ? "bg-teal-600 text-white border-teal-600"
                        : "text-stone-600 border-stone-200 hover:border-teal-400 hover:text-teal-700 bg-white"
                    }`}>
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {activeTag && (
            <div className="flex items-center justify-between pt-1">
              <p className="text-sm text-stone-500">
                「{activeTag}」の記事 <span className="font-medium text-stone-700">{filteredPosts.length}</span> 件
              </p>
              <Link href="/" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
                絞り込みを解除
              </Link>
            </div>
          )}
        </div>
      )}

      {pagedPosts.length === 0 ? (
        <p className="text-stone-400 text-sm py-8 text-center">「{activeTag}」に該当する記事がありません。</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pagedPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {currentPage > 1 && (
            <Link href={buildHref(activeTag, currentPage - 1)}
              className="text-xs px-4 py-2 rounded-full border border-stone-200 text-stone-600 hover:border-amber-400 hover:text-amber-700 transition-colors bg-white">
              ← 前へ
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Link key={page} href={buildHref(activeTag, page)}
              className={`text-xs w-8 h-8 flex items-center justify-center rounded-full border transition-colors ${
                page === currentPage
                  ? "bg-amber-600 text-white border-amber-600"
                  : "text-stone-600 border-stone-200 hover:border-amber-400 hover:text-amber-700 bg-white"
              }`}>
              {page}
            </Link>
          ))}
          {currentPage < totalPages && (
            <Link href={buildHref(activeTag, currentPage + 1)}
              className="text-xs px-4 py-2 rounded-full border border-stone-200 text-stone-600 hover:border-amber-400 hover:text-amber-700 transition-colors bg-white">
              次へ →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
