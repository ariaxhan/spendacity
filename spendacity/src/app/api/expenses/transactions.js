// src/app/api/expenses/transactions.js
import client from "../../../config/plaidClient";
import { getPlaidAccessToken } from "../../../lib/database";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
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

    const response = await client.getTransactions(
      access_token,
      startDate,
      endDate,
    );

    return NextResponse.json(response.transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}
