import { NextResponse } from "next/server";

type Platform = "TikTok" | "Instagram" | "Facebook" | "YouTube";

function detectPlatform(urlString: string): Platform | null {
  try {
    const url = new URL(urlString);
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
  } catch {
    return null;
  }
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
            "Media provider is not configured. Please add FASTSAVER_API_KEY.",
        },
        { status: 500 }
      );
    }

    // YouTube uses its own information endpoint.
    // Other supported platforms use the fetch endpoint.
    const endpoint =
      platform === "YouTube"
        ? "https://api.fastsaver.io/v1/youtube/info"
        : "https://api.fastsaver.io/v1/fetch";

    const providerUrl = new URL(endpoint);
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

    let providerData: any = null;

    try {
      providerData = await providerResponse.json();
    } catch {
      providerData = null;
    }

    console.log(
      "FastSaver ANALYZE response:",
      providerData
    );

    if (!providerResponse.ok || !providerData?.ok) {
      console.error(
        "FastSaver error:",
        providerData
      );

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

    // =========================
    // YOUTUBE
    // =========================

    if (platform === "YouTube") {
      return NextResponse.json({
        success: true,
        platform: "YouTube",
        url,
        status: "processed",
        downloadAvailable: true,
        message:
          "YouTube video information retrieved successfully.",
        data: {
          id: providerData.video_id ?? null,
          video_id: providerData.video_id ?? null,

          title:
            providerData.title ??
            providerData.name ??
            null,

          author:
            providerData.author ??
            providerData.channel ??
            null,

          author_url:
            providerData.author_url ??
            null,

          thumbnail:
            providerData.thumbnail ??
            providerData.thumbnails?.max ??
            providerData.thumbnails?.low ??
            null,

          duration:
            providerData.duration ??
            null,

          formats: Array.isArray(
            providerData.formats
          )
            ? providerData.formats
            : [],
        },
      });
    }

    // =========================
    // FACEBOOK / INSTAGRAM / TIKTOK
    // =========================

    /*
      FastSaver can return media like this:

      {
        ok: true,
        items: [
          {
            type: "video",
            download_url: "https://....mp4"
          }
        ]
      }

      So we find the first video inside items[].
    */

    const items = Array.isArray(providerData.items)
      ? providerData.items
      : [];

    const videoItem = items.find(
      (item: any) =>
        item?.type === "video" &&
        typeof item?.download_url === "string"
    );

    // Fallback in case provider returns download_url directly.
    const downloadUrl =
      videoItem?.download_url ??
      providerData.download_url ??
      null;

    const thumbnailUrl =
      videoItem?.thumbnail_url ??
      providerData.thumbnail_url ??
      null;

    const mediaType =
      videoItem?.type ??
      providerData.type ??
      "video";

    return NextResponse.json({
      success: true,
      platform,
      url,
      status: "processed",

      downloadAvailable: Boolean(downloadUrl),

      message:
        `${platform} video processed successfully.`,

      data: {
        id:
          providerData.id ??
          null,

        type: mediaType,

        download_url: downloadUrl,

        thumbnail_url: thumbnailUrl,

        width:
          videoItem?.width ??
          providerData.width ??
          null,

        height:
          videoItem?.height ??
          providerData.height ??
          null,

        duration:
          providerData.duration ??
          videoItem?.duration ??
          null,

        caption:
          providerData.caption ??
          null,
      },
    });
  } catch (error) {
    console.error(
      "Analyze API error:",
      error
    );

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