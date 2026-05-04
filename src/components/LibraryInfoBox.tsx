import type { LibraryInfo } from "@/lib/posts";

type Props = {
  info: LibraryInfo;
};

type BooleanField = {
  label: string;
  value: boolean | undefined;
};

function StatusBadge({ value }: { value: boolean | undefined }) {
  if (value === undefined) {
    return <span className="text-stone-400 text-sm">—</span>;
  }
  return value ? (
    <span className="inline-flex items-center gap-1 text-emerald-700 font-medium text-sm">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
      あり
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-stone-400 text-sm">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
      なし
    </span>
  );
}

export default function LibraryInfoBox({ info }: Props) {
  const textFields: { label: string; value?: string }[] = [
    { label: "住所", value: info.address },
    { label: "開館時間", value: info.hours },
    { label: "休館日", value: info.closedDays },
    { label: "蔵書数", value: info.collection },
  ];

  const boolFields: BooleanField[] = [
    { label: "ライトノベル", value: info.lightNovels },
    { label: "漫画", value: info.manga },
    { label: "Wi-Fi", value: info.wifi },
    { label: "電源コンセント", value: info.power },
    { label: "駐車場", value: info.parking },
    { label: "自習室", value: info.studyRoom },
  ];

  const hasAnyData =
    textFields.some((f) => f.value) || boolFields.some((f) => f.value !== undefined);
  if (!hasAnyData) return null;

  return (
    <aside className="my-12 bg-white border-l-4 border-orange-400 rounded-r-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-stone-100 flex items-center gap-2">
        <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h2 className="text-sm font-medium text-stone-700 tracking-wide">図書館基本情報</h2>
      </div>

      <div className="p-6 space-y-3">
        {textFields.filter((f) => f.value).map((field) => (
          <div key={field.label} className="flex gap-4 text-sm">
            <dt className="w-24 flex-shrink-0 text-stone-400">{field.label}</dt>
            <dd className="text-stone-700">{field.value}</dd>
          </div>
        ))}

        {boolFields.some((f) => f.value !== undefined) && (
          <div className="pt-4 mt-4 border-t border-stone-100">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-4">
              {boolFields.map((field) => (
                <div key={field.label} className="flex flex-col gap-1">
                  <span className="text-xs text-stone-400 leading-none">{field.label}</span>
                  <StatusBadge value={field.value} />
                </div>
              ))}
            </div>
          </div>
        )}

        {info.officialUrl && (
          <div className="pt-4 mt-4 border-t border-stone-100">
            <a
              href={info.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-amber-700 hover:text-amber-900 transition-colors"
            >
              公式サイトで最新情報を確認する
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </aside>
  );
}
