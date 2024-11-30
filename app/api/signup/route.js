// app/api/auth/signup/route.js
import connectMongo from "@/lib/mongo";
import bcrypt from "bcryptjs";
import User from "../../../models/user";
import Role from "../../../models/role";

export async function POST(req) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return new Response(
      JSON.stringify({ message: "Email and password are required" }),
      { status: 400 }
    );
  }

  try {
    await connectMongo();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: "User already exists" }),
        { status: 400 }
      );
    }

    let roleName = "user";
    if (email.includes("psofttech")) {
      roleName = "admin";
    }

    const role = await Role.findOne({ roleName });

    if (!role) {
      return new Response(
        JSON.stringify({ message: "Role not found" }),
        { status: 400 }
      );
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      email,
      password: hashedPassword,
      role: role._id,
      createdAt: new Date(),
    });

    await newUser.save();
    return new Response(
      JSON.stringify({ message: "User created successfully" }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Something went wrong", error: error.message }),
      { status: 500 }
    );
  }
}
