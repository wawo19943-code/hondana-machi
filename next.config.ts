import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  // 旧ドメイン（hondana-machi.vercel.app）へのアクセスを独自ドメインへ恒久転送する。
  // 検索結果に残っている旧URLの評価を www.hondana-machi.com に寄せるため。
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "hondana-machi.vercel.app" }],
        destination: "https://www.hondana-machi.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default withMDX(nextConfig);
