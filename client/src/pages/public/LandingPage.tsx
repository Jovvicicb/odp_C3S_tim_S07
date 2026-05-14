import { HeroSection } from "../../components/landing/HeroSection";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="absolute top-[-10%] left-[-10%] h-105 w-105 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] h-105 w-105 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_35%)]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-8">
        <HeroSection />

        <section className="pb-10">
          <div className="mb-6">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-sky-200/40">
              Public communities
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              Explore communities
            </h2>
          </div>
        </section>
      </div>
    </main>
  );
}
