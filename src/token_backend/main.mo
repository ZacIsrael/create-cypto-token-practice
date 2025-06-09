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

};
