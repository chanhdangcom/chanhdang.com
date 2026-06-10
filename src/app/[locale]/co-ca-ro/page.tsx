import { CaroPage } from "@/features/caro/page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Magic Caro | ChanhDang",
  description:
    "Magic Caro (5 quân liên tiếp) với AI và dùng thẻ skill đặc biệt để tạo lợi thế.",
  openGraph: {
    title: "Magic Caro | ChanhDang",
    description:
      "Magic Caro (5 quân liên tiếp) với AI và dùng thẻ skill đặc biệt để tạo lợi thế.",
    url: "https://chanhdang.com/co-ca-ro",
    siteName: "ChanhDang",
    type: "website",
  },
  metadataBase: new URL("https://chanhdang.com"),
};

export default function Page() {
  return <CaroPage />;
}
