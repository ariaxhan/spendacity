import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb";
import Expense from "../../../../lib/models/Expense";

export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const userId = req.headers.get("user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID not provided" },
        { status: 400 },
      );
    }

    const deletedExpense = await Expense.findOneAndDelete({
      _id: id,
      userId: userId,
    });

    if (!deletedExpense) {
      return NextResponse.json(
        { error: "Expense not found or unauthorized" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
