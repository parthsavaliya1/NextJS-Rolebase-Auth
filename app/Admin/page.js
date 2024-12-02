"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import Next.js router
import Link from "next/link";

export default function RoleManagement() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    fetch("/api/user/getAll")
      .then((res) => res.json())
      .then((data) => setUsers(data.users));

    fetch('/api/role/getAllRole') // Adjust the API endpoint as necessary
      .then((res) => res.json())
      .then((data) => setRoles(data.roles));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">Role Management</h1>

      {/* Users Table */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Users</h2>
      <table className="min-w-full table-auto border-collapse border border-gray-200 shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="px-6 py-3 text-left font-medium">Email</th>
            <th className="px-6 py-3 text-left font-medium">Role</th>
            <th className="px-6 py-3 text-left font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user._id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">{user?.role?.roleName}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => router.push(`/Admin/edit-user/role/${user._id}`)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                >
                  Edit Role
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Roles Table */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 mt-8">Roles</h2>
      
      {/* Add Role Button */}
      <div className="mb-4">
        <button
          onClick={() => router.push('/Admin/createrole')} // Navigate to the create role page
          className="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          Add Role
        </button>
      </div>

      <table className="min-w-full table-auto border-collapse border border-gray-200 shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="px-6 py-3 text-left font-medium">Role Name</th>
            <th className="px-6 py-3 text-left font-medium">Edit Role</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role._id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4">{role.roleName}</td>
              <td className="px-6 py-4">
                <Link href={`/Admin/edit-user/permission/${role._id}`}>
                  <button className="px-4 py-2 text-white bg-blue-600 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
                    Edit Permission
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
