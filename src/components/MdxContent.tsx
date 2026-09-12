import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

type Props = {
  source: string;
};

export default function MdxContent({ source }: Props) {
  return (
    <div className="prose prose-stone max-w-none
      prose-headings:font-serif prose-headings:font-medium
      prose-h2:text-2xl prose-h2:mt-14 prose-h2:mb-5
      prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-3
      prose-p:text-base prose-p:leading-[1.8] prose-p:text-stone-700
      prose-a:text-amber-700 prose-a:no-underline hover:prose-a:underline
      prose-blockquote:border-l-2 prose-blockquote:border-amber-300
      prose-blockquote:text-stone-500 prose-blockquote:italic prose-blockquote:not-italic
      prose-blockquote:bg-amber-50/50 prose-blockquote:rounded-r-lg prose-blockquote:py-1
      prose-strong:text-stone-800
      prose-img:rounded-xl prose-img:shadow-sm
      prose-hr:border-stone-200
      prose-li:text-stone-700 prose-li:leading-[1.8]
      prose-table:text-sm prose-table:my-8
      prose-thead:border-b prose-thead:border-stone-300
      prose-th:text-left prose-th:font-medium prose-th:text-stone-600 prose-th:py-2.5 prose-th:px-3
      prose-td:py-2.5 prose-td:px-3 prose-td:align-top prose-td:text-stone-700
      prose-tr:border-b prose-tr:border-stone-100">
      <MDXRemote
        source={source}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }}
      />
    </div>
  );
}
