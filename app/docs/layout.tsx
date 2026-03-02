import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import Link from "next/link";
import fs from "fs";
import path from "path";

function getDocsNavigation() {
  try {
    const docsPath = path.join(process.cwd(), "content/docs/docs.json");
    const docsJson = JSON.parse(fs.readFileSync(docsPath, "utf8"));
    const allGroups = docsJson.navigation?.tabs?.[0]?.groups || [];
    return allGroups.filter((g: any) => g.group === "Providers");
  } catch (error) {
    console.error("Failed to parse docs.json", error);
    return [];
  }
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const groups = getDocsNavigation();

  const renderPage = (page: any, idx: number) => {
    if (typeof page === "string") {
      const parts = page.split("/");
      const label = parts[parts.length - 1]
        .split("-")
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      return (
        <li key={idx} className="mt-1">
          <Link
            href={`/docs/${page}`}
            className="block px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
          >
            {label}
          </Link>
        </li>
      );
    } else if (page && page.group && page.pages) {
      return (
        <li key={idx} className="mt-4 mb-2">
          <div className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
            {page.group}
          </div>
          <ul className="space-y-0.5 border-l border-white/10 ml-3 pl-2">
            {page.pages.map((p: any, i: number) => renderPage(p, i))}
          </ul>
        </li>
      );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 flex flex-col font-sans">
      <Navbar />
      
      <div className="flex flex-1 pt-16 max-w-[90rem] mx-auto w-full">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 hidden md:flex flex-col border-r border-white/10 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto hidden-scrollbar py-8 pl-4 pr-6">
          <nav className="space-y-6">
            {groups.map((groupObj: any, idx: number) => (
              <div key={idx}>
                <h3 className="font-semibold text-zinc-100 mb-2 px-3 text-sm tracking-tight">{groupObj.group}</h3>
                <ul className="space-y-1">
                  {groupObj.pages.map((page: any, i: number) => renderPage(page, i))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}
