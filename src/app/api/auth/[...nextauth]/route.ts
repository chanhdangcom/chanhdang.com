import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import {
  createUniqueFriendCode,
  DEFAULT_LIBRARY_VISIBILITY,
  ensureUserSocialFields,
} from "@/lib/social-graph";

/**
 * Cần có trong .env.local cho Google login:
 * - NEXTAUTH_SECRET (bất kỳ chuỗi bí mật, ví dụ: openssl rand -base64 32)
 * - NEXTAUTH_URL=http://localhost:3000 (local) hoặc https://yourdomain.com (production)
 * - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
 * Trong Google Cloud Console, thêm Authorized redirect URI: http://localhost:3000/api/auth/callback/google
 */
const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
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
    error: "/auth/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      try {
        const client = await clientPromise;
        const db = client.db("musicdb");

        const existingUser = await db.collection("users").findOne({
          email: user.email,
        });

        if (existingUser && account?.provider === "google") {
          const existingAccount = await db.collection("accounts").findOne({
            userId: existingUser._id,
            provider: "google",
          });
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

        if (account?.provider === "google" && profile && user.email) {
          const picture = (profile as { picture?: string }).picture;
          const now = new Date();
          await db.collection("users").updateOne(
            { email: user.email },
            {
              $set: {
                image: picture,
                avatarUrl: picture,
                name: user.name,
                updatedAt: now,
                lastLoginAt: now,
              },
              $setOnInsert: {
                createdAt: now,
                role: "user",
                username: user.email?.split("@")[0] || user.name || "user",
                displayName: user.name,
                friendCode: await createUniqueFriendCode(db),
                friends: [],
                incomingFriendRequests: [],
                outgoingFriendRequests: [],
                libraryVisibility: DEFAULT_LIBRARY_VISIBILITY,
                firstLoginAt: now,
              },
            },
            { upsert: true }
          );
          await db.collection("users").updateOne(
            { email: user.email, firstLoginAt: { $exists: false } },
            {
              $set: {
                firstLoginAt: now,
              },
            }
          );
          const dbUser = await db.collection("users").findOne({ email: user.email });
          await ensureUserSocialFields(db, dbUser);
        }
        return true;
      } catch (err) {
        console.error("[NextAuth] signIn callback error:", err);
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
        
        // Fetch role from database
        if (p.email) {
          try {
            const client = await clientPromise;
            const db = client.db("musicdb");
            const rawDbUser = await db.collection("users").findOne({ email: p.email });
            const dbUser = await ensureUserSocialFields(db, rawDbUser);
            if (dbUser?.role) {
              token.role = dbUser.role;
            } else {
              token.role = "user"; // Default role
            }
            token.friendCode = dbUser?.friendCode;
            token.bio = dbUser?.bio;
            token.location = dbUser?.location;
            token.favoriteGenres = dbUser?.favoriteGenres;
            token.favoriteArtists = dbUser?.favoriteArtists;
            token.libraryVisibility = dbUser?.libraryVisibility;
          } catch (error) {
            console.error("Error fetching user role:", error);
            token.role = "user"; // Default on error
          }
        }
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
        session.user.image =
          (token.picture as string) || session.user.image || null;
        // Add role to session (mở rộng kiểu session.user)
        (session.user as { role?: string }).role =
          (token.role as string) || "user";
        session.user.friendCode = (token.friendCode as string) || null;
        session.user.bio = (token.bio as string) || null;
        session.user.location = (token.location as string) || null;
        session.user.favoriteGenres = (token.favoriteGenres as string) || null;
        session.user.favoriteArtists =
          (token.favoriteArtists as string) || null;
        session.user.libraryVisibility =
          (token.libraryVisibility as string) || null;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
