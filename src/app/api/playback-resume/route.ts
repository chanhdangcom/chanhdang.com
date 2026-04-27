import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth-helpers";

type PlaybackResumePayload = {
  musicId?: unknown;
  musicData?: unknown;
  positionSec?: unknown;
  durationSec?: unknown;
};

const MIN_RESUME_POSITION_SEC = 5;
const MIN_REMAINING_DURATION_SEC = 10;

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("musicdb");
    const resume = await db.collection("playback_resume").findOne({
      userId: String(currentUser._id),
    });

    return NextResponse.json({
      resume: resume
        ? {
            musicId:
              typeof resume.musicId === "string" ? resume.musicId : undefined,
            musicData: resume.musicData ?? null,
            positionSec:
              typeof resume.positionSec === "number" ? resume.positionSec : 0,
            durationSec:
              typeof resume.durationSec === "number"
                ? resume.durationSec
                : undefined,
            updatedAt: resume.updatedAt ?? null,
          }
        : null,
    });
  } catch (error) {
    console.error("[playback-resume:GET] ERROR", error);
    return NextResponse.json(
      { error: "Failed to fetch playback resume" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as PlaybackResumePayload;
    const musicId =
      typeof body.musicId === "string" ? body.musicId.trim() : "";
    const positionSec =
      typeof body.positionSec === "number" && Number.isFinite(body.positionSec)
        ? Math.max(0, body.positionSec)
        : NaN;
    const durationSec =
      typeof body.durationSec === "number" && Number.isFinite(body.durationSec)
        ? Math.max(0, body.durationSec)
        : undefined;

    if (!musicId || !Number.isFinite(positionSec)) {
      return NextResponse.json(
        { error: "Missing musicId or positionSec" },
        { status: 400 }
      );
    }

    if (
      positionSec < MIN_RESUME_POSITION_SEC ||
      (durationSec !== undefined &&
        durationSec - positionSec < MIN_REMAINING_DURATION_SEC)
    ) {
      const client = await clientPromise;
      const db = client.db("musicdb");
      await db.collection("playback_resume").deleteOne({
        userId: String(currentUser._id),
      });
      return NextResponse.json({ success: true, cleared: true });
    }

    const normalizedMusicData =
      body.musicData && typeof body.musicData === "object" ? body.musicData : null;

    const client = await clientPromise;
    const db = client.db("musicdb");
    const now = new Date();

    await db.collection("playback_resume").updateOne(
      { userId: String(currentUser._id) },
      {
        $set: {
          userId: String(currentUser._id),
          musicId,
          musicData: normalizedMusicData,
          positionSec,
          durationSec,
          updatedAt: now,
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, updatedAt: now });
  } catch (error) {
    console.error("[playback-resume:PUT] ERROR", error);
    return NextResponse.json(
      { error: "Failed to save playback resume" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("musicdb");
    await db.collection("playback_resume").deleteOne({
      userId: String(currentUser._id),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[playback-resume:DELETE] ERROR", error);
    return NextResponse.json(
      { error: "Failed to delete playback resume" },
      { status: 500 }
    );
  }
}
