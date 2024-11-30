import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "../../../../models/user";
import Role from "../../../../models/role";
import connectMongo from "@/lib/mongo";

export const options = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_Secret,
      profile(profile) {

        let userRole = "user";

        if (profile?.email === "psofttechuser@gmail.com") {
          userRole = "admin";
        }

        connectMongo().then(async () => {
          const existingUser = await User.findOne({ email: profile.email });
          if (!existingUser) {
            const newUser = new User({
              email: profile.email,
              role: userRole,
              createdAt: new Date(),
            });
            await newUser.save({ validateBeforeSave: false });
          } else {
            if (existingUser.role !== userRole) {
              existingUser.role = userRole;
              await existingUser.save();
            }
          }
        }).catch(error => console.error("MongoDB connection error:", error));

        return {
          ...profile,
          id: profile.sub,
          role: userRole,
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          return null;
        }

        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordCorrect) {
          return null;
        }

        if (!user.role) {
          return null;
        }

        const role = await Role.findById(user.role);

        if (!role) {
          return null;
        }

        return {
          email: user.email,
          role: role ? role.roleName : 'user',
        };
      },
    }),
  ],
  database: process.env.MONGODB_URI,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Custom login page
    error: "/error", // Custom error page (if needed)
    // After a successful login, NextAuth will redirect to the homepage by default
    // If you want to change that, you can set the redirect URL here:
    // home: "/home"  // Example, redirect to home page after successful login
  }
};
