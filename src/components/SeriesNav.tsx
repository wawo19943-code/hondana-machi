import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

type Props = {
  seriesName: string;
  seriesNumber: number;
  total: number;
  prev: PostMeta | null;
  next: PostMeta | null;
};

// シリーズ（Phase）の中での前後移動。日付順の「前の記事・次の記事」とは別に表示する
export default function SeriesNav({ seriesName, seriesNumber, total, prev, next }: Props) {
  return (
    <nav className="mt-12 p-5 rounded-2xl bg-amber-50/60 border border-amber-100">
      <p className="text-xs text-amber-700 mb-3">
        {seriesName}　#{seriesNumber}
        {total > 0 && <span className="text-amber-600/70"> / 全{total}本</span>}
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          {prev && (
            <Link href={`/posts/${prev.slug}`} className="group flex flex-col gap-0.5">
              <span className="text-[11px] text-stone-400">← #{prev.seriesNumber}</span>
              <span className="text-sm text-stone-700 group-hover:text-amber-700 transition-colors line-clamp-2 leading-snug">
                {prev.title}
              </span>
            </Link>
          )}
        </div>
        <div className="text-right">
          {next && (
            <Link href={`/posts/${next.slug}`} className="group flex flex-col gap-0.5 items-end">
              <span className="text-[11px] text-stone-400">#{next.seriesNumber} →</span>
              <span className="text-sm text-stone-700 group-hover:text-amber-700 transition-colors line-clamp-2 leading-snug">
                {next.title}
              </span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
