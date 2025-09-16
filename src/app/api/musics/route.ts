import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("musicdb"); // Nếu bạn muốn chỉ định tên DB: client.db('ten_db')
    const musics = await db.collection("musics").find({}).toArray();
    return NextResponse.json(musics);
  } catch (error) {
    console.error("MONGO ERROR:", error); // Dòng này để xem lỗi chi tiết
    return NextResponse.json(
      { error: "Failed to fetch musics" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Validate dữ liệu đầu vào ở đây nếu cần
    const client = await clientPromise;
    const db = client.db("musicdb");
    const result = await db.collection("musics").insertOne(body);
    return NextResponse.json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    console.error("MONGO ERROR:", error);
    return NextResponse.json({ error: "Failed to add music" }, { status: 500 });
  }
}
