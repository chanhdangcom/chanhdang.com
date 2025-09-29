import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Lấy thông tin ca sĩ theo ID
export async function GET(
  request: Request,
  context: unknown
) {
  try {
    const { params } = context as { params: { id: string } };
    const { id } = params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "ID ca sĩ không hợp lệ" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("musicdb");
    const singer = await db.collection("singers").findOne({ 
      _id: new ObjectId(id) 
    });

    if (!singer) {
      return NextResponse.json(
        { error: "Không tìm thấy ca sĩ" },
        { status: 404 }
      );
    }

    return NextResponse.json(singer);
  } catch (error) {
    console.error("MONGO ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch singer" },
      { status: 500 }
    );
  }
}

// Cập nhật thông tin ca sĩ
export async function PUT(
  request: Request,
  context: unknown
) {
  try {
    const { params } = context as { params: { id: string } };
    const { id } = params;
    // const body = await request.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "ID ca sĩ không hợp lệ" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("musicdb");

    // Kiểm tra ca sĩ có tồn tại không
    const existingSinger = await db.collection("singers").findOne({ 
      _id: new ObjectId(id) 
    });

    if (!existingSinger) {
      return NextResponse.json(
        { error: "Không tìm thấy ca sĩ" },
        { status: 404 }
      );
    }

    // Cập nhật thông tin ca sĩ
    // const result = await db.collection("singers").updateOne(
    //   { _id: new ObjectId(id) },
    //   { $set: body }
    // );

    return NextResponse.json({ 
      success: true, 
      message: "Cập nhật ca sĩ thành công" 
    });
  } catch (error) {
    console.error("MONGO ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update singer" },
      { status: 500 }
    );
  }
}

// Xóa ca sĩ
export async function DELETE(
  request: Request,
  context: unknown
) {
  try {
    const { params } = context as { params: { id: string } };
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "ID ca sĩ không hợp lệ" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("musicdb");

    const result = await db.collection("singers").deleteOne({ 
      _id: new ObjectId(id) 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Không tìm thấy ca sĩ" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Xóa ca sĩ thành công" 
    });
  } catch (error) {
    console.error("MONGO ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete singer" },
      { status: 500 }
    );
  }
}
