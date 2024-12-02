import Role from '../../../../models/role';

export async function GET() {
  try {
    const roles = await Role.find();
    return new Response(JSON.stringify({ roles }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching roles:", error);
    return new Response(JSON.stringify({ message: "Error fetching roles" }), {
      status: 500,
    });
  }
}
