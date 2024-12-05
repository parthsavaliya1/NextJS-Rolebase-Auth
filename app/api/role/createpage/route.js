import connectMongo from "../../../../lib/mongo";
import Role from "../../../../models/role";
export async function POST(req) {
  try {
    await connectMongo();
    const { pageName, permissions } = await req.json();
    if (!pageName || !permissions || !Array.isArray(permissions)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid request data." }),
        { status: 400 }
      );
    }
    for (let permissionData of permissions) {
        const { roleId, permissions: rolePermissions } = permissionData;
        const role = await Role.findById(roleId);
        if (!role) {
          return new Response(
            JSON.stringify({ success: false, message: `Role with ID ${roleId} not found.` }),
            { status: 404 }
          );
        }
        const updateResult = await Role.findOneAndUpdate(
          { _id: roleId },
          { $set: { [`permissions.${pageName}`]: rolePermissions } },
          { new: true }
        );
        console.log("After Update:", updateResult.permissions);
      }
    return new Response(
      JSON.stringify({ success: true, message: "Page and permissions updated successfully." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing the request:", error);
    return new Response(
      JSON.stringify({ success: false, message: "An error occurred while processing the request." }),
      { status: 500 }
    );
  }
}