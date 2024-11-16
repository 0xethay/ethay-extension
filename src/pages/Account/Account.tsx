import React from "react";
import "./Account.css";
import Navbar from "../../components/Navbar/Navbar";
import { chainConfig } from "../../constant/constant";

const Account = ({ setPage, chainId, web3auth }: { setPage: (page: string) => void, chainId: string, web3auth: any }) => {
  const handleSignUpClick = () => {
    setPage("home");
  };

  return (
    <div className="account-container">
      <Navbar action={"setting"} setPage={setPage} blockExplorerUrl={chainConfig[chainId as keyof typeof chainConfig].blockExplorerUrl} chainId={chainId} web3auth={web3auth} />
      <span className="account-header-text">Address</span>
      <textarea className="custom-text-area"></textarea>
        <button onClick={handleSignUpClick}>
          Submit
        </button>
    </div>
  );
};

export default Account;
