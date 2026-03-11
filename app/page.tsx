import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900 selection:bg-indigo-500/20">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}
