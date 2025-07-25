import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export default async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('musicdb'); // Nếu bạn muốn chỉ định tên DB: client.db('ten_db')
    const musics = await db.collection('musics').find({}).toArray();
    return NextResponse.json(musics);
  } catch (error) {
    console.error("MONGO ERROR:", error); // Dòng này để xem lỗi chi tiết
    return NextResponse.json({ error: "Failed to fetch musics" }, { status: 500 });
  }
}
