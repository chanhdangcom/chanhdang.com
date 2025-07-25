import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const R2_ENDPOINT = "https://41c96e02c6caff9a819147b6dc119332.r2.cloudflarestorage.com";
const BUCKET = "chanhdangcom";
const PUBLIC_CDN_URL = "https://cdn.chanhdang.com"; // ✅ bạn dùng CDN này để public

const s3 = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const fileName = `${Date.now()}-${file.name}`;

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: `music-files/${fileName}`,
        Body: buffer,
        ContentType: file.type,
        ACL: "public-read", // tuỳ R2 config, có thể bỏ nếu R2 bucket đã public sẵn
      })
    );

    // ✅ Sử dụng PUBLIC_CDN_URL ở đây
    const publicUrl = `${PUBLIC_CDN_URL}/music-files/${fileName}`;

    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    return NextResponse.json({ error: "Upload failed", detail: String(err) }, { status: 500 });
  }
}