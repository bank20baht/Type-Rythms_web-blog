import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { User } from "next-auth";
import { decode } from "next-auth/jwt";
const jwt = require("jsonwebtoken");

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
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
            const { name, email, image } = decodedAccessToken || { name: "", email: "", image: "" };

            return {
              name,
              email,
              image,
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
