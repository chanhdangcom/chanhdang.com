import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true, // Cho phép link account tự động khi email match
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login", // Redirect error về login page
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) {
        return false;
      }

      try {
        const client = await clientPromise;
        const db = client.db("musicdb");

        // Kiểm tra xem user đã tồn tại chưa
        const existingUser = await db.collection("users").findOne({
          email: user.email,
        });

        // Nếu user đã tồn tại nhưng chưa có account linked với Google
        if (existingUser && account?.provider === "google") {
          // Kiểm tra xem account đã được link chưa
          const existingAccount = await db
            .collection("accounts")
            .findOne({
              userId: existingUser._id,
              provider: "google",
            });

          // Nếu chưa có account Google, tạo mới và link
          if (!existingAccount && account) {
            await db.collection("accounts").insertOne({
              userId: existingUser._id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
            });
          }
        }

        // Lưu/cập nhật avatar Google vào DB
        if (account?.provider === "google" && profile && user.email) {
          const picture = (profile as { picture?: string }).picture;
          if (picture) {
            await db.collection("users").updateOne(
              { email: user.email },
              {
                $set: {
                  image: picture,
                  avatarUrl: picture,
                  name: user.name,
                  updatedAt: new Date(),
                },
                $setOnInsert: { createdAt: new Date() },
              },
              { upsert: true }
            );
          }
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        // Cho phép đăng nhập ngay cả khi có lỗi DB (fallback)
        return true;
      }
    },
    async jwt({ token, account, profile, user }) {
      // Khi đăng nhập lần đầu: lưu data từ Google
      if (account && profile) {
        const p = profile as { name?: string; email?: string; picture?: string };
        token.id = token.sub;
        token.name = p.name ?? token.name;
        token.picture = p.picture ?? token.picture;
        token.email = p.email ?? token.email;
      }
      // Giữ lại picture từ token (cho các request tiếp theo)
      // Nếu không có, thử lấy từ user object (từ adapter)
      if (!token.picture && user?.image) {
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || "";
        session.user.name = token.name ?? session.user.name;
        session.user.email = token.email ?? session.user.email;
        // Ưu tiên picture từ token, fallback về image từ session
        session.user.image = (token.picture as string) || session.user.image || null;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
