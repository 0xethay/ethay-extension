import { useState } from "react";
import "./App.css";
import Login from "./pages/Login/Login";

function App() {
  const [page, setPage] = useState("");
  const [chainId, setChainId] = useState("84532");
  const [web3auth, setWeb3auth] = useState(null);

  return (
    <div className="App">
      <Login setPage={setPage} web3auth={web3auth} setWeb3auth={setWeb3auth} chainId={chainId} setChainId={setChainId} />
    </div>
  );
}

export default App;