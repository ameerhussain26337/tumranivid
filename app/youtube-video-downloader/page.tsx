import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "YouTube Video Downloader | QuickVid",
  description:
    "Process supported public YouTube video URLs with QuickVid.",
};

export default function YouTubeDownloader() {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-20 text-white">
      <div className="mx-auto max-w-4xl">
        <a href="/" className="font-bold text-indigo-400">
          ← QuickVid
        </a>

        <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12">
          <div className="mb-4 inline-flex rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300">
            YouTube
          </div>

          <h1 className="text-4xl font-black md:text-5xl">
            YouTube Video Downloader
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            Use QuickVid to process supported public YouTube video
            URLs. Availability depends on platform permissions and
            authorized media integrations.
          </p>

          <div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-8">
            <h2 className="text-2xl font-bold">
              How to use
            </h2>

            <ol className="mt-5 list-decimal space-y-3 pl-5 text-slate-400">
              <li>Copy the public YouTube video URL.</li>
              <li>Open QuickVid.</li>
              <li>Paste the URL.</li>
              <li>Process the URL.</li>
              <li>Use an available authorized option.</li>
            </ol>
          </div>

          <a
            href="/"
            className="mt-8 inline-flex rounded-2xl bg-indigo-500 px-6 py-4 font-bold transition hover:bg-indigo-400"
          >
            Process YouTube URL
          </a>
        </div>
      </div>
    </main>
  );
}