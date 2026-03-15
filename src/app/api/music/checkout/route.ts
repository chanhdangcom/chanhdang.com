import { Checkout } from "@polar-sh/nextjs";
import { NextResponse } from "next/server";

const POLAR_ACCESS_TOKEN = process.env.POLAR_ACCESS_TOKEN;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://chanhdang.com";

export const GET = POLAR_ACCESS_TOKEN
  ? Checkout({
      accessToken: POLAR_ACCESS_TOKEN,
      successUrl: `${APP_URL}/music/premium?success=1&checkout_id={CHECKOUT_ID}`,
      returnUrl: `${APP_URL}/music/premium`,
      server: process.env.NODE_ENV === "production" ? "production" : "sandbox",
      theme: "dark",
    })
  : async () =>
      NextResponse.redirect(
        `${APP_URL}/music/premium?error=polar_not_configured`,
        302
      );
