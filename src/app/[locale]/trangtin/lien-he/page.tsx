import type { Metadata } from "next";
import {
  TrangTinContent,
  TrangTinPageHeading,
  TrangTinShell,
} from "@/features/trangtin/components/trangtin-shell";
import { SITE_NAME } from "@/features/trangtin/constants";
import { createTrangTinMetadata } from "@/features/trangtin/lib/seo";

export const metadata: Metadata = createTrangTinMetadata({
  title: "Contact",
  description: `Contact ${SITE_NAME} — email, phone and social links.`,
  path: "/trangtin/lien-he",
});

const CONTACTS = [
  {
    label: "Email",
    value: "dang@chanhdang.com",
    href: "mailto:dang@chanhdang.com",
  },
  {
    label: "Phone",
    value: "+84 079 997 9382",
    href: "tel:+840799979382",
  },
  {
    label: "Address",
    value: "Can Tho, Vietnam",
  },
];

export default function ContactPage() {
  return (
    <TrangTinShell>
      <TrangTinPageHeading title="Contact" hint="font-mono text-sm" />

      <TrangTinContent className="max-w-full">
        <div className="flex items-center justify-between p-4">
          {CONTACTS.map((item) => (
            <div key={item.label} className="space-y-1">
              <p className="font-mono text-xs text-zinc-500">{item.label}</p>
              {item.href ? (
                <a
                  href={item.href}
                  className="font-mono text-sm hover:underline"
                >
                  {item.value}
                </a>
              ) : (
                <p className="font-mono text-sm">{item.value}</p>
              )}
            </div>
          ))}
        </div>

        <form className="space-y-4 border border-dashed border-zinc-200 p-6 dark:border-zinc-900">
          <h2 className="font-mono text-lg font-semibold">Send a message</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              name="name"
              placeholder="Full name"
              required
              className="rounded-lg border border-zinc-200 bg-transparent px-3 py-2 font-mono text-sm dark:border-zinc-800"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="rounded-lg border border-zinc-200 bg-transparent px-3 py-2 font-mono text-sm dark:border-zinc-800"
            />
          </div>
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            required
            className="w-full rounded-lg border border-zinc-200 bg-transparent px-3 py-2 font-mono text-sm dark:border-zinc-800"
          />
          <textarea
            name="message"
            placeholder="Message"
            required
            rows={5}
            className="w-full rounded-lg border border-zinc-200 bg-transparent px-3 py-2 font-mono text-sm dark:border-zinc-800"
          />
          <button
            type="submit"
            className="rounded-3xl bg-zinc-900 px-5 py-2.5 font-mono text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900"
          >
            Send message
          </button>
        </form>
      </TrangTinContent>
    </TrangTinShell>
  );
}
