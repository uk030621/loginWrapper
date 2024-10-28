// models/data.js

import mongoose from "mongoose";

const DataSchema = new mongoose.Schema({
  userEmail: { type: String, required: true }, // Ensure this field is named `userEmail`
  title: { type: String, required: true },
  content: { type: String, required: true },
});

export default mongoose.models.Data || mongoose.model("Data", DataSchema);
