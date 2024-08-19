// src/app/api/plaid/linkToken/route.js
import client from "../../../../config/plaidClient.js";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json(); // Parse the request body
    const { user } = body;

    if (!user || !user.sub) {
      return NextResponse.json(
        { error: "User ID not provided" },
        { status: 400 },
      );
    }

    const response = await client.linkTokenCreate({
      user: {
        client_user_id: user.sub, // Use user.sub as the unique identifier
      },
      client_name: "spendacity",
      products: ["transactions"], // Specify the products you need, e.g., 'transactions'
      country_codes: ["US"],
      language: "en",
    });
    console.log("response", response);
    return NextResponse.json({ link_token: response.data.link_token });
  } catch (error) {
    console.error("Error generating link token:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}
