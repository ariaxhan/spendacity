import { useState } from "react";

const DocumentUploadButton = ({ user, categories }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadDocument = async () => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("doc", file);
      formData.append("userId", user.sub);
      formData.append("categories", JSON.stringify(categories));

      const response = await fetch("/api/processdoc", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload document");
      }

      const expenses = await response.json();
      console.log("Uploaded document:", expenses);

      await Promise.all(expenses.map(saveExpenseToDatabase));
    } catch (error) {
      console.error("Error uploading document:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveExpenseToDatabase = async (expense) => {
    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expense),
      });

      console.log("Saved expense to database:", expense);
      if (!response.ok) {
        throw new Error("Failed to save expense to the database");
      }
    } catch (error) {
      console.error("Error saving expense to the database:", error);
      throw error;
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        disabled={loading}
        style={{
          marginBottom: "12px",
        }}
      />
      <button
        onClick={uploadDocument}
        disabled={!file || loading}
        style={{
          backgroundColor: "#1a73e8",
          color: "#ffffff",
          padding: "12px 24px",
          borderRadius: "4px",
          cursor: "pointer",
          border: "none",
          fontSize: "16px",
        }}
      >
        {loading ? "Uploading..." : "Upload Document"}
      </button>
    </div>
  );
};

export default DocumentUploadButton;
