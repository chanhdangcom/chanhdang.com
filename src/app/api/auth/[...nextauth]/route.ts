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
  callbacks: {
    async signIn({ user, account, profile }) {
      // Lưu avatar Google vào DB
      if (account?.provider === "google" && profile && user.email) {
        const picture = (profile as { picture?: string }).picture;
        if (picture) {
          try {
            const client = await clientPromise;
            const db = client.db("musicdb");
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
          } catch (error) {
            console.error("Error saving Google avatar:", error);
          }
        }
      }
      return true;
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
