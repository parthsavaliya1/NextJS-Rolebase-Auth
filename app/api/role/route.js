
import { Role } from '@/models/role';
import connectMongo from '../../../lib/mongo';

export async function GET(req) {
  // Fetch roles
  try {
    await connectMongo();
    const roles = await Role.find();
    return new Response(JSON.stringify({ roles }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error fetching roles", error: error.message }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { roleId, permissions } = await req.json();
    await connectMongo();

    const role = await Role.findById(roleId);
    if (!role) {
      return new Response(JSON.stringify({ message: "Role not found" }), { status: 404 });
    }

    role.permissions = permissions; // Update permissions
    await role.save();

    return new Response(
      JSON.stringify({ message: "Role updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error updating role", error: error.message }),
      { status: 500 }
    );
  }
}
