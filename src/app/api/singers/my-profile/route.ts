import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getUserRole, getUserId } from "@/lib/auth-helpers";
import { normalizeDocument } from "@/lib/mongodb-helpers";
import { ObjectId } from "mongodb";

/**
 * GET /api/singers/my-profile
 * Get the current user's artist profile
 */
export async function GET(request: Request) {
  try {
    const role = await getUserRole(request);
    const userId = await getUserId(request);

    if (!role || role === "guest" || !userId) {
      return NextResponse.json(
        { error: "Bạn cần đăng nhập" },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db("musicdb");

    // Try to find profile by userId (could be string or ObjectId)
    let profile = null;

    // Try as string first
    profile = await db.collection("singers").findOne({
      addedBy: userId,
    });

    // If not found and userId is a valid ObjectId, try as ObjectId
    if (!profile && ObjectId.isValid(userId)) {
      profile = await db.collection("singers").findOne({
        addedBy: new ObjectId(userId),
      });
    }

    // Also try as string comparison (in case stored differently)
    if (!profile) {
      const allSingers = await db.collection("singers").find({}).toArray();
      profile = allSingers.find((singer) => {
        if (!singer.addedBy) return false;
        const addedByStr = String(singer.addedBy);
        const userIdStr = String(userId);
        return (
          addedByStr === userIdStr ||
          addedByStr === userId ||
          singer.addedBy === userId ||
          singer.addedBy === userIdStr
        );
      });
    }

    if (!profile) {
      return NextResponse.json(
        { error: "Không tìm thấy profile ca sĩ" },
        { status: 404 }
      );
    }

    // Normalize the document and ensure addedBy is a string
    const normalized = normalizeDocument(profile);
    if (normalized.addedBy) {
      const addedBy = normalized.addedBy;
      if (addedBy instanceof ObjectId) {
        normalized.addedBy = addedBy.toString();
      } else {
        normalized.addedBy = String(addedBy);
      }
    }

    return NextResponse.json({
      success: true,
      singer: normalized,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Lỗi khi lấy profile ca sĩ" },
      { status: 500 }
    );
  }
}

