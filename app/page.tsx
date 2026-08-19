"use client";

import { FormEvent, useState } from "react";

type Result = {
  success: boolean;
  platform?: string;
  message: string;
  downloadAvailable?: boolean;
  data?: {
    id?: string;
    type?: string;
    download_url?: string;
    thumbnail_url?: string;
    width?: number;
    height?: number;
    duration?: string | number;
    caption?: string;
  };
};

const platformInfo: Record<
  string,
  {
    letter: string;
  }
> = {
  TikTok: { letter: "T" },
  Instagram: { letter: "I" },
  Facebook: { letter: "F" },
  YouTube: { letter: "Y" },
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const cleanUrl = url.trim();

    if (!cleanUrl) {
      setResult({
        success: false,
        message: "Please paste a video URL first.",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: cleanUrl,
        }),
      });

      const data = await response.json();

      setResult(data);
    } catch {
      setResult({
        success: false,
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  const platform = result?.platform
    ? platformInfo[result.platform]
    : null;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <a href="/" className="text-2xl font-black">
            Tumrani<span className="text-indigo-400">Vid</span>
          </a>

          <div className="hidden gap-7 text-sm text-slate-300 md:flex">
            <a href="#how" className="hover:text-white">
              How it works
            </a>

            <a href="#platforms" className="hover:text-white">
              Platforms
            </a>

            <a href="#faq" className="hover:text-white">
              FAQ
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-5 py-24 md:py-32">
        <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-300">
            Fast • Simple • Free
          </div>

          <h1 className="text-5xl font-black tracking-tight md:text-7xl">
            Download Social
            <span className="block text-indigo-400">
              Videos Easily
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Paste a supported public video URL and process it
            instantly.
          </p>

          {/* Search */}
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur md:flex-row"
          >
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste your video URL here..."
              className="h-16 flex-1 rounded-2xl border border-white/10 bg-white/10 px-5 text-white outline-none placeholder:text-slate-500 focus:border-indigo-400"
            />

            <button
              type="submit"
              disabled={loading}
              className="h-16 rounded-2xl bg-indigo-500 px-8 font-bold transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Processing..." : "Process URL"}
            </button>
          </form>

          {/* Result */}
          {result && (
            <div className="mx-auto mt-8 max-w-3xl text-left">
              {result.success && result.data?.download_url ? (
                <div className="overflow-hidden rounded-3xl border border-indigo-400/20 bg-white/5">
                  {/* Header */}
                  <div className="flex items-center gap-4 border-b border-white/10 p-6">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-indigo-500/10 text-xl font-black text-indigo-400">
                      {platform?.letter || "V"}
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                        Video Ready
                      </p>

                      <h2 className="mt-1 text-xl font-bold">
                        {result.platform} Video
                      </h2>
                    </div>
                  </div>

                  {/* Video */}
                  <div className="p-6">
                    <video
                      controls
                      playsInline
                      poster={result.data.thumbnail_url}
                      className="mx-auto max-h-[600px] w-full rounded-2xl bg-black"
                      src={result.data.download_url}
                    />

                    {/* Info */}
                    <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                        {result.data.width &&
                          result.data.height && (
                            <span>
                              Resolution:{" "}
                              {result.data.width}×
                              {result.data.height}
                            </span>
                          )}

                        {result.data.type && (
                          <span>
                            Type: {result.data.type}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Download */}
                   <a
  href={`/api/download?url=${encodeURIComponent(
    result.data.download_url
  )}`}
  className="mt-5 flex h-14 w-full items-center justify-center rounded-2xl bg-indigo-500 font-bold transition hover:bg-indigo-400"
>
  Download Video
</a>

                    {result.data.caption && (
                      <p className="mt-5 text-sm leading-6 text-slate-400">
                        {result.data.caption}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-red-400/20 bg-red-500/5 p-6">
                  <h2 className="font-bold text-red-200">
                    Unable to process URL
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {result.message}
                  </p>
                </div>
              )}
            </div>
          )}

          <p className="mt-5 text-xs text-slate-500">
            Public and authorized content only.
          </p>
        </div>
      </section>

      {/* Platforms */}
      <section
        id="platforms"
        className="border-y border-white/10 bg-white/[0.02] px-5 py-20"
      >
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-indigo-400">
              Supported Platforms
            </p>

            <h2 className="mt-3 text-3xl font-black md:text-4xl">
              One simple tool
            </h2>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(platformInfo).map(
              ([name, info]) => (
                <div
                  key={name}
                  className="rounded-2xl border border-white/10 bg-white/5 p-7 transition hover:-translate-y-1 hover:border-indigo-400/40"
                >
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-indigo-500/10 text-xl font-black text-indigo-400">
                    {info.letter}
                  </div>

                  <h3 className="mt-5 text-xl font-bold">
                    {name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Process supported public URLs.
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-widest text-indigo-400">
            How it works
          </p>

          <h2 className="mt-3 text-4xl font-black">
            Three simple steps
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              ["01", "Paste URL", "Paste a public video URL."],
              ["02", "Process", "TumraniVid processes the URL."],
              ["03", "Download", "Preview and download the available video."],
            ].map(([number, title, description]) => (
              <div
                key={number}
                className="rounded-3xl border border-white/10 bg-white/5 p-8"
              >
                <span className="text-sm font-black text-indigo-400">
                  {number}
                </span>

                <h3 className="mt-5 text-2xl font-bold">
                  {title}
                </h3>

                <p className="mt-3 leading-7 text-slate-400">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="border-t border-white/10 bg-white/[0.02] px-5 py-24"
      >
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-widest text-indigo-400">
            FAQ
          </p>

          <h2 className="mt-3 text-4xl font-black">
            Frequently asked questions
          </h2>

          <div className="mt-10 space-y-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-bold">
                Which platforms are supported?
              </h3>

              <p className="mt-3 leading-7 text-slate-400">
                TumraniVid currently recognizes TikTok, Instagram,
                Facebook and YouTube URLs.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-bold">
                Can I process private videos?
              </h3>

              <p className="mt-3 leading-7 text-slate-400">
                No. Private, restricted or DRM-protected content
                is not supported.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-bold">
                Is the video downloaded directly?
              </h3>

              <p className="mt-3 leading-7 text-slate-400">
                TumraniVid uses an authorized media provider to
                retrieve available public content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-5 py-10">
        <div className="mx-auto max-w-6xl text-center">
          <div className="text-xl font-black">
            Tumrani<span className="text-indigo-400">Vid</span>
          </div>

          <p className="mt-3 text-sm text-slate-500">
            Fast and simple social video utility.
          </p>

          <div className="mt-5 flex justify-center gap-5 text-sm text-slate-500">
            <a href="/privacy" className="hover:text-white">
              Privacy
            </a>

            <a href="/terms" className="hover:text-white">
              Terms
            </a>
          </div>

          <p className="mt-6 text-xs text-slate-600">
            © 2026 TumraniVid. Use the service only for content you
            are authorized to process.
          </p>
        </div>
      </footer>
    </main>
  );
}

