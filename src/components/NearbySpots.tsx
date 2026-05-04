import type { NearbySpot, SpotType } from "@/lib/posts";

type Props = {
  spots: NearbySpot[];
};

const categoryColors: Record<string, string> = {
  カフェ: "bg-amber-100 text-amber-800",
  食事: "bg-orange-100 text-orange-800",
  公園: "bg-emerald-100 text-emerald-800",
  美術館: "bg-violet-100 text-violet-800",
  博物館: "bg-blue-100 text-blue-800",
  書店: "bg-rose-100 text-rose-800",
  ホテル: "bg-sky-100 text-sky-800",
  神社: "bg-red-100 text-red-800",
  観光: "bg-teal-100 text-teal-800",
};

const spotLinkConfig: Record<SpotType, { text: string }> = {
  sightseeing: { text: "Google Mapsで見る" },
  food:        { text: "食べログで見る" },
  hotel:       { text: "じゃらんで予約" },
};

function getLinkText(spotType?: SpotType): string {
  if (!spotType) return "Google Mapsで見る";
  return spotLinkConfig[spotType].text;
}

function getCategoryColor(category?: string): string {
  if (!category) return "bg-stone-100 text-stone-600";
  return categoryColors[category] ?? "bg-stone-100 text-stone-600";
}

export default function NearbySpots({ spots }: Props) {
  if (!spots || spots.length === 0) return null;

  return (
    <section className="my-12">
      <h2 className="flex items-center gap-2 text-lg font-serif font-medium text-stone-800 mb-5">
        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        周辺スポット
      </h2>

      <div className="space-y-3">
        {spots.map((spot, i) => (
          <div key={i} className="p-4 rounded-xl bg-white border border-stone-100">
            <div className="flex gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {spot.category && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCategoryColor(spot.category)}`}>
                      {spot.category}
                    </span>
                  )}
                  <h3 className="font-medium text-stone-800 text-sm">{spot.name}</h3>
                </div>
                <p className="text-stone-500 text-sm leading-relaxed mb-3">{spot.description}</p>
                <a
                  href={spot.url ?? "#"}
                  target={spot.url ? "_blank" : undefined}
                  rel={spot.url ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-1 text-xs text-amber-700 hover:text-amber-900 transition-colors"
                >
                  {getLinkText(spot.spotType)} ›
                </a>
              </div>
              {spot.distance && (
                <div className="flex-shrink-0 text-xs text-stone-400 whitespace-nowrap pt-0.5">
                  {spot.distance}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
