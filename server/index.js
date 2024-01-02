const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");

const {
  secp256k1: { verify },
} = secp;

app.use(cors());
app.use(express.json());

const balances = {
  "0x1": 100,
  "0x2": 50,
  "0x3": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

function fromJSON(jsonString) {
  let obj = JSON.parse(jsonString);

  // Convert specific fields back to BigInt
  if (obj.r !== undefined) {
    obj.r = BigInt(obj.r);
  }
  if (obj.s !== undefined) {
    obj.s = BigInt(obj.s);
  }

  // Add similar lines for other BigInt fields if necessary

  return obj;
}

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, publicKey, message } = req.body;

  const isTransactionValid = verify(
    fromJSON(signature),
    new Uint8Array(Object.values(message)),
    new Uint8Array(Object.values(publicKey))
  );

  if (!isTransactionValid) {
    res.status(400).send({ message: "Transaction is not valid" });
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
