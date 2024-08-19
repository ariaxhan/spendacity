// src/app/api/transactions/route.js
import client from "../../../config/plaidClient";
import { getPlaidAccessToken } from "../../../lib/database";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Extract user ID from the request
    const userId = req.headers.get("user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID not provided" },
        { status: 400 },
      );
    }

    const access_token = await getPlaidAccessToken(userId);

    if (!access_token) {
      return NextResponse.json(
        { error: "Access token not found" },
        { status: 404 },
      );
    }

    const startDate = "2024-01-01";
    const endDate = "2024-08-01";

    const response = await client.transactionsGet({
      access_token: access_token,
      start_date: startDate,
      end_date: endDate,
    });
    console.log(response.data.transactions);
    return NextResponse.json(response.data.transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error.message,
        error_type: error.error_type,
        error_code: error.error_code,
        error_message: error.error_message,
      },
      { status: error.status_code || 500 },
    );
  }
}
