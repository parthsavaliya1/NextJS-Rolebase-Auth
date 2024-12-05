"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RoleManagement() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/user/getAll")
      .then((res) => res.json())
      .then((data) => setUsers(data.users));

    fetch("/api/role/getAllRole")
      .then((res) => res.json())
      .then((data) => setRoles(data.roles));
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 text-center">Role Management</h1>

      {/* Users Table */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Users</h2>
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead className="bg-gray-200 text-gray-800">
              <tr>
                <th className="px-6 py-4 text-left font-semibold uppercase text-sm">Email</th>
                <th className="px-6 py-4 text-left font-semibold uppercase text-sm">Role</th>
                <th className="px-6 py-4 text-left font-semibold uppercase text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-100 transition-colors"
                >
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user?.role?.roleName}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => router.push(`/admin/edit-user/role/${user._id}`)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition"
                    >
                      Edit Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Roles Table */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Roles</h2>
          <button
            onClick={() => router.push("/admin/createrole")}
            className="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition"
          >
            Add Role
          </button>
        </div>
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead className="bg-gray-200 text-gray-800">
              <tr>
                <th className="px-6 py-4 text-left font-semibold uppercase text-sm">Role Name</th>
                <th className="px-6 py-4 text-left font-semibold uppercase text-sm">Edit Permission</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr
                  key={role._id}
                  className="border-b hover:bg-gray-100 transition-colors"
                >
                  <td className="px-6 py-4">{role.roleName}</td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/edit-user/permission/${role._id}`}>
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition">
                        Edit Permission
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Create Page */}
      <section className="mt-12">
        <button
          onClick={() => router.push("/admin/createpage")}
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded-md shadow hover:bg-green-600 transition"
        >
          Create Page
        </button>
      </section>
    </div>
  );
}
