// src/app/api/expenses/route.js

import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb";
import Expense from "../../../lib/models/Expense";

export async function GET(req) {
  console.log("GET /api/expenses called");
  try {
    console.log("Connecting to database...");
    await connectToDatabase();
    console.log("Connected to database successfully");

    const userId = req.headers.get("user-id");
    console.log("User ID from headers:", userId);

    if (!userId) {
      console.log("User ID not provided in request headers");
      return NextResponse.json(
        { error: "User ID not provided" },
        { status: 400 },
      );
    }

    console.log("Fetching expenses for user:", userId);
    const expenses = await Expense.find({ userId: userId });
    console.log(`Found ${expenses.length} expenses for user`);

    return NextResponse.json(expenses);
  } catch (error) {
    console.error("Error in GET /api/expenses:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  console.log("POST /api/expenses called");
  try {
    console.log("Connecting to database...");
    await connectToDatabase();
    console.log("Connected to database successfully");

    console.log("Parsing request body...");
    const data = await req.json();
    console.log("Received data:", data);

    // Log all headers
    console.log("All headers:", Object.fromEntries(req.headers.entries()));

    // Try different methods to get the user ID
    const userId =
      req.headers.get("user-id") ||
      req.headers.get("User-Id") ||
      req.headers.get("userid") ||
      data.userId; // Fallback to userId in the body if header is not working

    console.log("User ID:", userId);

    if (!userId) {
      console.log("User ID not found in headers or body");
      return NextResponse.json(
        { error: "User ID not provided" },
        { status: 400 },
      );
    }

    // Validate required fields
    const requiredFields = [
      "title",
      "category",
      "amount",
      "date",
      "paymentType",
      "satisfaction",
    ];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      console.log("Missing required fields:", missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 },
      );
    }

    // Validate data types
    if (typeof data.amount !== "number" || isNaN(data.amount)) {
      console.log("Invalid amount:", data.amount);
      return NextResponse.json(
        { error: "Amount must be a number" },
        { status: 400 },
      );
    }

    if (
      typeof data.satisfaction !== "number" ||
      isNaN(data.satisfaction) ||
      data.satisfaction < 0 ||
      data.satisfaction > 10
    ) {
      console.log("Invalid satisfaction:", data.satisfaction);
      return NextResponse.json(
        { error: "Satisfaction must be a number between 0 and 10" },
        { status: 400 },
      );
    }

    console.log("Creating new expense...");

    const expense = new Expense({ ...data, userId: userId });
    const savedExpense = await expense.save();
    return NextResponse.json(savedExpense);
  } catch (error) {
    console.error("Error in POST /api/expenses:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          error: "Duplicate expense",
          details: "This expense has already been added",
        },
        { status: 409 }, // 409 Conflict
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}
