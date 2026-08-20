import { NextResponse } from "next/server";

type Platform = "TikTok" | "Instagram" | "Facebook" | "YouTube";

function detectPlatform(urlString: string): Platform | null {
  let url: URL;

  try {
    url = new URL(urlString);
  } catch {
    return null;
  }

  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");

  // TikTok
  if (
    hostname === "tiktok.com" ||
    hostname.endsWith(".tiktok.com")
  ) {
    return "TikTok";
  }

  // Instagram
  if (
    hostname === "instagram.com" ||
    hostname.endsWith(".instagram.com")
  ) {
    return "Instagram";
  }

  // Facebook
  if (
    hostname === "facebook.com" ||
    hostname.endsWith(".facebook.com") ||
    hostname === "fb.watch"
  ) {
    return "Facebook";
  }

  // YouTube
  if (
    hostname === "youtube.com" ||
    hostname.endsWith(".youtube.com") ||
    hostname === "youtu.be"
  ) {
    return "YouTube";
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawUrl = body?.url;

    // Check URL exists
    if (typeof rawUrl !== "string" || !rawUrl.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a video URL.",
        },
        { status: 400 }
      );
    }

    const url = rawUrl.trim();

    // Maximum URL length
    if (url.length > 2048) {
      return NextResponse.json(
        {
          success: false,
          message: "The URL is too long.",
        },
        { status: 400 }
      );
    }

    // Validate URL
    let parsedUrl: URL;

    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid URL.",
        },
        { status: 400 }
      );
    }

    // Only HTTP/HTTPS
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only HTTP and HTTPS URLs are supported.",
        },
        { status: 400 }
      );
    }

    // Detect platform
    const platform = detectPlatform(url);

    if (!platform) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This platform is not currently supported. Supported platforms: TikTok, Instagram, Facebook and YouTube.",
        },
        { status: 400 }
      );
    }

    // API Key
    const apiKey = process.env.FASTSAVER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Media provider is not configured. Please add FASTSAVER_API_KEY to .env.local.",
        },
        { status: 500 }
      );
    }

    // FastSaver API
    const providerUrl = new URL(
      "https://api.fastsaver.io/v1/fetch"
    );

    providerUrl.searchParams.set("url", url);

    const providerResponse = await fetch(
      providerUrl.toString(),
      {
        method: "GET",
        headers: {
          "X-Api-Key": apiKey,
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    // Read provider response
    let providerData: any = null;

    try {
      providerData = await providerResponse.json();
    } catch {
      providerData = null;
    }

    // Provider error
    if (!providerResponse.ok || !providerData?.ok) {
      console.error("FastSaver error:", providerData);

      return NextResponse.json(
        {
          success: false,
          platform,
          message:
            providerData?.detail ||
            providerData?.message ||
            `Unable to process this ${platform} URL.`,
        },
        {
          status:
            providerResponse.status >= 400
              ? providerResponse.status
              : 502,
        }
      );
    }

    // Success
    return NextResponse.json({
      success: true,
      platform,
      url,
      status: "processed",

      downloadAvailable: Boolean(
        providerData.download_url
      ),

      message: `${platform} video processed successfully.`,

      data: {
        id: providerData.id ?? null,
        type: providerData.type ?? null,
        download_url:
          providerData.download_url ?? null,
        thumbnail_url:
          providerData.thumbnail_url ?? null,
        width: providerData.width ?? null,
        height: providerData.height ?? null,
        duration: providerData.duration ?? null,
        caption: providerData.caption ?? null,
      },
    });
  } catch (error) {
    console.error("Analyze API error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to process the request. Please try again.",
      },
      { status: 500 }
    );
  }
}