import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // Make sure to set this environment variable
});

export async function convertPlaidToExpense(
  plaidTransaction,
  userId,
  categories,
) {
  const prompt = `
You are a financial data analyst AI assistant. Your task is to analyze the given Plaid transaction data and convert it into an Expense object that matches our MongoDB document structure. The object must include the following fields exactly as named:

{
  "userId": "${userId}",
  "title": "String",
  "category": "String",
  "amount": Number,
  "date": "Date",
  "paymentType": "String",
  "satisfaction": Number
}

Analyze the following Plaid transaction data:

${JSON.stringify(plaidTransaction, null, 2)}

Convert this data into the JSON format shown above, following these guidelines:

1. userId: Use the provided userId.
2. title: Use the 'merchant_name' or 'name' field from the Plaid data.
3. category: Assign a category based on the Plaid 'category' array or 'personal_finance_category'. It should match exactly one of the categories provided in the ${categories} array. Find the most appropriate one.
4. amount: Use the 'amount' field from the Plaid data as a number.
5. date: Convert the 'date' field from the Plaid data into a valid Date string format.
6. paymentType: Determine based on the 'payment_channel' field.
7. satisfaction: Assign a score from 0 to 10 as a number, considering the following factors:
   - **Cost Efficiency**: How well the cost of the item or service aligns with its value.
   - **Bang for the Buck**: The perceived value received for the money spent.
   - **Overall Satisfaction**: The user's overall happiness with the purchase, including quality, usability, and relevance to their needs.
   - **Comparison with Similar Purchases**: How the purchase compares to similar items or services in terms of value and satisfaction.

Ensure that all fields are in the correct types and formats as per the schema provided. Provide only the resulting JSON output, without any additional explanations.`;

  try {
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

    // Log the entire response for debugging purposes
    console.log("Chat completion response:", chatCompletion);

    // Clean the response content by removing any Markdown code block delimiters
    let responseContent = chatCompletion.choices[0].message.content;
    responseContent = responseContent
      .replace(/```json/g, "")
      .replace(/```/g, "");

    // Log the cleaned content for debugging
    console.log("Cleaned AI response content:", responseContent);

    // Try to parse the cleaned response content
    let parsedResult;
    try {
      parsedResult = JSON.parse(responseContent);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      console.log("AI response content after cleaning:", responseContent);
      throw new Error("AI response could not be parsed as JSON");
    }

    return parsedResult;
  } catch (error) {
    console.error("Error converting Plaid transaction:", error);
    throw error;
  }
}
