// app/api/auth/create-password/route.js (for Next.js 13 app directory)

import bcrypt from 'bcryptjs';
import User from '../../../models/user';

export async function POST(req) {
  try {

    const { email, password } = await req.json();  // Get JSON from the request

    // Check if email exists
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
      });
    }

    // Hash password and update the user record
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return new Response(
      JSON.stringify({ message: 'Password set successfully' }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
