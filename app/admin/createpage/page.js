"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreatePage() {
  const [roles, setRoles] = useState([]);
  const [pageName, setPageName] = useState("");
  const [permissions, setPermissions] = useState({});
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const router = useRouter();

  useEffect(() => {
    fetch('/api/role/getAllRole') // Fetch all roles
      .then((res) => res.json())
      .then((data) => {
        setRoles(data.roles);
        // Initialize permissions as empty for each role
        const initialPermissions = data.roles.reduce((acc, role) => {
          acc[role.roleName] = []; // Initialize empty array for each role
          return acc;
        }, {});
        setPermissions(initialPermissions);
      });
  }, []);

  const handleSave = (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate that the page name is not empty
    if (!pageName.trim()) {
      setErrorMessage("Page name is required.");
      return; // Stop further execution if the page name is blank
    }

    // Clear any previous error message
    setErrorMessage("");

    // Generate the payload in the desired format
    const payload = [];
    roles.forEach((role) => {
      const rolePermissions = permissions[role.roleName] || [];
      if (rolePermissions.length > 0) {
        // Attach the roleId alongside the permissions
        payload.push({
          roleId: role._id, // Include the roleId
          permissions: rolePermissions,
        });
      }
    });

    const newPageData = {
      pageName,
      permissions: payload, // Updated payload format
    };

    // Send a request to the backend to save the new page and permissions
    fetch('/api/role/createpage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPageData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          router.push('/admin'); // Redirect to the role management page after saving
        } else {
          setErrorMessage("Failed to create the page.");
        }
      });
  };
  
  const handlePermissionChange = (roleName, permissionType) => {
    setPermissions((prevPermissions) => {
      const updatedPermissions = { ...prevPermissions };
      const rolePermissions = updatedPermissions[roleName] || [];
      if (rolePermissions.includes(permissionType)) {
        updatedPermissions[roleName] = rolePermissions.filter((perm) => perm !== permissionType);
      } else {
        updatedPermissions[roleName] = [...rolePermissions, permissionType];
      }
      return updatedPermissions;
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-8 text-gray-900">Create Page</h1>
      
      {/* Page Name Input */}
      <div className="mb-8">
        <label className="block text-gray-700 text-base mb-2">Page Name</label>
        <input
          type="text"
          value={pageName}
          onChange={(e) => setPageName(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="text-red-600 text-sm mb-4">{errorMessage}</div>
      )}

      {/* Role Permissions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Assign Permissions</h2>
        {roles.map((role) => (
          <div key={role._id} className="mb-8">
            <h3 className="text-lg font-medium text-gray-700">{role.roleName}</h3>
            <div className="mt-4 space-x-6 flex items-center">
              <div className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={permissions[role.roleName]?.includes("read")}
                  onChange={() => handlePermissionChange(role.roleName, "read")}
                  className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label
                  htmlFor={`read-${role._id}`}
                  className="text-sm font-medium text-gray-700"
                >
                  Read
                </label>
              </div>
              <div className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={permissions[role.roleName]?.includes("write")}
                  onChange={() => handlePermissionChange(role.roleName, "write")}
                  className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label
                  htmlFor={`write-${role._id}`}
                  className="text-sm font-medium text-gray-700"
                >
                  Write
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="mt-10 text-right">
        <button
          onClick={handleSave}
          className="px-8 py-4 bg-blue-500 text-white text-lg font-semibold rounded-md shadow-md hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          Save
        </button>
      </div>
    </div>
  );
}
