const { utils } = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
console.log(toHex(utils.randomPrivateKey()));