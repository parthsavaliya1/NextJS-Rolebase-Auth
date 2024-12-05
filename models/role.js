import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
  roleName: { type: String, required: true, unique: true },
  permissions: {
    type: Map,
    of: [String],
    required: true,
  },
});

const Role = mongoose.models.Role || mongoose.model("Role", RoleSchema);

export default Role;