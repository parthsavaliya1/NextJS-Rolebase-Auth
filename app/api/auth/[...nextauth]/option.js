import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "../../../../models/user";
import connectMongo from "@/lib/mongo";

export const options = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_Secret,
      profile(profile) {
        console.log("Profile Google: ", profile);

        let userRole = "user";

        if (profile?.email === "psofttechuser@gmail.com") {
          userRole = "admin";
        }

        connectMongo().then(async () => {
          const existingUser = await User.findOne({ email: profile.email });
        console.log(existingUser)
          if (!existingUser) {
            const newUser = new User({
              email: profile.email,
              role: userRole,
              createdAt: new Date(),
            });
            console.log(newUser)
            await newUser.save({ validateBeforeSave: false });
            console.log("New user created:", newUser);
          } else {
            if (existingUser.role !== userRole) {
              existingUser.role = userRole;
              await existingUser.save();
              console.log("User role updated:", existingUser);
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
        console.log('before user', credentials);
        const user = await User.findOne({ email: credentials.email });
        console.log('user', user);

        if (!user) {
          console.log("User not found");
          return null;
        }

        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordCorrect) {
          console.log("Invalid password");
          return null;
        }

        if (user) {
          console.log(user.role)
          if (!user.role) {
            console.log('Role missing, updating...');
            user.role = credentials.email.includes("psofttech") ? "admin" : "user";
            await user.save();
            console.log('Updated user:', user);
          } else {
            console.log('Role already set:', user.role);
          }
        }
        let userRole = user.role;
        if (credentials.email.includes("psofttech")) {
          userRole = "admin";
        } else {
          userRole = "user";
        }

        return {
          email: user.email,
          role: userRole,
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
};
