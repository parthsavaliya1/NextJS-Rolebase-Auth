import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const options = {
  providers: [
    GoogleProvider({
      profile(profile) {
        console.log("Profile Google: ", profile);
        let userRole = "user";
        if (profile?.email == "psofttechuser@gmail.com") {
            userRole = "admin";
        }
        return {
          ...profile,
          id: profile.sub,
          role: userRole,
        };
      },
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_Secret,
    }),
    CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          console.log('cre', credentials); // Log the credentials for debugging
          // Replace with your real authentication logic
          if (credentials.email === "parth.savaliya112@gmail.com" && credentials.password === "123456") {
            // Return user object if credentials are valid
            return { email: credentials.email };
          } else {
            return null; // Invalid credentials
          }
        },
      }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Only modify the token when the user object is available
      if (user) {
        // Set role based on the credentials or Google account email
        if (user.email === "parth.savaliya112@gmail.com") {
          token.role = "user"; // Set role for this user
        } else if (user.email === "psofttechuser@gmail.com") {
          token.role = "admin"; // Set role for this specific Google user
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role; // Assign role to session
      }
      return session;
    },
  },
};
