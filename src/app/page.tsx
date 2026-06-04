import { Suspense } from "react";
import { getAllPosts } from "@/lib/posts";
import { classifyTags } from "@/lib/tags";
import TagFilter from "@/components/TagFilter";
import PostCard from "@/components/PostCard";

export default function Home() {
  const posts = getAllPosts();

  const allTags = [...new Set(posts.flatMap((p) => p.tags ?? []))];
  const { regionTags, featureTags } = classifyTags(allTags);

  return (
    <div>
      {/* ヒーロー */}
      <div className="hero-pattern border-b border-amber-100">
        <div className="max-w-[1100px] mx-auto px-4 py-20 sm:py-28">
          <p className="font-playfair text-sm tracking-widest text-amber-700 mb-4 uppercase">
            Travel &amp; Architecture
          </p>
          <h1 className="text-4xl sm:text-5xl font-serif font-medium text-stone-800 mb-5 leading-tight">
            本棚のある街へ
          </h1>
          <p className="text-stone-500 leading-[1.8] text-base max-w-lg">
            世界の図書館をめぐる旅の記録。建築と本が交差する場所で、
            時間の流れが少しゆっくりになる気がする。
          </p>
          <div className="mt-8 flex items-center gap-3">
            <div className="w-10 h-px bg-amber-400" />
            <span className="text-xs text-amber-600 tracking-wide">{posts.length} 篇の記録</span>
          </div>
        </div>
      </div>

      {/* 記事一覧（タグフィルター付き） */}
      <div className="max-w-[1100px] mx-auto px-4 py-12">
        {posts.length === 0 ? (
          <p className="text-stone-400 text-sm">まだ記事がありません。</p>
        ) : (
          <Suspense
            fallback={
              <div className="flex flex-col gap-4">
                {posts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            }
          >
            <TagFilter
              posts={posts}
              regionTags={regionTags}
              featureTags={featureTags}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}
