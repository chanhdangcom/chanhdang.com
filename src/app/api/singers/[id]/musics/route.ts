import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Lấy danh sách nhạc của ca sĩ
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { params } = context;
    const { id } = await params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "ID ca sĩ không hợp lệ" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("musicdb");
    
    // Lấy thông tin ca sĩ và danh sách nhạc
    const singer = await db.collection("singers").findOne({ 
      _id: new ObjectId(id) 
    });

    if (!singer) {
      return NextResponse.json(
        { error: "Không tìm thấy ca sĩ" },
        { status: 404 }
      );
    }

    return NextResponse.json(singer.musics || []);
  } catch (error) {
    console.error("MONGO ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch singer musics" },
      { status: 500 }
    );
  }
}

// Thêm nhạc vào ca sĩ
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { params } = context;
    const { id } = await params;
    const body = await request.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "ID ca sĩ không hợp lệ" },
        { status: 400 }
      );
    }

    // Validate dữ liệu nhạc
    if (!body.title || !body.audio || !body.cover) {
      return NextResponse.json(
        { error: "Thiếu thông tin bài hát (title, audio, cover)" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("musicdb");

    // Kiểm tra ca sĩ có tồn tại không
    const singer = await db.collection("singers").findOne({ 
      _id: new ObjectId(id) 
    });

    if (!singer) {
      return NextResponse.json(
        { error: "Không tìm thấy ca sĩ" },
        { status: 404 }
      );
    }

    // Tạo bài hát mới
    const newMusic = {
      id: new ObjectId().toString(),
      ...body,
      singer: singer.singer, // Lấy tên ca sĩ từ singer record
      createdAt: new Date(),
    };

    // Thêm bài hát vào collection musics
    await db.collection("musics").insertOne(newMusic);

    // Thêm bài hát vào danh sách nhạc của ca sĩ
    await db.collection("singers").updateOne(
      { _id: new ObjectId(id) },
      { 
        $push: { musics: newMusic },
        $set: { updatedAt: new Date() }
      }
    );

    return NextResponse.json({ 
      success: true, 
      music: newMusic,
      message: "Thêm nhạc vào ca sĩ thành công" 
    });
  } catch (error) {
    console.error("MONGO ERROR:", error);
    return NextResponse.json(
      { error: "Failed to add music to singer" },
      { status: 500 }
    );
  }
}
