import Link from "next/link";
import Image from "next/image";
import type { PostMeta } from "@/lib/posts";
import LibraryPlaceholder from "@/components/LibraryPlaceholder";

type Props = {
  post: PostMeta;
};

export default function PostCard({ post }: Props) {
  const formattedDate = new Date(post.date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="group bg-white rounded-xl border border-stone-100 overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/60 hover:border-transparent">
      <Link href={`/posts/${post.slug}`} className="flex flex-col sm:flex-row">
        {/* サムネイル */}
        <div className="sm:w-48 sm:flex-shrink-0 aspect-video sm:aspect-auto relative overflow-hidden bg-stone-100">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <LibraryPlaceholder />
          )}
        </div>

        {/* コンテンツ */}
        <div className="flex-1 min-w-0 p-5 sm:p-6 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-xs text-stone-400 mb-2.5">
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

          <h2 className="text-lg sm:text-xl font-serif font-medium text-stone-800 group-hover:text-amber-700 transition-colors mb-2 leading-snug">
            {post.title}
          </h2>

          <p className="text-stone-500 text-sm leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>

          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
