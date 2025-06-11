// Import React and the useState hook to manage component state
import React, { useState } from "react";

// Import the Principal class from the DFINITY SDK to handle Principal IDs
import { Principal } from "@dfinity/principal";

// Import the token_backend canister interface (from the DFINITY declarations)
import { token_backend } from "../../../declarations/token_backend";

function Balance() {
  // Declare a state variable to hold the user input (Principal ID)
  const [inputValue, setInput] = useState("");

  // Declare a state variable to hold the resulting balance
  const [balanceResult, setBalance] = useState("");

  // Declare a state variable to hold the symbol of the crypto token
  const [cryptoSymbol, setSymbol] = useState("");



  // Define an asynchronous function to handle the button click
  async function handleClick() {
    // Convert the text input into a Principal object
    const principal = Principal.fromText(inputValue);

    // Call the backend canister's balanceOf function with the Principal
    const balance = await token_backend.balanceOf(principal);

    // Format the balance as a localized string and update the state
    setBalance(balance.toLocaleString());

    // retrieves the symbol of the crypto token
    setSymbol(await token_backend.getSymbol());
  }

  // Return the UI elements for the Balance component
  return (
    <div className="window white">
      <label>Check account token balance:</label>
      <p>
        {/* Input field to enter a Principal ID */}
        <input
          id="balance-principal-id"
          type="text"
          placeholder="Enter a Principal ID"
          value={inputValue}
          onChange={(e) => setInput(e.target.value)} // Update inputValue on change
        />
      </p>
      <p className="trade-buttons">
        {/* Button to trigger the balance check */}
        <button id="btn-request-balance" onClick={handleClick}>
          Check Balance
        </button>
      </p>
      {/* Display the fetched token balance */}
      <p>This account has a balance of {balanceResult} {cryptoSymbol}.</p>
    </div>
  );
}

// Export the Balance component so it can be used in other parts of the app
export default Balance;
