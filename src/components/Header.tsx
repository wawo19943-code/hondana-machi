import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-stone-200 bg-white/90 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-[720px] mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="group">
          <span className="text-lg font-serif font-medium text-stone-800 group-hover:text-amber-700 transition-colors">
            本棚のある街へ
          </span>
          <p className="text-xs text-stone-400 mt-0.5 hidden sm:block">
            図書館建築をめぐる旅の記録
          </p>
        </Link>
        <nav className="flex gap-5 text-sm text-stone-500">
          <Link href="/" className="hover:text-stone-800 transition-colors">
            記事一覧
          </Link>
          <Link href="/about" className="hover:text-stone-800 transition-colors">
            このブログについて
          </Link>
        </nav>
      </div>
    </header>
  );
}
