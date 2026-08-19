import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoUrl = searchParams.get("url");

    if (!videoUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Download URL is missing.",
        },
        { status: 400 }
      );
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(videoUrl);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid video URL.",
        },
        { status: 400 }
      );
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid video URL.",
        },
        { status: 400 }
      );
    }

    const response = await fetch(videoUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Unable to download the video.",
        },
        { status: response.status }
      );
    }

    const contentType =
      response.headers.get("content-type") || "video/mp4";

    const contentLength =
      response.headers.get("content-length");

    const headers = new Headers();

    headers.set("Content-Type", contentType);
    headers.set(
      "Content-Disposition",
      'attachment; filename="quickvid-video.mp4"'
    );
    headers.set("Cache-Control", "no-store");

    if (contentLength) {
      headers.set("Content-Length", contentLength);
    }

    return new NextResponse(response.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Download API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to download the video.",
      },
      { status: 500 }
    );
  }
}