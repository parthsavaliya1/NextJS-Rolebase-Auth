"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Added useRouter for navigation

const EditPermission = () => {
  const [permissions, setPermissions] = useState({});
  const { id: roleId } = useParams(); // Get 'id' from dynamic route
  const router = useRouter(); // Initialize router for navigation

  useEffect(() => {
    fetch(`/api/role/getRoleById/${roleId}`)
      .then((res) => res.json())
      .then((data) => setPermissions(data?.role?.permissions));
  }, [roleId]);

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

  const handleSubmit = async (roleid) => {
    const updatedData = {
      permissions: {
        admin: permissions.admin,  // Permissions for admin
        product: permissions.product,  // Permissions for product
        user: permissions.user,  // Permissions for user
      },
    };

    const response = await fetch(`/api/role/updateRoleById/${roleid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    const data = await response.json();

    if (response.ok) {
      router.push('/admin');
    } else {
      console.error("Failed to update permissions:", data.error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Edit Permissions
      </h1>
      
      <div className="mb-6">
        {Object.keys(permissions).map((page) => (
          <div key={page} className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {page.charAt(0).toUpperCase() + page.slice(1)}
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

      {/* Submit Button */}
      <div className="mt-6">
        <button
          onClick={() => handleSubmit(roleId)}
          className="w-full sm:w-auto px-6 py-3 text-white bg-indigo-600 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditPermission;
