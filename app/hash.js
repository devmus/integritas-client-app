const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { sha3_256 } = require("js-sha3");

// Load keys
const PRIVATE_KEY_PATH = path.join(__dirname, "keys", "private.pem");
const PUBLIC_KEY_PATH = path.join(__dirname, "keys", "public.pem");

function hashData(data) {
  return sha3_256(data).toUpperCase(); // returns a hex string
}

function signHash(hashHex) {
  const privateKey = fs.readFileSync(PRIVATE_KEY_PATH, "utf8");
  const signature = crypto.sign(null, Buffer.from(hashHex, "hex"), privateKey);
  return signature.toString("hex");
}

module.exports.prepareData = async () => {
  const filePath = path.resolve(__dirname, "../files/abc.md");
  const buffer = fs.readFileSync(filePath);
  const publicKey = fs.readFileSync(PUBLIC_KEY_PATH, "utf8");

  const hash = hashData(buffer);

  const signature = signHash(hash);

  const payload = {
    hash,
    signature,
    publicKey,
    timestamp: Date.now(),
  };

  const payloadHash = sha3_256(
    JSON.stringify(payload, Object.keys(payload).sort())
  ).toUpperCase();

  const message = {
    payload,
    payloadHash,
    hashAlgorithm: "SHA3-256",
    signatureAlgorithm: "RSA-PSS",
    version: "1.0",
  };

  return message;
};
