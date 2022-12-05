import Login from "./Login";
import Wallet from "./Wallet";
import Transfer from "./Transfer";
import Addresses from "./Addresses";
import server from "./server";
import "./App.scss";
import { useState, useEffect } from "react";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import * as secp from "ethereum-cryptography/secp256k1";

const getAddress = (privateKey) => {
    const publicKey = secp.getPublicKey(privateKey);
    const hash = keccak256(publicKey.slice(1));
    return '0x' + toHex(hash.slice(hash.length - 20));
};

async function getBalance(address) {
  const { data: { balance } } = await server.get(`balance/${address}`);
  return balance;
}

function App() {
  const [ privateKey, setPrivateKey ] = useState("");
  const [ balance, setBalance ] = useState(0);
  const [ address, setAddress ] = useState("");
  const [ addresses, setAddresses ] = useState([]);

  useEffect(() => {
    if (privateKey) {
      const address = getAddress(privateKey)
      setAddress(address);
      getBalance(address).then(balance => setBalance(balance));
      fetchAddresses();
    }
  }, [ privateKey ]);

  async function sign(message) {
    const messageHash = keccak256(utf8ToBytes(message));
    const [ signature, recoveryBit ] = await secp.sign(messageHash, privateKey, { recovered: true });
    return '0x' + toHex(signature) + recoveryBit;
  };

  function fetchAddresses() {
    server.get('addresses')
      .then(({ data: { addresses } }) => setAddresses(addresses))
      .catch(console.error);
  }

  return (
    <div className="app">
      { !privateKey 
        ? <Login setPrivateKey={ setPrivateKey } />
        : <>
          <Wallet balance={ balance } address={ address } />
          <Transfer address={ address }
            sign={sign}
            setBalance={ setBalance }
            fetchAddresses={ fetchAddresses } />
          <Addresses addresses={ addresses }/>
        </> }
    </div>
  );
}

export default App;
