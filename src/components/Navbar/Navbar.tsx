import "./Navbar.css";
import settingIcon from "../../icons/setting-icon.png";
import backIcon from "../../icons/back.png";
import externalLinkIcon from "../../icons/external-link.png";
import { chainConfig } from "../../constant/constant";
import { ethers, parseUnits } from "ethers";
import { usdContractAddress } from "../../constant/constant";
import { useState, useEffect } from "react";
import { parseEther } from "ethers";
import { formatEther } from "../../Helpers/Helpers";

const Navbar = ({ setPage, action, blockExplorerUrl, chainId, web3auth }: { setPage: (page: string) => void, action: string, blockExplorerUrl: string, chainId : string, web3auth: any }) => {

  const [ethBalance, setEthBalance] = useState<any>("0");
  const [usdBalance, setUsdBalance] = useState<any>("0");
  const walletAddress = localStorage.getItem("walletAddress");
  const handleClick = () => {
    if (action === "setting") {
      setPage("home");
    } else {
      setPage("account");
    }
  };

  const getEthBalance = async () => {
    const provider = new ethers.BrowserProvider(web3auth.provider);
    const balance = await provider.getBalance(walletAddress as string);
    console.log("balance",balance);
    console.log("formatEther(balance.toString())",formatEther(Number(balance)))
    setEthBalance(formatEther(Number(balance)));
  }

  const getUsdBalance = async () => {
    const usdContract = usdContractAddress
    const abi = [
      "function balanceOf(address) view returns (uint256)"
    ];
    const provider = new ethers.BrowserProvider(web3auth.provider);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(usdContract, abi, signer);
    const balance = await contract.balanceOf(walletAddress as string);
    console.log(balance);
    console.log("formatEther(balance.toString())",formatEther(Number(balance)))
    setUsdBalance(formatEther(Number(balance)));
  }
  
  useEffect(() => {
    getEthBalance();
    getUsdBalance();
  }, []);



  return (
    <div className="navbar">
      {action === "setting" ? (
        <div className="nav-setting">
          <div className="setting-box">
            <div onClick={handleClick}>
              <img src={backIcon} alt="back-icon" className="back-icon" />
            </div>
            <h2 className="setting-header-text">Setting</h2>
          </div>
        </div>
      ) : (
        <div style={{ columnGap: "10px" }}>
          <div className="account-box">
            <p style={{ color: "var(--primary-color)", display: "flex", alignItems: "center", fontSize: "12px", fontWeight: "bold" }}>{walletAddress} <img src={externalLinkIcon} style={{ width: "12px", height: "12px", cursor: "pointer" }} alt="external-link-icon" className="external-link-icon" onClick={() => window.open(blockExplorerUrl + "address/" + walletAddress, "_blank")} /></p>
            <div onClick={handleClick}>
              <img
                src={settingIcon}
                alt="setting-icon"
                className="setting-icon"
              />
            </div>
          </div>
          <div className="account-balance-box">
            <p className="account-balance-text">Balance: {ethBalance} {chainConfig[chainId as keyof typeof chainConfig].nativeCurrency.symbol}, USD: {usdBalance} $</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
