import "./Navbar.css";
import settingIcon from "../../icons/setting-icon.png";
import backIcon from "../../icons/back.png";
import externalLinkIcon from "../../icons/external-link.png";
import { chainConfig } from "../../constant/constant";

const Navbar = ({ setPage, action, blockExplorerUrl, chainId }: { setPage: (page: string) => void, action: string, blockExplorerUrl: string, chainId : string }) => {

  const walletAddress = localStorage.getItem("walletAddress");
  const handleClick = () => {
    if (action === "setting") {
      setPage("home");
    } else {
      setPage("account");
    }
  };



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
            <p className="account-balance-text">Balance: 0 {chainConfig[chainId as keyof typeof chainConfig].nativeCurrency.symbol}, USD: 0 $</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
