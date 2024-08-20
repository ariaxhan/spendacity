import { NextResponse } from "next/server";
import { convertDocumentToExpenses } from "../../../lib/doc.js";
import { convertPdfToExpenses } from "../../../lib/doc.js";

export async function POST(req) {
  try {
    console.log("POST /api/processdoc called");

    // Parse the request body
    const formData = await req.formData();
    const doc = formData.get("doc");
    const userId = formData.get("userId");
    const categoriesString = formData.get("categories");
    const categories = JSON.parse(categoriesString);

    if (!doc || !userId || !categories) {
      return NextResponse.json(
        {
          error: "Doc, User ID, or categories not provided",
        },
        { status: 400 },
      );
    }

    // Determine the document type (PDF or other)
    if (doc.type === "application/pdf") {
      // Convert PDF to expenses
      const expenses = await convertPdfToExpenses(doc, userId, categories);
      return NextResponse.json(expenses);
    } else {
      // Convert other document types to expenses
      const expense = await convertDocumentToExpenses(doc, userId, categories);
      return NextResponse.json(expense);
    }
  } catch (error) {
    console.error("Error in POST /api/processdoc:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}
