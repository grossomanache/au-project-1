import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";

const { sign, getPublicKey } = secp256k1;

export const hashMessage = (message) => {
  const messageAsBytes = utf8ToBytes(message);
  const hashedMessage = keccak256(messageAsBytes);

  return hashedMessage;
};

export const recoverKey = async (message, signature, recoveryBit) => {
  const hashedMessage = hashMessage(message);
  const key = await getPublicKey(hashedMessage, signature, recoveryBit);
  return key;
};

export const signMessage = async (msg, privateKey) => {
  const hashedMessage = hashMessage(msg);
  const signature = await sign(hashedMessage, privateKey);

  return { signature, hashedMessage };
};

export const getAddress = (publicKey) => {
  const usedKey = publicKey.slice(1, publicKey.length);
  const hashedKey = keccak256(usedKey);
  const usedHashedKey = hashedKey.slice(-20);
  return usedHashedKey;
};
