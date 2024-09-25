/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError("Invalid Credentials");
        return;
      }

      router.replace("dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid place-items-center h-screen px-4">
      <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400 bg-white w-full max-w-md">
        <h1 className="text-xl md:text-2xl font-bold my-4 text-center">Login</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2 rounded-md hover:bg-green-700 transition-all">
            Login
          </button>
          {error && (
            <div className="bg-red-500 text-white w-full text-sm py-2 px-4 rounded-md mt-2 text-center">
              {error}
            </div>
          )}

          <Link className="text-sm mt-3 text-right text-gray-500 hover:underline" href={"/register"}>
            Do not have an account? <span className="underline">Register</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
