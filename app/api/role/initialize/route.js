// app/api/roles/initialize/route.js
import initializeRoles from '../../../../lib/initRole';

export async function GET() {
  try {
    await initializeRoles(); // Initialize roles

    return new Response(
      JSON.stringify({ message: "Roles initialized successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error initializing roles", error: error.message }),
      { status: 500 }
    );
  }
}
