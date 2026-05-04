import type { AffiliateLinks, AffiliateItem } from "@/lib/posts";

type Props = {
  links: AffiliateLinks;
};

function BookIcon() {
  return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function TravelIcon() {
  return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function GoodsIcon() {
  return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
}

type SectionProps = {
  heading: string;
  icon: React.ReactNode;
  iconBg: string;
  item: AffiliateItem;
  linkText: string;
};

function AffiliateSection({ heading, icon, iconBg, item, linkText }: SectionProps) {
  return (
    <div className="border-t border-stone-100 pt-6 first:border-none first:pt-0">
      <h3 className="text-sm font-medium text-stone-500 mb-3">{heading}</h3>
      <div className="flex items-start gap-4 bg-white rounded-xl border border-stone-100 p-4">
        <div className={`flex-shrink-0 rounded-lg p-2 ${iconBg}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-serif font-medium text-stone-800 text-base leading-snug mb-0.5">
            {item.title}
          </p>
          {item.author && (
            <p className="text-xs text-stone-400 mb-1.5">{item.author}</p>
          )}
          {item.description && (
            <p className="text-sm text-stone-500 leading-relaxed mb-3">{item.description}</p>
          )}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-900 border border-stone-200 hover:border-stone-400 rounded-lg px-3 py-1.5 transition-colors"
          >
            {item.label ?? linkText}
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          {item.trackingPixel && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.trackingPixel} width={1} height={1} alt="" aria-hidden="true" style={{ display: "block" }} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function AffiliateArea({ links }: Props) {
  const hasAny = links.book || links.travel || links.goods;
  if (!hasAny) return null;

  return (
    <section className="my-12">
      <div className="space-y-6">
        {links.travel && (
          <AffiliateSection
            heading="🏨 図書館巡りの宿を探す"
            icon={<TravelIcon />}
            iconBg="bg-sky-50 text-sky-500"
            item={links.travel}
            linkText="じゃらんで見る"
          />
        )}
        {links.book && (
          <AffiliateSection
            heading="📖 この図書館をもっと知るための一冊"
            icon={<BookIcon />}
            iconBg="bg-amber-50 text-amber-600"
            item={links.book}
            linkText="Amazonで見る"
          />
        )}
        {links.goods && (
          <AffiliateSection
            heading="✏️ 図書館で使いたいもの"
            icon={<GoodsIcon />}
            iconBg="bg-rose-50 text-rose-500"
            item={links.goods}
            linkText="Amazonで見る"
          />
        )}
      </div>
    </section>
  );
}
