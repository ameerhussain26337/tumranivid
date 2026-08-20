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
          message: `Invalid download format: ${format}`,
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.FASTSAVER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          message: "FASTSAVER_API_KEY is missing.",
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

    const rawText = await response.text();

    console.log("========== FASTSAVER YOUTUBE DOWNLOAD ==========");
    console.log("Status:", response.status);
    console.log("Format:", format);
    console.log("URL:", url);
    console.log("Response:", rawText);
    console.log("=================================================");

    let data: any = null;

    try {
      data = JSON.parse(rawText);
    } catch {
      data = null;
    }

    if (!response.ok || !data?.ok) {
      return NextResponse.json(
        {
          success: false,
          message:
            data?.detail ||
            data?.message ||
            `FastSaver returned HTTP ${response.status}.`,
          providerStatus: response.status,
          providerResponse: data ?? rawText,
        },
        { status: 400 }
      );
    }

    if (!data.download_url) {
      return NextResponse.json(
        {
          success: false,
          message:
            "FastSaver processed the request but did not return a download URL.",
          providerResponse: data,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Download is ready.",
      data: {
        video_id: data.video_id ?? null,
        duration: data.duration ?? null,
        filename: data.filename ?? null,
        download_url: data.download_url,
        thumbnails: data.thumbnails ?? null,
        format,
      },
    });
  } catch (error) {
    console.error("YouTube download API error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to process YouTube download.",
      },
      { status: 500 }
    );
  }
}