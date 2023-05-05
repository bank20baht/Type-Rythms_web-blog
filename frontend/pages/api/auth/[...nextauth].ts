import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { User } from "next-auth";
import { decode } from "next-auth/jwt";
const jwt = require("jsonwebtoken");

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    // ...add more providers here
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials as any;
        try {
          const res = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          });

          const tokens = await res.json();

          console.log({ tokens });

          if (res.ok && tokens) {
            const { accesstoken, refreshtoken } = tokens;
            let decodedAccessToken;

            const token = accesstoken;
            jwt.verify(
              token,
              "EiKf9vBVMW0Qiu6EWgzwU7PyCdD0BLxv7ks4kTe4fXvGPDYsS3QT3wugV4ReGopt",
              (err: any, decoded: any) => {
                if (err) {
                  throw new Error(err);
                } else {
                  console.log(
                    `User ${decoded?.name} with email ${decoded?.email} has logged in.`
                  );
                  decodedAccessToken = decoded;
                }
              }
            );
            return {
              name: decodedAccessToken?.name,
              email: decodedAccessToken?.email,
              image: decodedAccessToken?.image,
              accessToken: accesstoken,
              refreshToken: refreshtoken,
            };
          } else {
            throw new Error("Failed to log in with the given credentials.");
          }
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.user = token as any;

      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },
};

export default NextAuth(authOptions);
