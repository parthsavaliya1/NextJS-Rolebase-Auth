"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Added useRouter to navigate after update

export default function EditUser() {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id: userId } = useParams(); // Get 'id' from dynamic route
  const router = useRouter(); // Initialize the router for redirection

  // Fetch user details
  useEffect(() => {
    fetch(`/api/user/userById/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  // Fetch all roles for the dropdown
  useEffect(() => {
    fetch(`/api/role/getAllRole`)
      .then((res) => res.json())
      .then((data) => setRoles(data.roles))
      .catch((err) => setError(err.message));
  }, []);

  // Handle role selection and update user role
  const handleSubmit = async (roleId) => {
    const updatedData = { roleId };

    const response = await fetch(`/api/user/updateUserById/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("User updated successfully", data);
      // Redirect to the /Admin page after successful update
      router.push('/Admin');
    } else {
      console.error("Failed to update user:", data.error);
    }
  };

  // Show loading state or error message if something went wrong
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Edit Role for {user.email}
      </h1>

      <div className="mb-4">
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Update Role
        </label>
        <select
          id="role"
          value={user.role._id} // The value is the user's current roleId
          onChange={(e) => setUser({ ...user, role: { _id: e.target.value } })} // Update the user state with the selected role
          className="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          {roles.map((role) => (
            <option key={role._id} value={role._id}>
              {role.roleName}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <div className="mt-6">
        <button
          onClick={() => handleSubmit(user?.role?._id)} // Handle submit when the button is clicked
          className="w-full sm:w-auto px-6 py-3 text-white bg-indigo-600 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
