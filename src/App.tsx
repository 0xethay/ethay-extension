import { useState, useEffect } from "react";
import "./App.css";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Account from "./pages/Account/Account";
import Report from "./pages/Report/Report";
function App() {
  const [page, setPage] = useState("");
  const [chainId, setChainId] = useState("84532");
  const [web3auth, setWeb3auth] = useState(null);
  const [walletAddress, setWalletAddress] = useState<string>("");

  return (
    <div className="App">
       {page === "home" ? (
          <Home setPage={setPage} setChainId={setChainId} chainId={chainId} web3auth={web3auth} />
        ) : page === "account" ? (
          <Account setPage={setPage} chainId={chainId} web3auth={web3auth} />
        ) : page === "report" ? (
          <Report setPage={setPage} web3auth={web3auth} chainId={chainId}/>
        ) : (
        <Login setPage={setPage} web3auth={web3auth} setWeb3auth={setWeb3auth} chainId={chainId} setChainId={setChainId} setWalletAddress={setWalletAddress} />
      )}
    </div>
  );
}

export default App;