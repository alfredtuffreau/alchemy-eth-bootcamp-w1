import { useState, useEffect } from 'react';
import server from "./server";

function Addresses({ addresses }) {
  return (
    <div className="container addresses">
      <h1>Existing addresses</h1>
      <ul>
        { addresses.map((address, index) => <li key={ `address-${index}` }>{ address }</li>) }
      </ul>
    </div>
  );
}

export default Addresses;
