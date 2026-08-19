import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instagram Video Downloader | QuickVid",
  description:
    "Process supported public Instagram video URLs with QuickVid.",
};

export default function InstagramVideoDownloader() {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-20 text-white">
      <div className="mx-auto max-w-4xl">
        <a href="/" className="font-bold text-indigo-400">
          ← Back to QuickVid
        </a>

        <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12">
          <div className="mb-4 inline-flex rounded-full border border-pink-400/20 bg-pink-500/10 px-4 py-2 text-sm font-semibold text-pink-300">
            Instagram
          </div>

          <h1 className="text-4xl font-black md:text-5xl">
            Instagram Video Downloader
          </h1>

          <p className="mt-5 leading-7 text-slate-400">
            Process supported public Instagram video URLs through
            authorized media sources.
          </p>

          <a
            href="/"
            className="mt-8 inline-flex rounded-2xl bg-indigo-500 px-6 py-4 font-bold transition hover:bg-indigo-400"
          >
            Process Instagram URL
          </a>
        </div>
      </div>
    </main>
  );
}