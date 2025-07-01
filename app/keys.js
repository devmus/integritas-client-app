const fs = require("fs");
const path = require("path");
const { generateKeyPairSync } = require("crypto");

const KEY_DIR = path.join(__dirname, "keys");
const PRIVATE_KEY_PATH = path.join(KEY_DIR, "private.pem");
const PUBLIC_KEY_PATH = path.join(KEY_DIR, "public.pem");

function ensureKeyPair() {
  if (!fs.existsSync(PRIVATE_KEY_PATH) || !fs.existsSync(PUBLIC_KEY_PATH)) {
    console.log("🔐 Creating new key pair...");

    const { publicKey, privateKey } = generateKeyPairSync("ec", {
      namedCurve: "secp256k1",
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    fs.mkdirSync(KEY_DIR, { recursive: true });
    fs.writeFileSync(PRIVATE_KEY_PATH, privateKey, { mode: 0o600 }); // secure
    fs.writeFileSync(PUBLIC_KEY_PATH, publicKey);
  }
}

function loadKeys() {
  return {
    privateKey: fs.readFileSync(PRIVATE_KEY_PATH, "utf-8"),
    publicKey: fs.readFileSync(PUBLIC_KEY_PATH, "utf-8"),
  };
}

module.exports.keyPair = async () => {
  ensureKeyPair();
  return loadKeys();
};
