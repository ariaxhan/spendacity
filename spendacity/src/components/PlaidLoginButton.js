import { useState, useEffect, useCallback } from "react";
import { usePlaidLink } from "react-plaid-link";

const PlaidLoginButton = ({ user }) => {
  const [linkToken, setLinkToken] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLinkToken = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/plaid/linkToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch link token");
      }

      const data = await response.json();
      setLinkToken(data.link_token);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching link token:", error);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.sub && !linkToken) {
      fetchLinkToken();
    }
  }, [user, linkToken, fetchLinkToken]);

  const convertPlaidToExpense = async (plaidTransaction) => {
    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plaidTransaction, userId: user.sub }),
      });

      if (!response.ok) {
        throw new Error("Failed to convert Plaid transaction");
      }

      const expense = await response.json();
      console.log("Converted Plaid transaction:", expense);
      return expense;
    } catch (error) {
      console.error("Error converting Plaid transaction:", error);
      throw error;
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

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      try {
        const response = await fetch("/api/auth/plaid", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ public_token, user }),
        });

        if (!response.ok) {
          throw new Error("Failed to exchange public token");
        }

        const data = await response.json();
        const accessToken = data.access_token;

        // Fetch transactions after obtaining the access token
        const transactionsResponse = await fetch("/api/transactions", {
          headers: {
            "user-id": user.sub,
          },
        });

        if (!transactionsResponse.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const transactionsData = await transactionsResponse.json();

        // Convert each Plaid transaction and save it to the database
        const convertedTransactions = await Promise.all(
          transactionsData.map(async (transaction) => {
            const expense = await convertPlaidToExpense(transaction);
            await saveExpenseToDatabase(expense);
            return expense;
          }),
        );

        setTransactions(convertedTransactions);
        // fetchLinkToken(); // Refresh link token so the user can add more accounts
      } catch (error) {
        console.error("Error handling Plaid success:", error);
      }
    },
    onExit: (error, metadata) => {
      if (error) {
        console.error("Plaid Link flow exited with error:", error);
      } else {
        console.log("Plaid Link flow exited by user");
      }
    },
  });

  return (
    <div>
      <button
        onClick={() => {
          if (linkToken) {
            open();
          } else {
            console.log("Link token is not ready yet.");
          }
        }}
        disabled={loading || !ready || !linkToken}
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
        {loading ? "Loading..." : "Connect Your Bank"}
      </button>
      {transactions.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Your Transactions:</h3>
          <ul>
            {transactions.map((transaction, index) => (
              <li key={index}>
                {transaction.title}: ${transaction.amount} on{" "}
                {new Date(transaction.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PlaidLoginButton;
