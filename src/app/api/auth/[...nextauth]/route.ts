import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

type GoogleProfile = {
  name?: string;
  email?: string;
  picture?: string;
};

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const googleProfile = profile as GoogleProfile;
        token.id = token.sub;
        token.name = googleProfile.name ?? token.name;
        token.picture = googleProfile.picture ?? token.picture;
        token.email = googleProfile.email ?? token.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const userId = typeof token.sub === "string" ? token.sub : "";
        session.user = {
          ...session.user,
          id: userId,
          name: token.name ?? session.user.name,
          email: token.email ?? session.user.email,
          image:
            typeof token.picture === "string"
              ? token.picture
              : session.user.image,
        };
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
