const express = require("express");
const cors = require("cors");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");

const app = express();
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0x982f05583108ad48be586109d8f7b5090fc32959": 100,
  "0x083209d78ffd79dfb0fbca78e6314af97868b084": 50,
  "0xe25dae0bc265bab37d056851b5c9be381d94e712": 75,
};

app.get("/addresses", (_, res) => {
  const addresses = Object.keys(balances);
  res.send({ addresses });
});

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, amount, recipient, signature } = req.body;
  const tx = { sender, amount, recipient };
  const signer = recoverAddress(JSON.stringify(tx), signature.slice(2, -1), signature.slice(-1));

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else if (sender !== signer) {
    res.status(400).send({ message: "Not yours!" });
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

function recoverAddress(message, signature, recoveryBit) {
  const messageHash = keccak256(utf8ToBytes(message));
  const publicKey = secp.recoverPublicKey(messageHash, signature, parseInt(recoveryBit));
  const hash = keccak256(publicKey.slice(1));
  return '0x' + toHex(hash.slice(hash.length - 20));
}
