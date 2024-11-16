import "./Home.css";
import TransactionCard from "../../components/TransactionCard/TransactionCard";
import Navbar from "../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import loading from "../../icons/loading.svg"
import TransactionCartCard from "../../components/TransactionCartCard/TransactionCartCard";
import JudgeHistoryCard from "../../components/JudgeHistoryCard/JudgeHistoryCard";
import { chainConfig, usdContractAddress } from "../../constant/constant";
import { gql, ApolloClient, InMemoryCache } from '@apollo/client';
import { ethers } from "ethers";
import { ethayContractAddress } from "../../constant/constant";
import { parseEther } from "ethers";
import { SupabaseClient } from "@supabase/supabase-js";

const Home = ({ setPage, setChainId, chainId, web3auth }: { setPage: (page: string) => void, setChainId: (chainId: string) => void, chainId: string, web3auth: any }) => {
  const [mode, setMode] = useState("cart");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [judgeHistory, setJudgeHistory] = useState<any[]>([]);
  const [walletAddress, setWalletAddress] = useState<string>("");

  const graphClient = new ApolloClient({
    uri: 'https://api.studio.thegraph.com/query/54090/ethay/version/latest',
    cache: new InMemoryCache(),
  });

  const supabaseClient = new SupabaseClient(
    'https://awywwzfpjnyyvbboboyi.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3eXd3emZwam55eXZiYm9ib3lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc5OTY2MTksImV4cCI6MjA0MzU3MjYxOX0.lXFfWhUuACvTElH7X75rPIFVpwe9ylTGxUwhaxIha9M'
  );

  useEffect(() => {
    const addMembers = async () => {
      const walletAddress = localStorage.getItem('walletAddress') || '';
      if (walletAddress) {
        const { data, error } = await supabaseClient
          .from('members')
          .select('*')
          .eq('walletaddress', walletAddress)
          .single();

        if (error) {
          const { data: newData, error: newError } = await supabaseClient
            .from('members')
            .insert([{ wallet_address: walletAddress }])
            .select();
          if (newError) {
            throw new Error(newError.message);
          }
        }
      }
    };
    addMembers();
    const fetchOrders = async () => {
      const walletAddress = localStorage.getItem('walletAddress') || '';
      setWalletAddress(walletAddress);
      if (walletAddress) {
        try {
          await listOrdersBuyer(walletAddress);
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      }
    };

    fetchOrders(); // Initial fetch

  }, []);



  async function listOrdersBuyer(walletAddress: string) {
    const tokenQuery = `{
      purchases(where: { buyer: "${walletAddress}" }) {
        id
        product {
          id
          name
          price
          quantity
          isForSale
          usdtBalance
          ipfsLink
          description
          seller {
            id
            isSeller
          }
        }
        buyer {
          id
          isSeller
        }
        transactions(where: { type: "PURCHASE" }) {
         id
          type
        }
        quantity
        totalPrice
        isConfirmed
        purchaseTime
        isDisputed
        referrer {
          id
          isSeller
          isJudge
          referralRewards
        }
      }
    }`;

    const subgraph_data = await graphClient
      .query({
        query: gql(tokenQuery),
      })
      .then((data) => data)
      .catch((err) => {
        console.log('Error fetching data: ', err);
        return null;
      });

    if (!subgraph_data) {
      throw new Error('Failed to fetch subgraph data');
    }

    const { data: memberData, error: memberError } = await supabaseClient
      .from('members')
      .select('delivery_address')
      .eq('wallet_address', walletAddress)
      .single();

    if (memberError) {
      throw new Error(memberError.message);
    }

    const purchase = subgraph_data.data.purchases[0];
    const purchaseTime = purchase.purchaseTime;
    const deliveryAddress = memberData?.delivery_address;
    const status = deliveryAddress
      ? 'waiting_for_delivery'
      : 'waiting_for_address';

    const orderData = {
      purchase_id: purchase.id,
      product_id: purchase.product.id,
      buyer_id: walletAddress,
      seller_id: purchase.product.seller.id,
      product_name: purchase.product.name,
      order_date: purchaseTime
        ? new Date(purchaseTime * 1000).toISOString()
        : new Date().toISOString(),
      totalPrice: parseInt(ethers.formatUnits(purchase.totalPrice, 18)),
      quantity: purchase.quantity,
      image: purchase.product.ipfsLink,
      subgraph_data: purchase,
      delivery_address: deliveryAddress || null,
      status: status,
      tx: purchase.transactions[0].id,
    };

    const { data: existingOrder, error: fetchError } = await supabaseClient
      .from('orders')
      .select('*')
      .eq('purchase_id', orderData.purchase_id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw new Error(fetchError.message);
    }

    if (existingOrder) {
      if (
        existingOrder.status === 'waiting_for_delivery' ||
        existingOrder.status === 'waiting_for_address'
      ) {
        const { data: updatedOrder, error: updateError } = await supabaseClient
          .from('orders')
          .update(orderData)
          .eq('purchase_id', orderData.purchase_id)
          .select();

        if (updateError) {
          throw new Error(updateError.message);
        }

        return updatedOrder;
      } else {
        return existingOrder;
      }
    } else {
      const { data, error } = await supabaseClient
        .from('orders')
        .insert([orderData])
        .select();

      if (error) {
        throw new Error(error.message);
      }
    }

    const { data, error } = await supabaseClient
      .from('orders')
      .select('*')
      .eq('buyer_id', walletAddress);

    if (error) {
      throw new Error(error.message);
    }

    setTransactions(data);
    return data;

  }

  const queryProduct = async () => {
    try {
      // Retrieve extension data from local storage
      const extensionData = await (window as any).chrome.storage.local.get('extensionData');
      console.log("extensionData", extensionData)

      // Check if extensionData and items exist
      if (!extensionData || !extensionData.extensionData) {
        console.error('No extension data found');
        return; // Exit if no data is found
      }

      const extensionDataItems = extensionData.extensionData;

      console.log("extensionDataItems", extensionDataItems)
      const mappedProducts = extensionDataItems.map((item: any) => item.id);
      console.log("mappedProducts", mappedProducts)

      const tokenQuery = `{
            products(where: { id_in: [${mappedProducts.map((id: any) => `"${id}"`).join(", ")}] }) { 
                id
                name
                price
                quantity
                isForSale
                usdtBalance
                ipfsLink
                description
            }
        }`;

      const subgraph_data = await graphClient.query({ query: gql(tokenQuery) });

      console.log('subgraph_data queryProduct', subgraph_data?.data.products);

      const productsWithAmounts = subgraph_data?.data.products.map((product: any) => {
        const matchingItem = extensionDataItems.find((item: any) => item.id.toString() === product.id);
        return { ...product, amount: matchingItem ? matchingItem.amount : 0 };
      });

      return productsWithAmounts;
    } catch (err) {
      console.error('Error fetching data: ', err);
    }
  }

  const queryTransaction = async () => {
    const transactionQuery = `{
      purchases(where: { buyer: "${localStorage.getItem("walletAddress")}" }) {
        id
        product {
          id
          name
          price
          quantity
          isForSale
          usdtBalance
          ipfsLink
          description
          seller {
            id
            isSeller
          }
        }
        buyer {
          id
          isSeller
        }
        quantity
        totalPrice
        isConfirmed
        purchaseTime
        isDisputed
        referrer {
          id
          isSeller
          isJudge
          referralRewards
        }
      }
    }`;

    const subgraph_data = await graphClient
      .query({
        query: gql(transactionQuery),
      })
      .then((data) => data)
      .catch((err) => {
        console.log('Error fetching data: ', err);
        return null;
      });

    console.log('subgraph_data', subgraph_data?.data.purchases);

    const data = subgraph_data?.data.purchases || [];
    const formattedTransactions = data.map((item: any) => {
      const product = item.product;
      const buyer = item.buyer;

      const when = new Date(item.purchaseTime * 1000).toLocaleString();

      return {
        tx: item.id,
        amount: (item.totalPrice / Math.pow(10, 18)).toFixed(2),
        when: when,
        id: item.id.toString(),
        address: product.seller.id,
        status: item.isConfirmed ? 'success' : 'waiting',
        name: product.name,
        ipfsLink: product.ipfsLink,
        blockExplorerUrl: chainConfig[chainId as keyof typeof chainConfig].blockExplorerUrl,
        handleReportClick: () => console.log("Report clicked for tx", item.id),
      };
    });

    setTransactions(formattedTransactions);
  };



  useEffect(() => {

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
    const query = async () => {
      setIsLoading(true);
      const query = await queryProduct();
      setProducts(query);
      console.log('queryProduct', query);
      setIsLoading(false);
    }
    query();
    queryTransaction();
    setJudgeHistory(mockJudgeHistory);
  }, []);


  //write code to clear local storage
  const handleClearLocalStorage = async () => {
    await (window as any).chrome.storage.local.clear();
  }

  const handleRemoveClick = async (id: string) => {
    // Retrieve extension data from local storage
    const extensionData = await (window as any).chrome.storage.local.get('extensionData');
    const extensionDataItems = extensionData.extensionData;

    // Log the current items for debugging
    console.log('Items before removal:', extensionDataItems);

    // Filter out the item with the matching id
    const filteredItems = extensionDataItems.filter((item: any) => item.id.toString() !== id)
    // Log the filtered items for debugging
    console.log('Filtered items:', filteredItems);

    // Update local storage with the filtered items
    await (window as any).chrome.storage.local.set({ extensionData: { filteredItems } });

    // Update the products state
    setProducts(products.filter((product: any) => product.id !== id)); // Ensure id types match
  }

  const handleReportClick = () => {
    setPage("report");
  }

  const getExtensionData = async () => {
    const data = await (window as any).chrome.storage.local.get('extensionData');
    console.log("Extension data:", data);
  }

  const handleMint = async () => {
    console.log("handleMint...")
    const contractAddress = usdContractAddress;
    const provider = new ethers.BrowserProvider(web3auth.provider);
    const signer = await provider.getSigner();

    const abi = [
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256"
          }
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      }
    ];

    const contract = new ethers.Contract(contractAddress, abi, signer);
    const account = localStorage.getItem("walletAddress");
    const amount = parseEther("10000000000");
    console.log("amount", amount)
    console.log("account", account)
    const tx = await contract.mint(account, amount);
    const receipt = await tx.wait();
    console.log("Transaction successful:", receipt);
  }

  const checkout = async (product: any) => {
    try {
      console.log("handleCheckout...");
      const provider = new ethers.BrowserProvider(web3auth.provider);
      const signer = await provider.getSigner();

      // 1. First approve USDT spending
      const usdtContract = new ethers.Contract(usdContractAddress, [
        {
          inputs: [
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" }
          ],
          name: "approve",
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          stateMutability: "nonpayable",
          type: "function"
        }
      ], signer);

      // Calculate total price
      const totalPrice = ethers.parseUnits(product.price, 18); // Adjust based on your product price

      // Approve the ethay contract to spend USDT
      const approveTx = await usdtContract.approve(ethayContractAddress, totalPrice);
      await approveTx.wait();
      console.log("Approval successful");

      // 2. Then call buyProduct
      const ethayContract = new ethers.Contract(ethayContractAddress, [
        {
          inputs: [
            { internalType: "uint256", name: "_id", type: "uint256" },
            { internalType: "uint256", name: "_quantity", type: "uint256" },
            { internalType: "address", name: "_referrer", type: "address" }
          ],
          name: "buyProduct",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function"
        }
      ], signer);

      const productId = product.id;
      const quantity = product.amount;
      const referrerAddress = "0xe219f46e0aa82c274ab9baf4de43ee5a0b9bb156";

      const buyTx = await ethayContract.buyProduct(productId, quantity, referrerAddress);
      const receipt = await buyTx.wait();
      console.log("Purchase successful:", receipt);
      if (receipt) {

      }
    } catch (error) {
      console.error("Error in checkout:", error);
    }
  };

  const handleCheckout = async () => {
    products.forEach(async (product: any) => {
      await checkout(product);
    });
  }


  const handleAmountChange = async (value: string, id: string) => {
    const extensionData = await (window as any).chrome.storage.local.get('extensionData');
    let extensionDataItems = extensionData.extensionData || []; // Initialize as an empty array if undefined

    // Ensure extensionDataItems is an array
    if (!Array.isArray(extensionDataItems)) {
      console.error("extensionDataItems is not an array:", extensionDataItems);
      extensionDataItems = []; // Reset to an empty array if it's not
    }

    if (value === "0") {
      handleRemoveClick(id);
    } else {
      const updatedItems = extensionDataItems.map((item: any) =>
        item.id.toString() === id ? { ...item, amount: value } : item
      );
      console.log("updatedItems", updatedItems);
      await (window as any).chrome.storage.local.set({ extensionData: updatedItems }); // Store updated items directly
      console.log("product", products);
      const updatedProducts = products.map((product: any) =>
        product.id.toString() === id ? { ...product, amount: value } : product
      );
      setProducts(updatedProducts);
    }
  }


  return (
    <div className="home-container">
      <Navbar setPage={setPage} action="home" blockExplorerUrl={chainConfig[chainId as keyof typeof chainConfig].blockExplorerUrl} chainId={chainId} web3auth={web3auth} />
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
          {products?.length > 0 ? (
            products.map((product: any) => (
              <TransactionCartCard key={product.id} {...product} amount={product.amount} handleRemoveClick={() => handleRemoveClick(product.id)} onAmountChange={handleAmountChange} />
            ))
          ) : (
            <h1 style={{ color: "var(--primary-color)" }}>No products</h1>
          )}
          <button style={{ width: "100%" }} onClick={handleCheckout}>Checkout</button>
          <button style={{ width: "100%" }} onClick={getExtensionData}>log</button>
        </div>
      ) : mode === "order" ? (
        <div className="transaction-list">
          {transactions?.length > 0 ? (
            transactions.map((transaction: any) => (
              <TransactionCard key={transaction.id} {...transaction} image={transaction.image} blockExplorerUrl={chainConfig[chainId as keyof typeof chainConfig].blockExplorerUrl} handleReportClick={handleReportClick} />
            ))
          ) : (
            <h1 style={{ color: "var(--primary-color)" }}>No transactions</h1>
          )}
        </div>
      ) : (
        <div className="transaction-list">
          {judgeHistory?.length > 0 ? (
            judgeHistory.map((history: any) => (
              <JudgeHistoryCard key={history.id} {...history} />
            ))
          ) : (
            <h1 style={{ color: "var(--primary-color)" }}>No History</h1>
          )}
        </div>
      )}
      <button onClick={handleMint}>Mint</button>
      <button onClick={handleClearLocalStorage}>Clear Local Storage</button>
    </div>
  );
};

export default Home;
