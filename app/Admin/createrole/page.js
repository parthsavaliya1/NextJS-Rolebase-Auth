"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateRole() {
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState({ admin: [], product: [], user: [] });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call your API to create the role
    const response = await fetch("/api/role/create", {
      method: "POST",
      body: JSON.stringify({ roleName, permissions }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      router.push("/Admin"); // Navigate back to the role management page
    } else {
      alert("Failed to create role.");
    }
  };

  const handlePermissionChange = (page, permission, checked) => {
    setPermissions((prevPermissions) => {
      const updatedPermissions = { ...prevPermissions };
      if (checked) {
        updatedPermissions[page] = [...(updatedPermissions[page] || []), permission];
      } else {
        updatedPermissions[page] = updatedPermissions[page].filter((perm) => perm !== permission);
      }
      return updatedPermissions;
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Create New Role
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div class="space-y-1">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="roleName">
            Role Name
            </label>
            <input onChange={(e) => setRoleName(e?.target?.value)} id="roleName" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Enter role name"/>
        </div>
        <div className="mb-6">
          {["product", "user", "admin"].map((page) => (
            <div key={page} className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2 capitalize">
                {page}
              </h3>
              <div className="space-x-4">
                {["read", "write"].map((permission) => (
                  <div key={permission} className="inline-flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`${page}-${permission}`}
                      checked={permissions[page]?.includes(permission)}
                      onChange={(e) =>
                        handlePermissionChange(page, permission, e.target.checked)
                      }
                      className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={`${page}-${permission}`}
                      className="text-sm font-medium text-gray-700"
                    >
                      {permission.charAt(0).toUpperCase() + permission.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 text-white bg-indigo-600 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Create Role
          </button>
        </div>
      </form>
    </div>
  );
}
