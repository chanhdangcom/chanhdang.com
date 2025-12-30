import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Vui lòng nhập email" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Email không hợp lệ" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("musicdb");

    // Find user by email
    const user = await db.collection("users").findOne({ email });

    // Always return success to prevent email enumeration
    // In production, you would send an email here
    if (user) {
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = new Date();
      resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token expires in 1 hour

      // Save reset token to database
      await db.collection("users").updateOne(
        { _id: user._id },
        {
          $set: {
            resetToken,
            resetTokenExpiry,
          },
        }
      );

      // In production, send email with reset link:
      // const resetLink = `${process.env.NEXT_PUBLIC_URL}/${locale}/auth/reset-password?token=${resetToken}`;
      // await sendPasswordResetEmail(user.email, resetLink);

      console.log("Password reset token for", email, ":", resetToken);
      console.log(
        "Reset link:",
        `/auth/reset-password?token=${resetToken}`
      );
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message:
        "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được link đặt lại mật khẩu.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Lỗi server. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}

