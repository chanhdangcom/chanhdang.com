import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helpers";

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: String(currentUser._id ?? ""),
        username: String(currentUser.username ?? ""),
        email: String(currentUser.email ?? ""),
        friendCode: String(currentUser.friendCode ?? ""),
        displayName: String(
          currentUser.displayName ?? currentUser.username ?? ""
        ),
        bio: String(currentUser.bio ?? ""),
        avatarUrl: String(currentUser.avatarUrl ?? currentUser.image ?? ""),
        location: String(currentUser.location ?? ""),
        favoriteGenres: String(currentUser.favoriteGenres ?? ""),
        favoriteArtists: String(currentUser.favoriteArtists ?? ""),
      },
    });
  } catch (error) {
    console.error("[users:me] ERROR", error);
    return NextResponse.json(
      { error: "Failed to fetch current user" },
      { status: 500 }
    );
  }
}
