import "./TransactionCard.css";
import copyIcon from "../../icons/copy.png";

const TransactionCard = ({ tx, amount, when, id, address, status, name, blockExplorerUrl, handleReportClick }: { tx: string, amount: string, when: string, id: string, address: string, status: string, name: string, blockExplorerUrl: string, handleReportClick: () => void }) => {
  const badgeColor =
    status === "success"
      ? "#34D399"
      : status === "waiting"
      ? "#FFAB00"
      : "#FF5630";

  const truncateAddress = (address: string) => {
    return address.slice(0, 6) + "..." + address.slice(-4);
  };

  const copyTx = () => {
    navigator.clipboard.writeText(tx);
  };

  return (
    <div className="transaction-card">
      <div className="transaction-box">
        <div className="transaction-icon">
          <div className="transaction-image">
            <img
              src={
                "https://cdn.pixabay.com/photo/2020/09/28/04/44/hippopotamus-5608509_1280.jpg"
              }
              alt="tx-icon"
              className="product-image"
            />
          </div>
        </div>
        <div className="transaction-info">
          <p style={{ fontWeight: "bold" }}>Name: {name}</p>
          <div className="transaction-address">
            <p style={{ cursor: "pointer" }} onClick={() => window.open(blockExplorerUrl + "tx/" + tx, "_blank")}>Tx: {truncateAddress(tx)}</p>
            <div className="copy-icon-container">
              <img
                src={copyIcon}
                alt="copy-icon"
                onClick={copyTx}
                style={{ width: "8px", height: "8px", cursor: "pointer" }}
              />
            </div>
          </div>
          <p>Amount: {amount} USDT</p>
          <p>When: {when}</p>
          <p>ID: {id}</p>
          <div className="status-badge">
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: badgeColor,
                  borderRadius: "50%",
                  marginRight: "5px",
                }}
              ></div>
              <span>{status}</span>
            </div>
          </div>
        </div>
      </div>
      <button style={{ width: "95%", marginBottom: "10px" }}>Receive</button>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            width: "95%",
            display: "flex",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          <button style={{ width: "100%" }}>Contact Seller</button>
          <button style={{ width: "100%" }} onClick={handleReportClick}>Report</button>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
