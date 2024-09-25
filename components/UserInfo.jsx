/* eslint-disable react/no-unescaped-entities */
"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function UserInfo() {
  const { data: session } = useSession();

  return (
    <div className="flex justify-center items-start h-screen px-4 mt-10">
      <div className="shadow-lg p-8 bg-zince-300/10 flex flex-col gap-2 my-6">
        <div>
          Name: <span className="font-bold">{session?.user?.name}</span>
        </div>
        <div>
          Email: <span className="font-bold">{session?.user?.email}</span>
        </div>
        <button
          onClick={() => signOut()}
          className="bg-red-500 text-white w-full text-sm py-2 px-4 rounded-md mt-2 text-center"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
