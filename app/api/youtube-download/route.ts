import { NextResponse } from "next/server";

const allowedFormats = [
  "144p",
  "240p",
  "360p",
  "480p",
  "720p",
  "1080p",
  "1440p",
  "2160p",
  "audio",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const url = body?.url;
    const format = body?.format;

    if (typeof url !== "string" || !url.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "YouTube URL is required.",
        },
        { status: 400 }
      );
    }

    if (
      typeof format !== "string" ||
      !allowedFormats.includes(format)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid download format.",
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
            "Media provider is not configured. Please check FASTSAVER_API_KEY.",
        },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://api.fastsaver.io/v1/youtube/download",
      {
        method: "POST",
        headers: {
          "X-Api-Key": apiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          url: url.trim(),
          format,
        }),
        cache: "no-store",
      }
    );

    let data: any = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    console.log("FastSaver YouTube download response:", data);

    if (!response.ok || !data?.ok) {
      console.error("YouTube download error:", data);

      let message = "Unable to create YouTube download.";

      if (typeof data?.detail === "string") {
        message = data.detail;
      } else if (Array.isArray(data?.detail)) {
        message = data.detail
          .map((item: any) => item?.msg || "")
          .filter(Boolean)
          .join(", ");
      } else if (typeof data?.message === "string") {
        message = data.message;
      }

      return NextResponse.json(
        {
          success: false,
          message,
        },
        {
          status:
            response.status >= 400
              ? response.status
              : 502,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Download is ready.",
      data: {
        video_id: data.video_id ?? null,
        duration: data.duration ?? null,
        filename: data.filename ?? null,
        download_url: data.download_url ?? null,
        thumbnails: data.thumbnails ?? null,
        format,
      },
    });
  } catch (error) {
    console.error(
      "YouTube download API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to process YouTube download. Please try again.",
      },
      { status: 500 }
    );
  }
}