import User from '../../../../models/user';

export async function GET() {
  try {
    // Find users and populate 'role' with 'roleName' and 'permissions'
    const users = await User.find()
      .populate('role', 'roleName permissions') // Populating role and permissions
      .exec();

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
