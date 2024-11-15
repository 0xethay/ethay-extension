import "./Navbar.css";
import settingIcon from "../../icons/setting-icon.png";
import backIcon from "../../icons/back.png";
import externalLinkIcon from "../../icons/external-link.png";

const Navbar = ({ setPage, action, blockExplorerUrl }: { setPage: (page: string) => void, action: string, blockExplorerUrl: string }) => {

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
              <img src={backIcon} alt="back-icon" className="back-icon"/>
            </div>
            <h2 className="setting-header-text">Setting</h2>
          </div>
        </div>
      ) : (
        <div className="account-box">
          <h4 style={{ color: "var(--primary-color)", display: "flex", alignItems: "center" }}>{walletAddress} <img src={externalLinkIcon} style={{ width: "12px", height: "12px", cursor: "pointer" }} alt="external-link-icon" className="external-link-icon" onClick={() => window.open(blockExplorerUrl + "address/" + walletAddress, "_blank")} /></h4>
          <div onClick={handleClick}>
            <img
              src={settingIcon}
              alt="setting-icon"
              className="setting-icon"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
