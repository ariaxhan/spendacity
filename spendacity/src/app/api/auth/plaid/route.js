// src/app/api/auth/plaid/route.js
import client from "../../../../config/plaidClient.js";
import { storePlaidAccessToken } from "../../../../lib/database";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { public_token, user } = await req.json();

    if (!user || !user.sub) {
      return NextResponse.json(
        { error: "User ID not provided" },
        { status: 400 },
      );
    }

    const response = await client.exchangePublicToken(public_token);
    const { access_token } = response;

    // Store the access token securely associated with user.sub
    await storePlaidAccessToken(user.sub, access_token);

    return NextResponse.json({ access_token });
  } catch (error) {
    console.error("Error exchanging public token:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}
