import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "このブログについて",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-2xl font-serif font-medium text-stone-800 mb-3">
          このブログについて
        </h1>
        <div className="mt-4 w-12 h-0.5 bg-amber-300" />
      </div>
      <div className="prose prose-stone prose-lg max-w-none prose-p:leading-8 prose-p:text-stone-700 prose-headings:font-serif">
        <p>
          「本棚のある街へ」は、世界各地の図書館をめぐる旅の記録です。
        </p>
        <p>
          図書館はただ本を借りる場所ではなく、その街が知識や文化をどう扱っているかを映す鏡だと思っています。
          建築の隅々に宿る設計者の意図、閲覧室に満ちた光の質、本棚の配置が生む動線——
          そういうものを、旅日記のようなトーンで書き留めていきます。
        </p>
        <p>
          大きな国立図書館から、路地裏の小さなコミュニティライブラリまで。
          本と空間が交差する場所を、ゆっくりと訪ねていきます。
        </p>
      </div>
    </div>
  );
}
