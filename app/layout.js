import connectMongo from "@/lib/mongo";
import AuthProvider from "./Component/AuthProvider";
import { MyServerAction } from "./Component/MyApp";
import Nav from "./Component/Nav";
import "./css/style.css";
import initializeRoles from '../lib/initRole';


export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  if (typeof window === 'undefined') {
    connectMongo(); // Ensures DB is connected when rendering layout
  }
  initializeRoles();
  return (
    <html lang="en">
      <AuthProvider>
        <body className="bg-gray-100">
          <Nav />
          <MyServerAction/>
          <div className="m-2">{children}</div>
        </body>
      </AuthProvider>
    </html>
  );
}