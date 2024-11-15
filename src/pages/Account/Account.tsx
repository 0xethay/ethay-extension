import React from "react";
import "./Account.css";
import Navbar from "../../components/Navbar/Navbar";
import { chainConfig } from "../../constant/constant";

const Account = ({ setPage, chainId }: { setPage: (page: string) => void, chainId: string }) => {
  const handleSignUpClick = () => {
    setPage("home");
  };

  return (
    <div className="account-container">
      <Navbar action={"setting"} setPage={setPage} blockExplorerUrl={chainConfig[chainId as keyof typeof chainConfig].blockExplorerUrl} chainId={chainId} />
      <span className="account-header-text">Address</span>
      <textarea className="custom-text-area"></textarea>
        <button onClick={handleSignUpClick}>
          Submit
        </button>
    </div>
  );
};

export default Account;
