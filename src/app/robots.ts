import { MetadataRoute } from "next";

// 独自ドメイン取得後はここを変更する（例: https://hondana-machi.com）
const baseUrl = "https://www.hondana-machi.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
