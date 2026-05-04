import { MDXRemote } from "next-mdx-remote/rsc";

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
      prose-li:text-stone-700 prose-li:leading-[1.8]">
      <MDXRemote source={source} />
    </div>
  );
}
