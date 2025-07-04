import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";

actor Token {

  // To retrieve the principal from the terminal, execute the following command:
  // dfx identity get-principal
  var owner : Principal = Principal.fromText("principal-goes-here");

  // variable that stores the total supply of this crypto token
  var totalSupply : Nat = 1000000000;
  // Symbol for this crypto token
  var symbol : Text = "DZAC";

  // Hashmap (hashtable): maps keys to tables; efficent way to index items
  // Create a mutable HashMap named `balances` that maps `Principal` identifiers to `Nat` (natural number) token balances.
  // This keeps track of which user owns how much of this token
  //
  // Arguments explained:
  // - `1`: The initial size hint for the hashmap (can be adjusted based on expected usage; small for now).
  // - `Principal.equal`: A comparison function used to check if two `Principal` values are equal. Required for correct key comparison.
  // - `Principal.hash`: A hashing function that generates a unique hash for each `Principal`. Required for efficient key lookups.
  //
  // Purpose:
  // This hashmap stores each user's token balance, where the `Principal` acts as the user's unique identifier
  // (like an account address), and the `Nat` value represents how many tokens they own.
  //
  var balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);

  // gives all of the tokens to the owner
  balances.put(owner, totalSupply);

  // function that finds out how many tokens the specified user (who parameter) owns
  /// Returns the token balance for a given user (Principal).
  ///
  /// Parameters:
  /// - `who: Principal` — The Principal (user ID) whose token balance is being queried.
  ///
  /// Behavior:
  /// - This is a **query** function, meaning it is read-only and does **not** modify any state on the canister.
  /// - It attempts to retrieve the user's balance from the `balances` HashMap.
  ///   - If the Principal does not exist in the map (i.e., `null` is returned), it defaults to 0.
  ///   - If a balance is found (`?result`), it returns the unwrapped Nat value.
  ///
  /// Returns:
  /// - `Nat` — The number of tokens owned by the provided Principal.
  ///
  public query func balanceOf(who : Principal) : async Nat {

    let balance : Nat = switch (balances.get(who)) {
      case null 0;
      case (?result) result;
    };

    return balance;
  };

  // returns the symbol of the token
  public query func getSymbol() : async Text {
    return symbol;
  };

  // This function is shared, meaning it can be called externally (e.g., by another canister or a user).
  // The (msg) argument gives access to metadata about the caller and call context,
  // including who called the function (msg.caller), which is useful for authentication or logging.
  // This function (payOut()) in particular would typically be used after a user has received their tokens successfully.
  public shared (msg) func payOut() : async Text {
    // msg.caller would return the principal id of the user
    Debug.print(debug_show (msg.caller));

    // the user does not exist in gthe hashmap, so give them 10,000 tokens
    if (balances.get(msg.caller) == null) {
      // Define the amount of tokens to assign. In this case, it’s hardcoded to 10,000.
      let amount = 10000;

      // This line updates the `balances` HashMap, setting the caller's balance to the defined amount.
      // `balances.put(key, value)` associates the caller's Principal ID with the token amount.
      balances.put(msg.caller, amount);

      // Returns a confirmation message as a string.
      return "Success";

    } else {
      return "Already Claimed Tokens";
    };

  };

  // "to" parameter refers to the Principal of the account that the tokens are getting transfered to
  // "amount" parameter refers to how much is getting transfered
  public shared (msg) func transfer(to : Principal, amount : Nat) : async Text {
    // msg.caller contains the Principal id of the account that is sending the $

    // retrieve the balance of the front end user that wants to transfer money from their account
    let fromBalance = await balanceOf(msg.caller);

    if (fromBalance > amount) {
      // transfer the money to the "to" account

      // update the frontend user's balance (tokens have been withdrawn)
      let newFromBalance : Nat = fromBalance - amount;
      balances.put(msg.caller, newFromBalance);

      // update the balance for the account that the tokens are getting transferred to
      let oldToBalance : Nat = await balanceOf(to);
      let newToBalance : Nat = amount + oldToBalance;
      balances.put(to, newToBalance);

      return "Success.";
    } else {
      // transfer fails; can't transfer money that you don't have lol
      return "Insufficient funds.";

    };
  };

};
