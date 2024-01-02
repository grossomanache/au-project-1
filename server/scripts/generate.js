const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

const {
  secp256k1: {
    getPublicKey,
    utils: { randomPrivateKey },
  },
} = secp;

const privateKey = randomPrivateKey();

console.log("private key", toHex(privateKey));

const publicKey = getPublicKey(privateKey);

console.log("public key", toHex(publicKey));
