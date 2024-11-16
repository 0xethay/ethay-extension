import "./TransactionCartCard.css";
import copyIcon from "../../icons/copy.png";
import removeIcon from "../../icons/remove.png";
import { numberWithCommas } from "../../Helpers/Helpers";
const TransactionCartCard = ({ amount, name, price, handleRemoveClick, onAmountChange, id }: { amount: string, name: string, price: string, handleRemoveClick: () => void, onAmountChange: (value: string, id: string) => void, id: string }) => {

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
          <span>Amount: <input type="number" value={amount} onChange={(e) => onAmountChange(e.target.value, id)} /></span>
          <p>price: {numberWithCommas(Number(price) * Number(amount))}</p>
        </div>
        <div className="transaction-remove" onClick={handleRemoveClick}>
          <img src={removeIcon} alt="remove" style={{ width: "100%", height: "100%" }}/>
        </div>
      </div>
    </div>
  );
};

export default TransactionCartCard;
