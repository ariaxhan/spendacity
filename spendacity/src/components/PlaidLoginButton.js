import { useState, useEffect, useCallback } from "react";
import { usePlaidLink } from "react-plaid-link";

const PlaidLoginButton = ({ user }) => {
  const [linkToken, setLinkToken] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false); // Add a loading state

  const fetchLinkToken = useCallback(async () => {
    try {
      setLoading(true); // Start loading
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
      console.log("Link token fetched:", data.link_token); // Log the link token
      setLoading(false); // Stop loading
    } catch (error) {
      console.error("Error fetching link token:", error);
      setLoading(false); // Stop loading in case of error
    }
  }, [user]);

  useEffect(() => {
    if (user && user.sub) {
      fetchLinkToken();
    }
  }, [user, fetchLinkToken]);

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
        console.log("Access token:", accessToken);

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
        setTransactions(transactionsData);
        console.log("Transactions:", transactionsData);

        // Refresh link token so the user can add more accounts
        fetchLinkToken();
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
            open(); // This will open the Plaid Link login page
          } else {
            console.log("Link token is not ready yet.");
          }
        }}
        disabled={loading || !ready || !linkToken} // Disable if loading or not ready
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
        {loading ? "Loading..." : "Connect Your Bank"} {/* Show loading text */}
      </button>
      {/* Display transactions or other data */}
      {transactions.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Your Transactions:</h3>
          <ul>
            {transactions.map((transaction, index) => (
              <li key={index}>
                {transaction.name}: ${transaction.amount} on {transaction.date}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PlaidLoginButton;
