// src/models/PlaidToken.js
import mongoose from "mongoose";

const PlaidTokenSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  accessToken: { type: String, required: true },
});

const PlaidToken =
  mongoose.models.PlaidToken || mongoose.model("PlaidToken", PlaidTokenSchema);

export default PlaidToken;
