import { Webhooks } from "@polar-sh/nextjs";
import { NextResponse } from "next/server";

const POLAR_WEBHOOK_SECRET = process.env.POLAR_WEBHOOK_SECRET;

/**
 * Polar webhook: khi subscription active hoặc order paid,
 * cập nhật trạng thái Premium cho user (DB hoặc cache).
 * customerExternalId = user id trong hệ thống.
 */
export const POST = POLAR_WEBHOOK_SECRET
  ? Webhooks({
      webhookSecret: POLAR_WEBHOOK_SECRET,
      onSubscriptionActive: async (payload) => {
        // TODO: Gọi API nội bộ hoặc DB để set premium cho user
        // const customerId = payload.customerExternalId ?? payload.customer?.externalId;
        console.log("[Polar] Subscription active", payload);
      },
      onOrderPaid: async (payload) => {
        // TODO: Gọi API nội bộ hoặc DB để set premium cho user
        console.log("[Polar] Order paid", payload);
      },
    })
  : async () =>
      NextResponse.json(
        { error: "Webhook not configured" },
        { status: 503 }
      );
