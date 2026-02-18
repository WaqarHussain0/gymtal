import PAGE_ROUTES from "@/constants/page-routes.constant";
import { ILoginResponse, IUser } from "@/types/user.type";

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(
                credentials
            ): Promise<(IUser & { accessToken: string }) | null> {
                if (!credentials?.email || !credentials?.password) return null;

                const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";


                try {
                    const res = await fetch(`${baseUrl}/api/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    });

                    const data: ILoginResponse | any = await res.json();

                    if (data.error) {
                        // Throw error message so NextAuth can surface it to frontend
                        throw new Error(data?.error || "Login failed");
                    }



                    // Normal login
                    return {
                        ...data.user,
                        accessToken: data.accessToken,
                    };
                } catch (err: string | any) {
                    console.error("Authorize error:", err);
                    // Important: rethrow to send the message back to signIn() response
                    throw new Error(err || "Login failed");
                    // console.error("Authorize error:", err);
                    // return null;
                }
            },
        }),
    ],

    callbacks: {
        async signIn({ user }) {
            console.log("Callback user : ", user);
            return true;
        },

        async jwt({ token, user }) {
            if (user) {
                const customUser = user as IUser & {
                    accessToken?: string;
                };

                token.user = {
                    id: customUser.id,
                    email: customUser.email!,
                    name: customUser.name,
                    role: customUser.role,
                };

                token.accessToken = customUser.accessToken ?? null;
            }
            return token;
        },

        async session({ session, token }) {
            session.user = token.user as IUser;
            session.accessToken = token.accessToken as string;
            return session;
        },
    },

    pages: {
        signIn: PAGE_ROUTES.login,
    },

    secret: process.env.NEXTAUTH_SECRET,
};
