// src/lib/database.js
import connectToDatabase from "./mongodb";
import PlaidToken from "./models/PlaidToken.js";

export async function storePlaidAccessToken(userId, accessToken) {
  await connectToDatabase();
  const token = await PlaidToken.findOneAndUpdate(
    { userId },
    { accessToken },
    { upsert: true, new: true },
  );
  return token;
}

export async function getPlaidAccessToken(userId) {
  await connectToDatabase();
  const token = await PlaidToken.findOne({ userId });
  return token ? token.accessToken : null;
}
