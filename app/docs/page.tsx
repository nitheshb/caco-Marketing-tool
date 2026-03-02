import { FileText, Zap, Link as LucideLink } from "lucide-react";
import Link from "next/link";

export default function DocsIndexPage() {
    return (
        <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6">
                    Documentation
                </h1>
                <p className="text-xl text-zinc-400 leading-relaxed">
                    Welcome to the central knowledge hub. Here you'll find comprehensive guides, integration references, and tutorials for maximizing your workflow.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <Link href="/docs/providers/instagram" className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/50 transition-all flex flex-col gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                        <FileText className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-200">Instagram Integration</h3>
                    <p className="text-sm text-zinc-500">Set up Facebook Pages or Standalone Instagram endpoints.</p>
                </Link>
                
                <Link href="/docs/providers/facebook" className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/50 transition-all flex flex-col gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                        <LucideLink className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-200">Facebook Implementation</h3>
                    <p className="text-sm text-zinc-500">Read the OAuth requirements and Graph API mappings.</p>
                </Link>
            </div>
            
            <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex gap-4 items-start">
                <Zap className="h-6 w-6 text-indigo-400 flex-shrink-0 mt-1" />
                <div className="space-y-1">
                    <h4 className="font-semibold text-indigo-300">Quick Tip</h4>
                    <p className="text-sm text-indigo-400/80">Use the sidebar on the left to navigate between different categories and platforms as you configure your system.</p>
                </div>
            </div>
        </div>
    );
}
