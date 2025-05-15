import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../../lib/prisma";
import { compare } from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log(
          "Authorize function called with credentials:",
          credentials?.username
        );

        if (!credentials?.username || !credentials?.password) {
          console.log("Missing username or password");
          return null;
        }

        try {
          console.log("Looking for user with username:", credentials.username);

          const user = await prisma.user.findUnique({
            where: {
              username: credentials.username,
            },
          });

          if (!user) {
            console.log("User not found for username:", credentials.username);
            return null;
          }

          // For debugging
          console.log("Found user:", user.username, "with ID:", user.id);

          try {
            // Compare passwords
            console.log("Comparing passwords...");
            const isPasswordValid = await compare(
              credentials.password,
              user.password
            );
            console.log("Password comparison result:", isPasswordValid);

            if (!isPasswordValid) {
              console.log("Password is invalid");
              return null;
            }

            console.log("Authentication successful for user:", user.username);
            return {
              id: user.id.toString(),
              name: user.name,
              username: user.username,
            };
          } catch (passwordError) {
            console.error("Password comparison error:", passwordError);
            return null;
          }
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
