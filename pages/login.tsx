import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

export default function Login() {
  const { user } = useUser();

  if (user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h1>
        <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded-md">
          Go to Dashboard
        </Link>
        <Link
          href="/api/auth/logout"
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Logout
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Login to Your Account</h1>
      <Link
        href="/api/auth/login"
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Login
      </Link>
    </div>
  );
}
