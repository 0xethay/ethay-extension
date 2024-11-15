import "./Home.css";
import TransactionCard from "../../components/TransactionCard/TransactionCard";
import Navbar from "../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import loading from "../../icons/loading.svg"
import TransactionCartCard from "../../components/TransactionCartCard/TransactionCartCard";
import { chainConfig } from "../../constant/constant";

const Home = ({ setPage, setChainId, chainId, web3auth }: { setPage: (page: string) => void, setChainId: (chainId: string) => void, chainId: string, web3auth: any }) => {
  const [mode, setMode] = useState("cart");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  

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
    setProducts(mockProducts);
    setTransactions(mockTransactions);
    setIsLoading(false);
  }, []);



  const handleRemoveClick = (id: number) => {
    setProducts(products.filter((product: any) => product.id !== id));
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
          History
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
            <h1 style={{ color: "black" }}>No products</h1>
          )}
          <button style={{ width: "100%" }}>Checkout</button>
        </div>
      ) : mode === "order" ? (
        <div className="transaction-list">
          {transactions.length > 0 ? (
            transactions.map((transaction: any) => (
              <TransactionCard key={transaction.id} {...transaction} image={transaction.image} blockExplorerUrl={chainConfig[chainId as keyof typeof chainConfig].blockExplorerUrl} />
            ))
          ) : (
            <h1 style={{ color: "black" }}>No transactions</h1>
          )}
        </div>
      ) : (
        <div className="transaction-list">
          <h1 style={{ color: "black" }}>No History</h1>
        </div>
      )}
    </div>
  );
};

export default Home;
