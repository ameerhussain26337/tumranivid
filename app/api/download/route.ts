import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mediaUrl = searchParams.get("url");

    if (!mediaUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Download URL is required.",
        },
        { status: 400 }
      );
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(mediaUrl);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid download URL.",
        },
        { status: 400 }
      );
    }

    if (
      parsedUrl.protocol !== "https:" &&
      parsedUrl.protocol !== "http:"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid media URL.",
        },
        { status: 400 }
      );
    }

    const response = await fetch(parsedUrl.toString(), {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        "Media download failed:",
        response.status,
        response.statusText
      );

      return NextResponse.json(
        {
          success: false,
          message: "Unable to retrieve the video.",
        },
        { status: 502 }
      );
    }

    const contentType =
      response.headers.get("content-type") ||
      "video/mp4";

    const contentLength =
      response.headers.get("content-length");

    const headers = new Headers();

    headers.set("Content-Type", contentType);

    headers.set(
      "Content-Disposition",
      'attachment; filename="tumranivid-video.mp4"'
    );

    if (contentLength) {
      headers.set(
        "Content-Length",
        contentLength
      );
    }

    return new NextResponse(response.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error(
      "Download route error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to download the video.",
      },
      { status: 500 }
    );
  }
}