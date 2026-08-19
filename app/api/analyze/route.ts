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

  if (
    hostname === "tiktok.com" ||
    hostname.endsWith(".tiktok.com")
  ) {
    return "TikTok";
  }

  if (
    hostname === "instagram.com" ||
    hostname.endsWith(".instagram.com")
  ) {
    return "Instagram";
  }

  if (
    hostname === "facebook.com" ||
    hostname.endsWith(".facebook.com") ||
    hostname === "fb.watch"
  ) {
    return "Facebook";
  }

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

    if (url.length > 2048) {
      return NextResponse.json(
        {
          success: false,
          message: "The URL is too long.",
        },
        { status: 400 }
      );
    }

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

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only HTTP and HTTPS URLs are supported.",
        },
        { status: 400 }
      );
    }

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
        },
        cache: "no-store",
      }
    );

    let providerData: any = null;

    try {
      providerData = await providerResponse.json();
    } catch {
      providerData = null;
    }

    if (!providerResponse.ok || !providerData?.ok) {
      return NextResponse.json(
        {
          success: false,
          platform,
          message:
            providerData?.detail ||
            "The media provider could not process this URL.",
        },
        { status: providerResponse.status || 502 }
      );
    }

    return NextResponse.json({
      success: true,
      platform,
      url,
      status: "processed",
      downloadAvailable: Boolean(providerData.download_url),
      message: `${platform} video processed successfully.`,
      data: {
        id: providerData.id,
        type: providerData.type,
        download_url: providerData.download_url,
        thumbnail_url: providerData.thumbnail_url,
        width: providerData.width,
        height: providerData.height,
        duration: providerData.duration,
        caption: providerData.caption,
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