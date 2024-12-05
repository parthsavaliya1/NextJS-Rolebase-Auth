'use client';
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";


export default function CreatePasswordPage() {
  const { data: session, status } = useSession(); // Access session data
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>You need to be logged in to reset the password</div>;

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
        const response = await fetch("/api/create-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: session.user.email, password }), // Use email from session
          });

      const data = await response.json();
      if (response.ok) {
        setLoading(false);
        const result = await signIn("credentials", {
          email: session.user.email,
          password: password,  // You just set the password
          redirect: false,     // Don't redirect after sign-in
        });

        console.log('result',result)
        if (result?.error) {
          setError(result.error);
        } else {
          router.push("/"); // Redirect to home page after successful sign-in
        }
      } else {
        setLoading(false);
        setError(data.message || "Something went wrong.");
      }
    } catch (error) {
      setLoading(false);
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-center text-2xl font-bold text-gray-700 mb-6">Create a Password</h1>

        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
              className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm new password"
              className="shadow-sm appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {loading ? "Saving..." : "Save Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
