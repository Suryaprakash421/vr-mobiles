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

          // Find the user - use a direct query to avoid any Prisma issues
          const users = await prisma.$queryRaw`
            SELECT * FROM User WHERE username = ${credentials.username} LIMIT 1
          `;

          const user = users.length > 0 ? users[0] : null;

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
            name: user.name,
            username: user.username,
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
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // Ensure user object exists
        if (!session.user) {
          session.user = {};
        }

        // Add user ID and username to session
        session.user.id = token.id;
        session.user.username = token.username;

        console.log("Session updated with user data:", session.user);
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
