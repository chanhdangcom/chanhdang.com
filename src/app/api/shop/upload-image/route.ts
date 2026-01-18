import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2_ENDPOINT =
  "https://41c96e02c6caff9a819147b6dc119332.r2.cloudflarestorage.com";
const BUCKET = "chanhdangcom";
const PUBLIC_CDN_URL = "https://cdn.chanhdang.com";

const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

const s3 = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: accessKeyId || "",
    secretAccessKey: secretAccessKey || "",
  },
});

export async function GET(request: Request) {
  try {
    if (!accessKeyId || !secretAccessKey) {
      return NextResponse.json(
        { error: "R2 credentials not configured" },
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

    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `shop-products/${Date.now()}-${safeName}`;
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    const publicUrl = `${PUBLIC_CDN_URL}/${key}`;

    return NextResponse.json({
      success: true,
      presignedUrl,
      publicUrl,
      key,
    });
  } catch (error) {
    console.error("[shop/upload-image:GET]", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}
