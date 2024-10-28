"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function UserData() {
  const { data: session } = useSession();
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null); // Track which item is being edited

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/data");
      const json = await res.json();
      setData(json);
    }
    fetchData();
  }, []);

  const createData = async () => {
    if (!title || !content) return; // Basic validation

    const res = await fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    const newData = await res.json();
    setData([...data, newData]);
    setTitle(""); // Clear input after creating
    setContent("");
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setTitle(item.title); // Set input fields to the item being edited
    setContent(item.content);
  };

  const updateData = async () => {
    if (!editingId) return;

    const res = await fetch("/api/data", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingId, title, content }),
    });
    const updatedItem = await res.json();

    setData(data.map((item) => (item._id === editingId ? updatedItem : item)));
    setEditingId(null); // Clear editing mode
    setTitle(""); // Clear input fields
    setContent("");
  };

  const deleteData = async (id) => {
    await fetch("/api/data", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setData(data.filter((item) => item._id !== id));
  };

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <h1 className="text-2xl font-bold mt-3 mb-3">Activity List</h1>
      <p className="text-base">
        Owner:
        <span className="text-slate-700 ml-2">{session?.user?.name}</span>
      </p>
      <p className="mb-4 text-base ml-3">
        email:
        <span className="text-slate-700 ml-2">{session?.user?.email}</span>
      </p>

      {/* Button Group */}
      <div className="flex flex-col md:flex-row mb-4 gap-4">
        <button
          className="bg-green-700 text-white rounded-md py-2 px-4 w-full md:w-auto"
          onClick={editingId ? updateData : createData}
        >
          {editingId ? "Save Changes" : "Create"}
        </button>
        <Link
          className="text-white bg-black rounded-md py-2 px-4 w-full md:w-auto text-center"
          href="/dashboard"
        >
          Log out
        </Link>
      </div>

      {/* Title and Content Inputs */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          className="border border-gray-300 p-2 rounded w-full md:w-1/2 overflow-hidden text-ellipsis"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <input
          className="border border-gray-300 p-2 rounded w-full md:w-1/2 overflow-hidden text-ellipsis"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
        />
      </div>

      {/* Data List */}
      <ul className="mt-4 space-y-4">
        {data.map((item) => (
          <li
            key={item._id}
            className="p-4 border border-gray-300 rounded-lg w-full md:max-w-full bg-gray-50"
          >
            <h2 className="font-bold text-lg overflow-hidden text-ellipsis whitespace-nowrap">
              {item.title}
            </h2>
            <p className="mb-4 text-gray-700 overflow-hidden text-ellipsis break-words line-clamp-3">
              {item.content}
            </p>

            {/* Button Group for Edit and Delete */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="bg-yellow-600 text-white rounded-md py-1 px-4 w-full sm:w-auto"
                onClick={() => handleEdit(item)}
              >
                Edit
              </button>
              <button
                className="bg-red-600 text-white rounded-md py-1 px-4 w-full sm:w-auto"
                onClick={() => deleteData(item._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
