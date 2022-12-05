function Wallet({ address, balance }) {
  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      <label>
        Address
        <div className="address">{address}</div>
      </label>
      
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
