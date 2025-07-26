import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const R2_ENDPOINT = "https://41c96e02c6caff9a819147b6dc119332.r2.cloudflarestorage.com";
const BUCKET = "chanhdangcom";
const PUBLIC_CDN_URL = "https://cdn.chanhdang.com";

// Kiểm tra environment variables
if (!process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
  console.error("Missing R2 credentials:", {
    hasAccessKey: !!process.env.R2_ACCESS_KEY_ID,
    hasSecretKey: !!process.env.R2_SECRET_ACCESS_KEY,
  });
}

const s3 = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Kiểm tra kích thước file (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: "File too large", 
        maxSize: "50MB",
        actualSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`
      }, { status: 400 });
    }

    console.log("Uploading file:", {
      name: file.name,
      size: file.size,
      type: file.type
    });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileName = `${Date.now()}-${file.name}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: `music-files/${fileName}`,
        Body: buffer,
        ContentType: file.type,
        ACL: "public-read",
      })
    );

    const publicUrl = `${PUBLIC_CDN_URL}/music-files/${fileName}`;
    console.log("Upload successful:", publicUrl);

    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ 
      error: "Upload failed", 
      detail: String(err),
      message: err instanceof Error ? err.message : "Unknown error"
    }, { status: 500 });
  }
}