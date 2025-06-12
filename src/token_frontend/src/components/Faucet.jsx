import React, { useState } from "react";
import { token_backend } from "../../../declarations/token_backend";

function Faucet() {
  // determines whether or not the button is disabled or not
  const [isDisabled, setDisabled] = useState(false);

  // determines what the text in the button will be
  const [buttonText, setButtonText] = useState("Gimme gimme");

  async function handleClick(event) {
    // Disable the button so the user can't click it once they have
    // already clicked it. 
    setDisabled(true);
    // payOut returns "Success" or "Already Claimed Tokens" (see main.mo)
    const result = await token_backend.payOut();
    // set the button's text to what was returned from payOut()
    setButtonText(result);
   
  }

  return (
    <div className="blue window">
      <h2>
        <span role="img" aria-label="tap emoji">
          🚰
        </span>
        Faucet
      </h2>
      <label>
        Get your free DAngela tokens here! Claim 10,000 DANG coins to your
        account.
      </label>
      <p className="trade-buttons">
        <button id="btn-payout" onClick={handleClick} disabled={isDisabled}>
          {buttonText}
        </button>
      </p>
    </div>
  );
}

export default Faucet;
