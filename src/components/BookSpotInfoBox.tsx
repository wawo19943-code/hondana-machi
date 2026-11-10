import type { ReactNode } from "react";
import type { BookSpotInfo } from "@/lib/posts";

type Props = {
  info: BookSpotInfo;
};

function Flag({ label, value }: { label: string; value?: boolean }) {
  if (value === undefined) return null;
  return (
    <span
      className={
        value
          ? "text-xs text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full"
          : "text-xs text-stone-400 bg-stone-50 px-2.5 py-1 rounded-full line-through"
      }
    >
      {label}
    </span>
  );
}

function Row({ label, children }: { label: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <div className="grid grid-cols-[6rem_1fr] gap-3 py-2 border-b border-stone-100 last:border-0">
      <dt className="text-xs text-stone-400 pt-0.5">{label}</dt>
      <dd className="text-sm text-stone-700 leading-relaxed">{children}</dd>
    </div>
  );
}

// Phase 6 の本屋・本の宿・本の街の基本情報ボックス（図書館の LibraryInfoBox に相当）
export default function BookSpotInfoBox({ info }: Props) {
  return (
    <section className="mt-12 p-6 rounded-2xl bg-stone-50 border border-stone-100">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-base font-serif font-medium text-stone-800">基本情報</h2>
        {info.kind && (
          <span className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
            {info.kind}
          </span>
        )}
      </div>

      <dl>
        <Row label="住所">{info.address}</Row>
        <Row label="営業時間">{info.hours}</Row>
        <Row label="定休日">{info.closedDays}</Row>
        <Row label="料金">{info.price}</Row>
        <Row label="公式サイト">
          {info.officialUrl && (
            <a
              href={info.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-700 underline underline-offset-2 break-all"
            >
              {info.officialUrl}
            </a>
          )}
        </Row>
      </dl>

      <div className="flex flex-wrap gap-2 mt-4">
        <Flag label="宿泊できる" value={info.stay} />
        <Flag label="カフェあり" value={info.cafe} />
        <Flag label="Wi-Fi" value={info.wifi} />
        <Flag label="電源" value={info.power} />
        <Flag label="駐車場" value={info.parking} />
      </div>
    </section>
  );
}
