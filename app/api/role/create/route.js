import Role from "../../../../models/role";
export async function POST(req) {
    const { roleName, permissions } = await req.json(); // Parse the request body
  
    if (!roleName || !permissions) {
      return new Response(
        JSON.stringify({ message: "Role name and permissions are required." }),
        { status: 400 }
      );
    }  
    try {
      // Create a new role
      const newRole = new Role({ roleName, permissions });
      await newRole.save();
  
      return new Response(
        JSON.stringify({ message: "Role created successfully.", role: newRole }),
        { status: 201 }
      );
    } catch (error) {
      if (error.code === 11000) {
        return new Response(
          JSON.stringify({ message: "Role name already exists." }),
          { status: 409 }
        );
      }
  
      console.error("Error creating role:", error);
      return new Response(
        JSON.stringify({ message: "Internal server error." }),
        { status: 500 }
      );
    }
  }
