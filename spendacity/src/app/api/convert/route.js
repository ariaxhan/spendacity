//src/app/api/convert/route.js

import { NextResponse } from "next/server";
import { convertPlaidToExpense } from "../../../lib/aiConversion";

export async function POST(req) {
  try {
    console.log("POST /api/convert called");

    // Parse the request body
    const { plaidTransaction, userId } = await req.json();
    console.log("Received Plaid transaction:", plaidTransaction);
    console.log("Received User ID:", userId);

    if (!plaidTransaction || !userId) {
      return NextResponse.json(
        { error: "Plaid transaction data or User ID not provided" },
        { status: 400 },
      );
    }

    // Convert Plaid transaction to expense format
    const expense = await convertPlaidToExpense(plaidTransaction, userId);

    // Return the converted expense
    return NextResponse.json(expense);
  } catch (error) {
    console.error("Error in POST /api/convert:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}
