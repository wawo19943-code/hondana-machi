"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import PostCard from "@/components/PostCard";

type Props = {
  posts: PostMeta[];
  regionTags: string[];
  featureTags: string[];
};

function tagHref(tag: string, activeTag: string | null): string {
  return tag === activeTag ? "/" : `/?tag=${encodeURIComponent(tag)}`;
}

export default function TagFilter({ posts, regionTags, featureTags }: Props) {
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag");

  const filteredPosts = activeTag
    ? posts.filter((p) => p.tags?.includes(activeTag))
    : posts;

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
                  <Link
                    key={tag}
                    href={tagHref(tag, activeTag)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                      activeTag === tag
                        ? "bg-amber-600 text-white border-amber-600"
                        : "text-stone-600 border-stone-200 hover:border-amber-400 hover:text-amber-700 bg-white"
                    }`}
                  >
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
                  <Link
                    key={tag}
                    href={tagHref(tag, activeTag)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                      activeTag === tag
                        ? "bg-teal-600 text-white border-teal-600"
                        : "text-stone-600 border-stone-200 hover:border-teal-400 hover:text-teal-700 bg-white"
                    }`}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {activeTag && (
            <div className="flex items-center justify-between pt-1">
              <p className="text-sm text-stone-500">
                「{activeTag}」の記事{" "}
                <span className="font-medium text-stone-700">{filteredPosts.length}</span> 件
              </p>
              <Link
                href="/"
                className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
              >
                絞り込みを解除
              </Link>
            </div>
          )}
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <p className="text-stone-400 text-sm py-8 text-center">
          「{activeTag}」に該当する記事がありません。
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
