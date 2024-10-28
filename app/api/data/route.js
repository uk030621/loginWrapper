// app/api/data/route.js

import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import Data from "@/models/data";
import { connectMongoDB } from "@/lib/mongodb";

// GET: Retrieve all data entries for the authenticated user
export async function GET(_req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await connectMongoDB();
    const userData = await Data.find({ userEmail: session.user.email });
    return new Response(JSON.stringify(userData), { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return new Response("Database error", { status: 500 });
  }
}

// POST: Create a new data entry for the authenticated user
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { title, content } = await req.json();

  try {
    await connectMongoDB();
    const newData = await Data.create({
      userEmail: session.user.email,
      title,
      content,
    });
    return new Response(JSON.stringify(newData), { status: 201 });
  } catch (error) {
    console.error("Database error:", error);
    return new Response("Database error", { status: 500 });
  }
}

// PUT: Update a data entry (provide entry ID in request body)
export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id, title, content } = await req.json();

  try {
    await connectMongoDB();
    const updatedData = await Data.findOneAndUpdate(
      { _id: id, userEmail: session.user.email },
      { title, content },
      { new: true }
    );

    if (!updatedData) {
      return new Response("Data not found or unauthorized", { status: 404 });
    }

    return new Response(JSON.stringify(updatedData), { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return new Response("Database error", { status: 500 });
  }
}

// DELETE: Delete a data entry (provide entry ID in request body)
export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await req.json();

  try {
    await connectMongoDB();
    const deletedData = await Data.findOneAndDelete({
      _id: id,
      userEmail: session.user.email,
    });

    if (!deletedData) {
      return new Response("Data not found or unauthorized", { status: 404 });
    }

    return new Response("Data deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return new Response("Database error", { status: 500 });
  }
}
