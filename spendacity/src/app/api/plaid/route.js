// src/app/api/auth/plaid/route.js
import client from "../../../config/plaidClient.js";
import { NextResponse } from "next/server";
import { storePlaidAccessToken } from "../../../lib/database";

export async function POST(req) {
  try {
    const body = await req.json();
    const { public_token, user } = body;

    if (!user || !user.sub) {
      return NextResponse.json(
        { error: "User ID not provided" },
        { status: 400 },
      );
    }

    const response = await client.itemPublicTokenExchange({ public_token });
    const accessToken = response.data.access_token;

    await storePlaidAccessToken(user.sub, accessToken);

    return NextResponse.json({ access_token: accessToken });
  } catch (error) {
    console.error("Error exchanging public token:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}
