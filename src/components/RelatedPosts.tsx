import Link from "next/link";
import Image from "next/image";
import type { RelatedPost } from "@/lib/posts";

type Props = {
  posts: RelatedPost[];
};

// 記事末尾の「つながる図書館・本の街」カード
// related（この記事が紹介）を先に、backlink（相手が紹介）を後に並べる
export default function RelatedPosts({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-stone-100">
      <h2 className="text-lg font-serif font-medium text-stone-800 mb-1">
        この記事とつながる場所
      </h2>
      <p className="text-xs text-stone-400 mb-5">
        同じ街、同じこだわり、同じ系譜。あわせて読みたい記事です。
      </p>

      <ul className="grid gap-3 sm:grid-cols-2">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/posts/${post.slug}`}
              className="group flex gap-3 p-3 rounded-xl border border-stone-100 hover:border-stone-200 hover:bg-white transition-all h-full"
            >
              <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-stone-100">
                {post.coverImage && (
                  <Image
                    src={post.coverImage}
                    alt={post.imageAlt ?? post.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                {post.reason && (
                  <span className="text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full self-start">
                    {post.reason}
                  </span>
                )}
                <span className="text-sm font-medium text-stone-700 group-hover:text-amber-700 transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </span>
                <span className="text-xs text-stone-400 truncate">{post.location}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
