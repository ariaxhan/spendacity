import { Groq } from "groq-sdk";
import pdfjs from "pdfjs-dist/webpack";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function convertPdfToExpenses(pdfFile, userId, categories) {
  try {
    // Load the PDF document
    const pdf = await pdfjs.getDocument(pdfFile).promise;
    const numPages = pdf.numPages;
    let expenses = [];

    // Extract data from each page of the PDF
    for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      const prompt = `
You are a financial data analyst AI assistant.
Your task is to analyze the given PDF document page and convert each transaction or expense item into an Expense object that matches our MongoDB document structure.
The object must include the following fields exactly as named:
{
  "userId": "${userId}",
  "title": "String",
  "category": "String",
  "amount": Number,
  "date": "Date",
  "paymentType": "String",
  "satisfaction": Number
}
Analyze the following PDF page content:
${JSON.stringify(content, null, 2)}
Convert this data into the JSON format shown above, following these guidelines:
1. userId: Use the provided userId.
2. title: Extract a relevant title from the PDF content.
3. category: Assign a category based on the content of the PDF. It should match exactly one of the categories provided in the ${categories} array. Find the most appropriate one.
4. amount: Extract the monetary amount from the PDF content.
5. date: Extract the date from the PDF content and convert it into a valid Date string format.
6. paymentType: Determine the payment type based on the PDF content.
7. satisfaction: Assign a score from 0 to 10 as a number, considering the following factors:
   - **Cost Efficiency**: How well the cost of the item or service aligns with its value.
   - **Bang for the Buck**: The perceived value received for the money spent.
   - **Overall Satisfaction**: The user's overall happiness with the purchase, including quality, usability, and relevance to their needs.
   - **Comparison with Similar Purchases**: How the purchase compares to similar items or services in terms of value and satisfaction.
Ensure that all fields are in the correct types and formats as per the schema provided. Provide only the resulting JSON output, without any additional explanations.`;

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "gemma-7b-it",
        temperature: 0.5,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
        stop: null,
      });

      // Clean the response content by removing any Markdown code block delimiters
      let responseContent = chatCompletion.choices[0].message.content;
      responseContent = responseContent
        .replace(/```json/g, "")
        .replace(/```/g, "");

      // Try to parse the cleaned response content
      let expense;
      try {
        expense = JSON.parse(responseContent);
        expenses.push(expense);
      } catch (parseError) {
        console.error("Failed to parse AI response as JSON:", parseError);
        console.log("AI response content after cleaning:", responseContent);
        // Skip this page and continue to the next one
        continue;
      }
    }

    return expenses;
  } catch (error) {
    console.error("Error converting PDF document:", error);
    throw error;
  }
}
