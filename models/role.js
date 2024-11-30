// app/models/role.js
import mongoose from "mongoose";

const PermissionSchema = new mongoose.Schema({
  admin: { type: [String], required: true },
  product: { type: [String], required: true },
  user: { type: [String], required: true },
});

const RoleSchema = new mongoose.Schema({
  roleName: { type: String, required: true, unique: true },
  permissions: { type: PermissionSchema, required: true },
});

const Role = mongoose.models?.Role || mongoose.model("Role", RoleSchema);

export default Role;
