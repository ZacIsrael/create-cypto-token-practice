// Import React and the useState hook, which allows this component to track and update values
import React, { useState } from "react";

// Import the token_backend canister interface to allow interaction with the backend smart contract
import { token_backend } from "../../../declarations/token_backend";

// Import Principal from DFINITY to convert text input into a Principal type used in the backend
import { Principal } from "@dfinity/principal";

// Define a React component called Transfer
function Transfer() {
  // `recipientId` will store the Principal ID entered by the user
  // `setId` is the function used to update that value
  const [recipientId, setId] = useState("");

  // `amount` will store the amount of tokens the user wants to send
  // `setAmount` is the function used to update it
  const [amount, setAmount] = useState("");

  // varaible that determines whether or not the "Transfer" button will be disabled
  const [isDisabled, setDisabled] = useState(false);

  // variable that stores the message returned from the transfer() function
  const [feedback, setFeedback] = useState("");

  // variable that determines whether or not the feedback paragraph should be hidden
  const [isHidden, setIsHidden] = useState(true);

  // This asynchronous function is called when the user clicks the "Transfer" button
  async function handleClick() {
    // Disbale the "Transfer" button once it has been clicked so that a user can't
    // click it again while a transfer is happening.
    setDisabled(true);
    // transfer() in main.mo expects a Principal for the first parameter; not a Text
    // so we must convert the recipientId from a String to a Principal.

    // Convert the string input from the user into a Principal object
    const recipient = Principal.fromText(recipientId);

    // Convert the amount from a string to a number, because the backend expects a number
    const amountToTransfer = Number(amount);

    // Call the `transfer` function on the backend smart contract
    // This sends `amountToTransfer` tokens to the `recipient` Principal
    const result = await token_backend.transfer(recipient, amountToTransfer);

    // transfer returns "Success" or "Insufficient Funds"
    setFeedback(result);
    
    // only display message once we've recieved the feedback
    setIsHidden(false);

    // enable the "Transfer" button once the transfer has completed
    setDisabled(false);
  }

  // Return the HTML structure (JSX) that will be displayed in the browser
  return (
    <div className="window white">
      <div className="transfer">
        {/* First section for entering the recipient's Principal ID */}
        <fieldset>
          <legend>To Account:</legend>
          <ul>
            <li>
              {/* Input field for the Principal ID. When the user types, it updates `recipientId` */}
              <input
                type="text"
                id="transfer-to-id"
                value={recipientId}
                onChange={(e) => setId(e.target.value)}
              />
            </li>
          </ul>
        </fieldset>

        {/* Second section for entering the amount to transfer */}
        <fieldset>
          <legend>Amount:</legend>
          <ul>
            <li>
              {/* Input field for amount. Updates `amount` whenever the user types */}
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </li>
          </ul>
        </fieldset>

        {/* Transfer button that triggers handleClick when clicked */}
        <p className="trade-buttons">
          <button id="btn-transfer" onClick={handleClick} disabled={isDisabled}>
            Transfer
          </button>
        </p>
        <p hidden={isHidden}>{feedback}</p>
      </div>
    </div>
  );
}

// Export this component so it can be used elsewhere in the app
export default Transfer;
