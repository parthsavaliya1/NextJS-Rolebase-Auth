"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateRole() {
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState({});
  const [pages, setPages] = useState([]); // State to store pages
  const [loading, setLoading] = useState(false); // State to handle loading
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const router = useRouter();

  useEffect(() => {
    const fetchPages = async () => {
      try {
        setLoading(true); // Start loading
        const response = await fetch("/api/role/getAllPage");
        if (response.ok) {
          const data = await response.json();
          setPages(data.pages); // Assuming your API returns { pages: [...] }
        } else {
          setErrorMessage("Failed to fetch pages.");
        }
      } catch (error) {
        setErrorMessage("Error fetching pages: " + error.message);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchPages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roleName.trim()) {
      setErrorMessage("Role name is required.");
      return;
    }

    setLoading(true);
    setErrorMessage(""); // Clear previous errors

    try {
      const response = await fetch("/api/role/create", {
        method: "POST",
        body: JSON.stringify({ roleName, permissions }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        router.push("/Admin");
      } else {
        setErrorMessage("Failed to create role.");
      }
    } catch (error) {
      setErrorMessage("Error creating role: " + error.message);
    } finally {
      setLoading(false);
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
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Create New Role</h1>
        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="roleName"
            >
              Role Name
            </label>
            <input
              onChange={(e) => setRoleName(e.target.value)}
              id="roleName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-indigo-500"
              type="text"
              placeholder="Enter role name"
            />
          </div>
          <div className="mb-6">
            {pages.map((page) => (
              <div key={page} className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2 capitalize">{page}</h3>
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
              className={`w-full sm:w-auto px-6 py-3 text-white rounded-md shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
