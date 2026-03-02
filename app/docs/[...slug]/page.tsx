import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";

interface DocsPageProps {
  params: {
    slug: string[];
  };
}

export default async function ProviderDocPage({ params }: DocsPageProps) {
  const { slug } = await params;
  
  // Reconstruct path to fetch specific md/mdx
  // E.g., slug = ['providers', 'instagram']
  const relativePath = slug.join("/");
  
  // Handle matching if path doesn't align natively due to how I copied them
  // We only copied 5 files and put them directly in the root of content/docs
  let fileName = slug[slug.length - 1]; // Just use the trailing name for now (e.g. instagram)

  const docsDirectory = path.join(process.cwd(), "content/docs");
  const fullPath = path.join(docsDirectory, `${fileName}.mdx`);

  let fileContents = "";
  try {
    fileContents = fs.readFileSync(fullPath, "utf8");
  } catch (err) {
    notFound();
  }

  const contentWithoutFrontmatter = fileContents.replace(/---[\s\S]*?---/, "");

  const markdownComponents = {
    h1: ({ node, ...props }: any) => <h1 className="text-4xl font-bold mt-8 mb-6 text-white tracking-tight" {...props} />,
    h2: ({ node, ...props }: any) => <h2 className="text-2xl font-bold mt-12 mb-5 text-zinc-100 border-b border-white/10 pb-2" {...props} />,
    h3: ({ node, ...props }: any) => <h3 className="text-xl font-semibold mt-8 mb-4 text-zinc-200" {...props} />,
    p: ({ node, ...props }: any) => <p className="text-base text-zinc-400 mb-6 leading-relaxed" {...props} />,
    ul: ({ node, ...props }: any) => <ul className="list-disc pl-6 text-zinc-400 mb-6 space-y-2" {...props} />,
    ol: ({ node, ...props }: any) => <ol className="list-decimal pl-6 text-zinc-400 mb-6 space-y-2" {...props} />,
    a: ({ node, href, ...props }: any) => (
      <a href={href} className="text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-4 decoration-indigo-500/30" {...props} />
    ),
    code: ({ node, inline, ...props }: any) => 
      inline ? (
        <code className="bg-white/10 text-zinc-200 px-1.5 py-0.5 rounded text-sm font-mono border border-white/5" {...props} />
      ) : (
        <div className="relative my-6 group">
          <code className="block bg-[#1a1b26] border border-white/10 text-zinc-300 p-5 rounded-xl text-sm font-mono overflow-x-auto shadow-2xl" {...props} />
        </div>
      ),
    pre: ({ node, ...props }: any) => <pre className="bg-transparent p-0 m-0" {...props} />,
    img: ({ node, src, ...props }: any) => (
      <span className="block my-10 border border-white/10 rounded-2xl overflow-hidden bg-white/5 shadow-2xl">
        <img src={src} className="w-full h-auto object-contain bg-zinc-900/50" {...props} />
      </span>
    ),
    strong: ({ node, ...props }: any) => <strong className="font-semibold text-zinc-200" {...props} />,
    blockquote: ({ node, ...props }: any) => (
      <blockquote className="border-l-4 border-indigo-500 pl-5 py-2 my-8 text-zinc-400 bg-indigo-500/10 rounded-r-xl italic" {...props} />
    ),
  };

  return (
    <article className="prose prose-invert max-w-none animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        components={markdownComponents as any}
      >
        {contentWithoutFrontmatter}
      </ReactMarkdown>
    </article>
  );
}
