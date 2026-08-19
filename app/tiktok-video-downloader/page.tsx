import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TikTok Video Downloader",
  description:
    "Process supported public TikTok video URLs with QuickVid.",
};

export default function TikTokDownloader() {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-20 text-white">
      <div className="mx-auto max-w-4xl">
        <a href="/" className="font-bold text-indigo-400">
          ← QuickVid
        </a>

        <h1 className="mt-12 text-5xl font-black">
          TikTok Video Downloader
        </h1>

        <p className="mt-6 text-lg leading-8 text-slate-400">
          Use QuickVid to process supported public TikTok video
          URLs. Availability depends on platform permissions and
          authorized media integrations.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-bold">
            How to use
          </h2>

          <ol className="mt-5 list-decimal space-y-3 pl-5 text-slate-400">
            <li>Copy the public TikTok URL.</li>
            <li>Open QuickVid.</li>
            <li>Paste the URL.</li>
            <li>Process the URL.</li>
            <li>Use an available authorized option.</li>
          </ol>
        </div>
      </div>
    </main>
  );
}