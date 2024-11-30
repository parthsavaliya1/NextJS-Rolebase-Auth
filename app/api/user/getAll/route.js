import User from '../../../../models/user';

export async function GET() {
  try {
    const users = await User.find(); // Replace with your database query logic
    return new Response(JSON.stringify({ users }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response(JSON.stringify({ message: "Error fetching users" }), {
      status: 500,
    });
  }
}
