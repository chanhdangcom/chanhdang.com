import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2_ENDPOINT =
  "https://41c96e02c6caff9a819147b6dc119332.r2.cloudflarestorage.com";
const BUCKET = "chanhdangcom";
const PUBLIC_CDN_URL = "https://cdn.chanhdang.com";

// Kiểm tra environment variables
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey) {
  console.error(
    "R2 credentials missing:",
    !accessKeyId ? "R2_ACCESS_KEY_ID" : "R2_SECRET_ACCESS_KEY"
  );
}

const s3 = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: accessKeyId || "",
    secretAccessKey: secretAccessKey || "",
  },
});

// Endpoint GET: trả về presigned URL
export async function GET(request: Request) {
  try {
    // Kiểm tra credentials trước
    if (!accessKeyId || !secretAccessKey) {
      console.error("R2 credentials are missing!");
      return NextResponse.json(
        {
          error: "R2 credentials not configured",
          detail: "R2_ACCESS_KEY_ID or R2_SECRET_ACCESS_KEY is missing",
        },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("fileName");
    const contentType = searchParams.get("contentType");

    if (!fileName || !contentType) {
      return NextResponse.json(
        { error: "Missing fileName or contentType" },
        { status: 400 }
      );
    }

    // Sanitize fileName để tránh ký tự đặc biệt gây lỗi
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");

    const key = `music-files/${Date.now()}-${safeName}`;
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: contentType,
    });

    console.log("Creating presigned URL for:", { key, contentType, bucket: BUCKET });

    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour
    const publicUrl = `${PUBLIC_CDN_URL}/${key}`;

    console.log("Presigned URL created successfully");

    return NextResponse.json({
      success: true,
      presignedUrl,
      publicUrl,
      key,
    });
  } catch (err) {
    console.error("Upload-music error:", err);
    const errorMessage =
      err instanceof Error ? err.message : String(err);
    const errorStack = err instanceof Error ? err.stack : undefined;

    return NextResponse.json(
      {
        error: "Failed to generate presigned URL",
        detail: errorMessage,
        stack: process.env.NODE_ENV === "development" ? errorStack : undefined,
      },
      { status: 500 }
    );
  }
}
