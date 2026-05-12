import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth-helpers";
import type { ChatAction } from "@/lib/chatbot/contracts";

const COLLECTION = "chatbot_history";
const MAX_MESSAGES = 120;
const MAX_CONTENT_LENGTH = 12000;

type StoredMessage = {
  id: string;
  role: "user" | "bot";
  content: string;
  actions?: ChatAction[];
};

function sanitizeMessages(raw: unknown): StoredMessage[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  const slice = raw.slice(-MAX_MESSAGES);
  const out: StoredMessage[] = [];

  for (let i = 0; i < slice.length; i++) {
    const item = slice[i];
    if (!item || typeof item !== "object") {
      continue;
    }
    const o = item as Record<string, unknown>;
    const role = o.role === "user" || o.role === "bot" ? o.role : null;
    if (!role) {
      continue;
    }
    const id = typeof o.id === "string" && o.id.length > 0 ? o.id : `msg-${i}`;
    const content =
      typeof o.content === "string"
        ? o.content.slice(0, MAX_CONTENT_LENGTH)
        : "";

    const next: StoredMessage = { id, role, content };

    if (Array.isArray(o.actions) && o.actions.length > 0) {
      next.actions = o.actions.slice(0, 20) as ChatAction[];
    }

    out.push(next);
  }

  return out;
}

/** GET — lấy lịch sử chat của user đang đăng nhập */
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = String(user._id);
    const client = await clientPromise;
    const db = client.db("musicdb");
    const doc = await db.collection(COLLECTION).findOne<{ messages?: StoredMessage[] }>({
      userId,
    });

    return NextResponse.json({ messages: doc?.messages ?? [] });
  } catch (error) {
    console.error("[chatbot-history] GET", error);
    return NextResponse.json({ error: "Failed to load history" }, { status: 500 });
  }
}

/** PUT — lưu / cập nhật toàn bộ lịch sử (thay thế) */
export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = String(user._id);
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const rawMessages = (body as { messages?: unknown })?.messages;
    const messages = sanitizeMessages(rawMessages);

    const client = await clientPromise;
    const db = client.db("musicdb");
    const now = new Date();

    await db.collection(COLLECTION).updateOne(
      { userId },
      {
        $set: {
          userId,
          messages,
          updatedAt: now,
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[chatbot-history] PUT", error);
    return NextResponse.json({ error: "Failed to save history" }, { status: 500 });
  }
}
