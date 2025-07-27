import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// Lấy danh sách bài hát yêu thích của user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: "Thiếu userId" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('musicdb');
    
    // Lấy danh sách bài hát yêu thích của user
    const favorites = await db.collection('favorites')
      .find({ userId })
      .toArray();

    return NextResponse.json(favorites);
  } catch (error) {
    console.error("MONGO ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
  }
}

// Thêm bài hát vào yêu thích
export async function POST(request: Request) {
  try {
    const { userId, musicId, musicData } = await request.json();
    
    if (!userId || !musicId) {
      return NextResponse.json({ error: "Thiếu userId hoặc musicId" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('musicdb');
    
    // Kiểm tra xem bài hát đã được yêu thích chưa
    const existingFavorite = await db.collection('favorites')
      .findOne({ userId, musicId });
    
    if (existingFavorite) {
      return NextResponse.json({ error: "Bài hát đã có trong danh sách yêu thích" }, { status: 400 });
    }

    // Thêm vào danh sách yêu thích
    const result = await db.collection('favorites').insertOne({
      userId,
      musicId,
      musicData,
      createdAt: new Date()
    });

    return NextResponse.json({ 
      success: true, 
      insertedId: result.insertedId 
    });
  } catch (error) {
    console.error("MONGO ERROR:", error);
    return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 });
  }
}

// Xóa bài hát khỏi yêu thích
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const musicId = searchParams.get('musicId');
    
    if (!userId || !musicId) {
      return NextResponse.json({ error: "Thiếu userId hoặc musicId" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('musicdb');
    
    const result = await db.collection('favorites')
      .deleteOne({ userId, musicId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Không tìm thấy bài hát yêu thích" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("MONGO ERROR:", error);
    return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 });
  }
} 