import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { compare } from "bcrypt";

export const authOptions = {
  debug: process.env.NEXTAUTH_DEBUG === "true",
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Basic validation
          if (!credentials?.username || !credentials?.password) {
            console.log("Missing username or password");
            return null;
          }

          console.log("Looking for user with username:", credentials.username);

          // Find the user using Prisma ORM
          const user = await prisma.user.findUnique({
            where: {
              username: credentials.username,
            },
          });

          if (!user) {
            console.log("User not found for username:", credentials.username);
            return null;
          }

          console.log("Found user:", user.username, "with ID:", user.id);

          // Compare passwords
          console.log("Comparing passwords...");
          const isPasswordValid = await compare(
            credentials.password,
            user.password
          );
          console.log("Password valid:", isPasswordValid);

          if (!isPasswordValid) {
            console.log("Password is invalid");
            return null;
          }

          console.log("Authentication successful, returning user data");

          // Return user data
          return {
            id: user.id.toString(),
            name: user.name || "User",
            username: user.username,
            email: user.email || `${user.username}@example.com`,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret:
      process.env.NEXTAUTH_SECRET ||
      "a-more-secure-secret-key-for-jwt-encryption-123456789",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async jwt({ token, user, account }) {
      console.log("JWT Callback - Token before:", token);
      console.log("JWT Callback - User:", user);

      // Initial sign in
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.name = user.name;
        token.email = user.email;
      }

      console.log("JWT Callback - Token after:", token);
      return token;
    },
    async session({ session, token }) {
      console.log("Session Callback - Session before:", session);
      console.log("Session Callback - Token:", token);

      if (token) {
        // Ensure user object exists
        if (!session.user) {
          session.user = {};
        }

        // Add user ID and username to session
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.name = token.name || token.username;
        session.user.email = token.email || `${token.username}@example.com`;

        console.log("Session updated with user data:", session.user);
      }

      console.log("Session Callback - Session after:", session);
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login", // Error code passed in query string as ?error=
  },
  secret:
    process.env.NEXTAUTH_SECRET ||
    "a-more-secure-secret-key-for-jwt-encryption-123456789",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
