import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// Lấy danh sách tất cả ca sĩ
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("musicdb");
    const singers = await db.collection("singers").find({}).toArray();
    // Chuyển đổi _id từ ObjectId sang string để đảm bảo tương thích
    const singersWithStringId = singers.map((singer) => ({
      ...singer,
      _id: singer._id.toString(),
      id: singer._id.toString(), // Thêm cả field id để tương thích
    }));
    return NextResponse.json(singersWithStringId);
  } catch (error) {
    console.error("MONGO ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch singers" },
      { status: 500 }
    );
  }
}

// Thêm ca sĩ mới
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate dữ liệu đầu vào
    if (!body.singer || !body.cover) {
      return NextResponse.json(
        { error: "Thiếu thông tin ca sĩ hoặc ảnh bìa" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("musicdb");
    
    // Kiểm tra xem ca sĩ đã tồn tại chưa
    const existingSinger = await db.collection("singers").findOne({ 
      singer: body.singer 
    });
    
    if (existingSinger) {
      return NextResponse.json(
        { error: "Ca sĩ đã tồn tại" },
        { status: 400 }
      );
    }

    // Tạo ca sĩ mới với danh sách nhạc rỗng
    const newSinger = {
      ...body,
      musics: [], // Danh sách nhạc ban đầu rỗng
      createdAt: new Date(),
    };

    const result = await db.collection("singers").insertOne(newSinger);
    
    return NextResponse.json({ 
      success: true, 
      insertedId: result.insertedId 
    });
  } catch (error) {
    console.error("MONGO ERROR:", error);
    return NextResponse.json(
      { error: "Failed to add singer" }, 
      { status: 500 }
    );
  }
}
