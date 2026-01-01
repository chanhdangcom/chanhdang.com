import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

// Simple in-memory rate limiting (in production, use Redis or similar)
const loginAttempts = new Map<string, { count: number; resetTime: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

function getRateLimitKey(identifier: string): string {
  return `login:${identifier}`;
}

function checkRateLimit(identifier: string): { allowed: boolean; remainingTime?: number } {
  const key = getRateLimitKey(identifier);
  const attempt = loginAttempts.get(key);

  if (!attempt) {
    return { allowed: true };
  }

  const now = Date.now();

  // Reset if lockout period has passed
  if (now > attempt.resetTime) {
    loginAttempts.delete(key);
    return { allowed: true };
  }

  // Check if locked out
  if (attempt.count >= MAX_ATTEMPTS) {
    const remainingTime = Math.ceil((attempt.resetTime - now) / 1000 / 60); // minutes
    return { allowed: false, remainingTime };
  }

  return { allowed: true };
}

function recordFailedAttempt(identifier: string) {
  const key = getRateLimitKey(identifier);
  const attempt = loginAttempts.get(key);

  if (!attempt) {
    loginAttempts.set(key, {
      count: 1,
      resetTime: Date.now() + LOCKOUT_DURATION,
    });
  } else {
    attempt.count += 1;
    if (attempt.count >= MAX_ATTEMPTS) {
      attempt.resetTime = Date.now() + LOCKOUT_DURATION;
    }
  }
}

function clearRateLimit(identifier: string) {
  const key = getRateLimitKey(identifier);
  loginAttempts.delete(key);
}

export async function POST(request: Request) {
  try {
    const { username, password, rememberMe } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ thông tin" },
        { status: 400 }
      );
    }

    // Check rate limiting
    const rateLimit = checkRateLimit(username);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Tài khoản tạm thời bị khóa do quá nhiều lần đăng nhập sai. Vui lòng thử lại sau ${rateLimit.remainingTime} phút.`,
        },
        { status: 429 }
      );
    }

    const client = await clientPromise;
    const db = client.db("musicdb");
    const user = await db.collection("users").findOne({ username });

    if (!user) {
      recordFailedAttempt(username);
      return NextResponse.json(
        { error: "Sai tài khoản hoặc mật khẩu" },
        { status: 400 }
      );
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      recordFailedAttempt(username);
      return NextResponse.json(
        { error: "Sai tài khoản hoặc mật khẩu" },
        { status: 400 }
      );
    }

    // Clear rate limit on successful login
    clearRateLimit(username);

    // Update last login time
    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          lastLoginAt: new Date(),
        },
      }
    );

    // Return user info (never return password)
    return NextResponse.json({
      success: true,
      user: {
        id: String(user._id),
        username: user.username,
        displayName: user.displayName || user.username,
        avatarUrl: user.avatarUrl,
        email: user.email,
        role: user.role || "user", // Default to "user" if role not set
      },
      rememberMe,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Lỗi server. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
