import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // Make sure to set this environment variable
});

export async function convertPlaidToExpense(plaidTransaction, userId) {
  const prompt = `
You are a financial data analyst AI assistant. Your task is to analyze the given Plaid transaction data and convert it into an Expense object that matches our MongoDB document structure. Here's the expected output format in JSON:

{
  "_id": {"$oid": "24-character-hex-string"},
  "userId": "${userId}",
  "title": "String",
  "category": "String",
  "amount": {"$numberInt": "integer-as-string"},
  "date": {"$date": {"$numberLong": "milliseconds-since-epoch"}},
  "paymentType": "String",
  "satisfaction": {"$numberInt": "integer-as-string"},
  "createdAt": {"$date": {"$numberLong": "milliseconds-since-epoch"}},
  "updatedAt": {"$date": {"$numberLong": "milliseconds-since-epoch"}},
  "__v": {"$numberInt": "0"}
}

Analyze the following Plaid transaction data:

${JSON.stringify(plaidTransaction, null, 2)}

Convert this data into the JSON format shown above, following these guidelines:

1. _id: Generate a new 24-character hexadecimal string for the ObjectId.
2. userId: Use the provided userId.
3. title: Use the 'merchant_name' or 'name' field from the Plaid data.
4. category: Assign a category based on the Plaid 'category' array or 'personal_finance_category'.
5. amount: Use the 'amount' field from the Plaid data, converted to an integer and represented as a string.
6. date: Convert the 'date' field from the Plaid data into milliseconds since the Unix epoch.
7. paymentType: Determine based on the 'payment_channel' field.
8. satisfaction: Assign a score from 0 to 10, represented as a string.
9. createdAt and updatedAt: Use the current date and time in milliseconds since the Unix epoch.
10. __v: Always set to "0".

Provide only the resulting JSON output, without any additional explanations.`;

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

    const result = JSON.parse(chatCompletion.choices[0].message.content);
    return result;
  } catch (error) {
    console.error("Error converting Plaid transaction:", error);
    throw error;
  }
}
