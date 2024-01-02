const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const { convertToSignature, convertToUint8Array } = require("./utils");

const {
  secp256k1: { verify },
} = secp;

app.use(cors());
app.use(express.json());

const balances = {
  "03298e8f1f151755dd3f1fa8c47c649c7ed254c25ca0412af3fe6d0d8a3bbfe8f5": 100,
  "031295125b97ff26e7f51281de5fad6a1e4c6f6f644dd117d954da2ef4b989639b": 50,
  "037a1885b9b978b12739948a8a2126a5b36797af57d9d78f9e90ca98aba2589dc6": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, message } = req.body;

  const formattedSignature = convertToSignature(signature);
  const formattedMessage = convertToUint8Array(message);

  const isTransactionValid = verify(
    formattedSignature,
    formattedMessage,
    sender
  );

  if (!isTransactionValid) {
    return res.status(400).send({ message: "Transaction is not valid" });
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    return res.status(400).send({ message: "Not enough funds!" });
  }
  balances[sender] -= amount;
  balances[recipient] += amount;
  return res.send({ balance: balances[sender] });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
