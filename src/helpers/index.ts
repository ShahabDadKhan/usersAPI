import crypto from "crypto";

const SECRET = "TORUKMAKTO-REST-API";

// The crypto.randomBytes method generates a specified number of random bytes. In this case, it generates 128 random bytes.
export const random = () => crypto.randomBytes(128).toString("base64");
// The generated random bytes are then converted to a Base64-encoded string using the toString method with the argument "base64".
// This step transforms the binary data into a string representation, which is commonly used to represent random data in a human-readable format.

//  This type of process is often used for secure password hashing and authentication in web applications.
export const authentication = (salt: string, password: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(SECRET)
    .digest("hex");
};

// 1) crypto.createHmac("sha256", [salt, password].join("/")):
//    This uses the crypto.createHmac method to create a Hash-based Message Authentication Code (HMAC) with the SHA-256 hashing algorithm.
//    The first argument to createHmac is the hashing algorithm ("sha256").
//    The second argument is the key used for the HMAC. In this case, it's the concatenation of the salt and password joined with a forward slash ("/").

// 2) .update(SECRET):
//    This method updates the HMAC with additional data. In this case, it updates the HMAC with the SECRET constant,
//    which is appended to the data processed by the HMAC.

// 3) .digest("hex"):
//    This method finalizes the HMAC and produces the hexadecimal representation of the resulting hash.

// In summary, the authentication function takes a salt and a password, combines them with a forward slash ("/"),
// uses this combination as the key for an HMAC with SHA-256, updates the HMAC with the SECRET, and then returns the resulting hash as a hexadecimal string.
// This type of process is often used for secure password hashing and authentication in web applications. The SECRET serves as an additional layer of security.
