import "./Home.css";
import TransactionCard from "../../components/TransactionCard/TransactionCard";
import Navbar from "../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import loading from "../../icons/loading.svg"
import TransactionCartCard from "../../components/TransactionCartCard/TransactionCartCard";
import JudgeHistoryCard from "../../components/JudgeHistoryCard/JudgeHistoryCard";
import { chainConfig } from "../../constant/constant";

const Home = ({ setPage, setChainId, chainId, web3auth }: { setPage: (page: string) => void, setChainId: (chainId: string) => void, chainId: string, web3auth: any }) => {
  const [mode, setMode] = useState("cart");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [judgeHistory, setJudgeHistory] = useState<any[]>([]);
  

  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: "Product 1",
        price: 100,
        quantity: 1,
      },
      {
        id: 2,
        name: "Product 2",
        price: 200,
        quantity: 2,
      },
      {
        id: 3,
        name: "Product 3",
        price: 300,
        quantity: 3,
      },
    ]
    const mockTransactions = [
      {
        id: 1,
        name: "Transaction 1",
        price: 100,
        quantity: 1,
        status: "success",
        when: "2024-01-01",
        tx: "0x1234567890abcdef",
        address: "0x1234567890abcdef",
      }
    ]
    const mockJudgeHistory = [
      {
        image: "https://cdn.pixabay.com/photo/2020/09/28/04/44/hippopotamus-5608509_1280.jpg",
        subject: "Who is the best judge?",
        description: "I think the judge is the best",
        productName: "Product 1",
        price: "100",
        date: "2024-01-01",
        progress: 50,
        status: "success",
      },
      {
        image: "https://cdn.pixabay.com/photo/2020/09/28/04/44/hippopotamus-5608509_1280.jpg",
        subject: "Who is the best judge?",
        description: "I think the judge is the best",
        productName: "Product 1",
        price: "100",
        date: "2024-01-01",
        progress: 50,
        status: "pending",
      }
    ]
    setProducts(mockProducts);
    setTransactions(mockTransactions);
    setJudgeHistory(mockJudgeHistory);
    setIsLoading(false);
  }, []);



  const handleRemoveClick = (id: number) => {
    setProducts(products.filter((product: any) => product.id !== id));
  }

  const handleReportClick = () => {
    setPage("report");
  }

  const getExtensionData = async () => {
    const data = await (window as any).chrome.storage.local.get('extensionData');
    console.log("Extension data:", data);
  }
  return (
    <div className="home-container">
      <Navbar setPage={setPage} action="home" blockExplorerUrl={chainConfig[chainId as keyof typeof chainConfig].blockExplorerUrl} />
      <div className="home-mode-buttons">
        <button
          className={
            mode === "cart" ? "home-mode-button-selected" : "home-mode-button"
          }
          onClick={() => setMode("cart")}
        >
          Cart
        </button>
        <button
          className={
            mode === "order" ? "home-mode-button-selected" : "home-mode-button"
          }
          onClick={() => setMode("order")}
        >
          Order
        </button>
        <button
          className={
            mode === "history"
              ? "home-mode-button-selected"
              : "home-mode-button"
          }
          onClick={() => setMode("history")}
        >
          Report History
        </button>
      </div>
      {isLoading ? (
        <img src={loading} alt="loading" />
      ) : mode === "cart" ? (
        <div className="transaction-list">
          {products.length > 0 ? (
            products.map((product: any) => (
              <TransactionCartCard key={product.id} {...product} amount="1" handleRemoveClick={() => handleRemoveClick(product.id)} />
            ))
          ) : (
            <h1 style={{ color: "var(--primary-color)" }}>No products</h1>
          )}
          <button style={{ width: "100%" }}>Checkout</button>
          <button style={{ width: "100%" }} onClick={getExtensionData}>log</button>
        </div>
      ) : mode === "order" ? (
        <div className="transaction-list">
          {transactions.length > 0 ? (
            transactions.map((transaction: any) => (
              <TransactionCard key={transaction.id} {...transaction} image={transaction.image} blockExplorerUrl={chainConfig[chainId as keyof typeof chainConfig].blockExplorerUrl} handleReportClick={handleReportClick} />
            ))
          ) : (
            <h1 style={{ color: "var(--primary-color)" }}>No transactions</h1>
          )}
        </div>
      ) : (
        <div className="transaction-list">
          {judgeHistory.length > 0 ? (
            judgeHistory.map((history: any) => (
              <JudgeHistoryCard key={history.id} {...history} />
            ))
          ) : (
            <h1 style={{ color: "var(--primary-color)" }}>No History</h1>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
