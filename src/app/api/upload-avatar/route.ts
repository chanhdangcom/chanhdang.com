import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2_ENDPOINT = "https://41c96e02c6caff9a819147b6dc119332.r2.cloudflarestorage.com";
const BUCKET = "chanhdangcom";
const PUBLIC_CDN_URL = "https://cdn.chanhdang.com";

const s3 = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

// ✅ GET /api/upload-avatar?fileName=...&contentType=...
export async function GET(request: Request) {
  try {
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

    // Key trong bucket (đường dẫn lưu)
    const key = `profile-avatars/${Date.now()}-${safeName}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: contentType,
    });

    // Tạo presigned URL có hiệu lực 1 tiếng
    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    // URL public để client hiển thị ảnh sau khi upload
    const publicUrl = `${PUBLIC_CDN_URL}/${key}`;

    return NextResponse.json({
      success: true,
      presignedUrl,
      publicUrl,
      key,
    });
  } catch (err) {
    console.error("Upload-avatar error:", err);
    return NextResponse.json(
      { error: "Failed to generate presigned URL", detail: String(err) },
      { status: 500 }
    );
  }
}