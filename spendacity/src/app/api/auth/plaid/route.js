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

    const response = await client.itemPublicTokenExchange({
      public_token: public_token,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Store the access token and item ID securely associated with user.sub
    await storePlaidAccessToken(user.sub, accessToken, itemId);

    return NextResponse.json({
      access_token: accessToken,
      item_id: itemId,
    });
  } catch (error) {
    console.error("Error exchanging public token:", error);
    return NextResponse.json(
      {
        error: {
          error_type: error.error_type,
          error_code: error.error_code,
          error_message: error.error_message,
          display_message: error.display_message,
        },
      },
      { status: error.status_code || 500 },
    );
  }
}
