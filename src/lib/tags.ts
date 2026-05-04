const REGION_TAG_SET = new Set([
  // 都道府県
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
  "岐阜県", "静岡県", "愛知県", "三重県",
  "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
  // 国・地域
  "日本", "アメリカ", "スウェーデン", "フランス", "ドイツ", "イギリス",
  "デンマーク", "フィンランド", "ノルウェー", "オランダ", "スペイン",
  "イタリア", "中国", "韓国", "台湾", "シンガポール", "オーストラリア",
  "カナダ", "メキシコ", "ブラジル", "インド",
]);

const FEATURE_TAG_SET = new Set([
  "建築", "現代建築", "北欧建築", "歴史的建築",
  "ラノベ充実", "漫画充実",
  "駅近", "自習室あり", "駐車場あり", "Wi-Fiあり", "電源あり",
  "子ども向け", "静かな環境", "カフェ併設",
]);

export type TagType = "region" | "feature";

export function getTagType(tag: string): TagType | null {
  if (REGION_TAG_SET.has(tag)) return "region";
  if (FEATURE_TAG_SET.has(tag)) return "feature";
  return null;
}

export function classifyTags(tags: string[]): {
  regionTags: string[];
  featureTags: string[];
} {
  const regionTags: string[] = [];
  const featureTags: string[] = [];
  for (const tag of tags) {
    const type = getTagType(tag);
    if (type === "region") regionTags.push(tag);
    else if (type === "feature") featureTags.push(tag);
  }
  return { regionTags, featureTags };
}
