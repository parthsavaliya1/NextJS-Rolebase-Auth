'use client'
import { useState, useEffect } from "react";

export default function RoleManagement() {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [updatedPermissions, setUpdatedPermissions] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // Fetch roles from your backend
    fetch("/api/role/initialize")
      .then((res) => res.json())
      .then((data) => setRoles(data.roles));

    // Fetch users from your backend
    fetch("/api/user/getAll") // Endpoint to fetch users
      .then((res) => res.json())
      .then((data) => setUsers(data.users));
  }, []);

  const handlePermissionChange = (page, permission) => {
    setUpdatedPermissions((prev) => ({
      ...prev,
      [page]: prev[page]?.includes(permission)
        ? prev[page].filter((perm) => perm !== permission)
        : [...(prev[page] || []), permission],
    }));
  };

  const handleSave = () => {
    // Save the updated role and permissions
    fetch("/api/role/initialize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roleId: selectedRole._id, permissions: updatedPermissions }),
    }).then(() => alert("Permissions updated!"));
  };

  const handleUserRoleChange = (userId, roleId) => {
    // Update the user role
    fetch(`/api/user/updateRole/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roleId }),
    }).then(() => alert("User role updated!"));
  };

  const handleUserPermissionsChange = (userId, permissions) => {
    // Update user permissions
    fetch(`/api/user/updatePermissions/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ permissions }),
    }).then(() => alert("User permissions updated!"));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Role Management</h1>

      {/* User Table */}
      <h2 className="text-xl font-medium mb-3">Users</h2>
      <table className="min-w-full table-auto border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left font-semibold text-gray-600">Username</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-600">Email</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-600">Role</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-600">Permissions</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user._id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{user.username}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">
                <select
                  value={user.roleId}
                  onChange={(e) => handleUserRoleChange(user._id, e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded-md"
                >
                  <option value="">Select Role</option>
                  {roles?.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.roleName}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-2">
                {user.permissions?.map((perm, index) => (
                  <span key={index} className="mr-2 inline-block">{perm}</span>
                ))}
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => setSelectedUser(user)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit Permissions
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Selected User's Permissions */}
      {selectedUser && (
        <div className="mt-6 p-4 border border-gray-300 rounded-lg">
          <h2 className="text-xl font-medium mb-4">Edit Permissions for {selectedUser.username}</h2>
          {Object.entries(selectedUser.permissions || {}).map(([page, permissions]) => (
            <div key={page} className="mb-4">
              <h3 className="text-lg font-semibold mb-2">{page}</h3>
              {["read", "write", "access"].map((perm) => (
                <label key={perm} className="inline-flex items-center mr-4">
                  <input
                    type="checkbox"
                    checked={permissions.includes(perm)}
                    onChange={() => handlePermissionChange(page, perm)}
                    className="mr-2"
                  />
                  {perm}
                </label>
              ))}
            </div>
          ))}
          <button
            onClick={() => handleUserPermissionsChange(selectedUser._id, updatedPermissions)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save User Permissions
          </button>
        </div>
      )}
    </div>
  );
}
