import type { Metadata } from "next";
import { AdminPageClient } from "@/features/trangtin/components/admin-page-client";
import {
  TrangTinContent,
  TrangTinPageHeading,
  TrangTinShell,
} from "@/features/trangtin/components/trangtin-shell";
import { createTrangTinMetadata } from "@/features/trangtin/lib/seo";

export const metadata: Metadata = createTrangTinMetadata({
  title: "Manage articles",
  description: "Dashboard for managing news articles.",
  path: "/trangtin/admin",
});

export default function AdminPage() {
  return (
    <TrangTinShell>
      <TrangTinPageHeading title="Admin" hint="admin dashboard" />
      <TrangTinContent>
        <AdminPageClient />
      </TrangTinContent>
    </TrangTinShell>
  );
}
