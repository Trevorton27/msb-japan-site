import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { db } from "@/lib/db";

const providers: Provider[] = [
  Google({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
  }),
  Credentials({
    name: "Email & Password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;
      const email = (credentials.email as string).toLowerCase().trim();
      const password = credentials.password as string;

      const user = await db.user.findUnique({
        where: { email },
        include: { userRoles: true },
      });
      if (!user || !user.passwordHash) return null;
      if (user.userRoles.length === 0) return null;

      const valid = await compare(password, user.passwordHash);
      if (!valid) return null;

      return { id: user.id, email: user.email, name: user.name, image: user.image };
    },
  }),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      // For Google sign-ins, only allow users who already exist with a role
      if (account?.provider === "google" && user.email) {
        const existing = await db.user.findUnique({
          where: { email: user.email.toLowerCase().trim() },
          include: { userRoles: true },
        });
        if (!existing || existing.userRoles.length === 0) {
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        const userRoles = await db.userRole.findMany({
          where: { userId: user.id },
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: { permission: true },
                },
              },
            },
          },
        });
        token.roles = userRoles.map((ur) => ur.role.name);
        token.permissions = [
          ...new Set(
            userRoles.flatMap((ur) =>
              ur.role.rolePermissions.map((rp) => rp.permission.key)
            )
          ),
        ];
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.roles = (token.roles as string[]) ?? [];
        session.user.permissions = (token.permissions as string[]) ?? [];
      }
      return session;
    },
  },
});
