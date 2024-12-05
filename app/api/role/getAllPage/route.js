// import connectMongo from "../../../../lib/mongo";
import Role from "../../../../models/role";

export async function GET() {
  try {
    // Connect to the MongoDB database
    // await connectMongo();

    // Query all unique page names from the Role collection
    const roles = await Role.find({}, "permissions").lean();

    // Extract unique page names from the permissions field
    const pages = new Set();
    roles.forEach((role) => {
      if (role.permissions) {
        Object.keys(role.permissions).forEach((pageName) => pages.add(pageName));
      }
    });

    // Convert the Set to an Array for JSON response
    return new Response(
      JSON.stringify({ success: true, pages: Array.from(pages) }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching pages:", error);
    return new Response(
      JSON.stringify({ success: false, message: "An error occurred while fetching pages." }),
      { status: 500 }
    );
  }
}
