/* eslint-disable react/no-unescaped-entities */
"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Hello() {
  const { data: session } = useSession();

  return (
    <div className="flex justify-center items-start h-screen px-4 mt-10">
      <div className="shadow-lg p-8 bg-zince-300/10 flex flex-col gap-2 my-6">
        <h1 className="text-slate-700 font-bold text-2xl">
          Welcome {session?.user?.name?.split(" ")[0]},
        </h1>
        <div className="text-sm">
          Full Name: <span className="font-bold">{session?.user?.name}</span>
        </div>
        <div className="text-sm">
          Email Address:{" "}
          <span className="font-bold">{session?.user?.email}</span>
        </div>
        <div>
          <p className="text-green-700 text-lg mb-5">Access Permitted 👍</p>
          <p>
            Click <Link href="/CRUD">➡️</Link> to continue. <br />
            <span className=" text-slate-400 mt-3">or</span>
          </p>
        </div>
        <button
          onClick={() => signOut()}
          className="bg-red-500 text-white w-full text-sm py-2 px-4 rounded-md text-center"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
