// /lib/initRoles.js
import connectMongo from "@/lib/mongo";
import Role from '../models/role';

async function initializeRoles() {
  try {
    if (typeof window === "undefined") {
      await connectMongo();
    }
    

    // Check if roles already exist
    const adminRole = await Role.findOne({ roleName: "admin" });
    const userRole = await Role.findOne({ roleName: "user" });

    // Insert default roles if not found
    if (!adminRole) {
      const adminRoleData = new Role({
        roleName: "admin",
        permissions: {
          admin: ["write", "read"],
          product: ["read", "write"],
          user: ["read"],
        },
      });
      await adminRoleData.save();
    }

    if (!userRole) {
      const userRoleData = new Role({
        roleName: "user",
        permissions: {
          admin: [],
          product: ["read"],
          user: ["read"],
        },
      });
      await userRoleData.save();
    }
  } catch (error) {
    console.error("Error initializing roles:", error);
  }
}

export default initializeRoles;
