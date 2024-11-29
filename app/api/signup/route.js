import connectMongo from "@/lib/mongo";
import bcrypt from "bcryptjs"; // for password hashing
import User from "@/models/user"; // Ensure that User model is imported

export async function POST(req) {
  const { email, password } = await req.json();
  console.log('Received request at /api/signup');

  if (!email || !password) {
    return new Response(
      JSON.stringify({ message: "Email and password are required" }),
      { status: 400 }
    );
  }

  try {
    await connectMongo();
    const existingUser = await User.findOne({ email });
    console.log('ex',existingUser)
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: "User already exists" }),
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      email,
      password: hashedPassword,
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
