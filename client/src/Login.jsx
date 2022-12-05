import { useState } from "react";

function Login({ setPrivateKey }) {
  const [loginInput, setLoginInput] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value.toLowerCase());

  async function login(evt) {
    evt.preventDefault();
    if (/^[0-9A-Fa-f]{64}$/.test(loginInput))
      setPrivateKey(loginInput);
    else
      alert("Invalid key: must be a 64 characters long hexadecimal string!");
  }

  return (
    <form className="container login" onSubmit={login}>
      <h1>Login</h1>

      <label>
        Private key
        <input placeholder="abcdef0123456789..." value={loginInput} onChange={setValue(setLoginInput)} />
      </label>

      <input type="submit" className="button" value="Login" />
    </form>
  );
}

export default Login;
