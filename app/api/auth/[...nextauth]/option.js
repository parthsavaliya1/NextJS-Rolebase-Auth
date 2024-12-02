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
      profile: async (profile) => {
        let userRoleName = "user";
        if (profile?.email === "psofttechuser@gmail.com") {
          userRoleName = "admin";
        }
        await connectMongo();
        const role = await Role.findOne({ roleName: userRoleName });
        if (!role) {
          console.error(`Role ${userRoleName} not found in the database.`);
          return {
            ...profile,
            id: profile.sub,
            role: userRoleName,
          };
        }
      
        const existingUser = await User.findOne({ email: profile.email });
        if (!existingUser) {
          const newUser = new User({
            email: profile.email,
            role: role._id,
            createdAt: new Date(),
          });
          await newUser.save({ validateBeforeSave: false });
        } else {
          if (existingUser.role.toString() !== role._id.toString()) {
            existingUser.role = role._id;
            await existingUser.save();
          }
        }
      
        return {
          ...profile,
          id: profile.sub,
          role: userRoleName,
          permissions: role.permissions,
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
          permissions: role.permissions,
        };
      },
    }),
  ],
  database: process.env.MONGODB_URI,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.permissions = user.permissions;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.permissions = token.permissions;
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
