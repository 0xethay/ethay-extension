import './Home.css';
import TransactionCard from '../../components/TransactionCard/TransactionCard';
import Navbar from '../../components/Navbar/Navbar';
import { useState, useEffect } from 'react';
import loading from '../../icons/loading.svg';
import TransactionCartCard from '../../components/TransactionCartCard/TransactionCartCard';
import JudgeHistoryCard from '../../components/JudgeHistoryCard/JudgeHistoryCard';
import { chainConfig } from '../../constant/constant';
import { gql, ApolloClient, InMemoryCache } from '@apollo/client';
import { ethers } from 'ethers';
import { ethayContractAddress } from '../../constant/constant';
import { SupabaseClient } from '@supabase/supabase-js';

const Home = ({
  setPage,
  setChainId,
  chainId,
  web3auth,
}: {
  setPage: (page: string) => void;
  setChainId: (chainId: string) => void;
  chainId: string;
  web3auth: any;
}) => {
  const [mode, setMode] = useState('cart');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [judgeHistory, setJudgeHistory] = useState<any[]>([]);

  const graphClient = new ApolloClient({
    uri: 'https://api.studio.thegraph.com/query/54090/ethay/version/latest',
    cache: new InMemoryCache(),
  });

  const supabaseClient = new SupabaseClient(
    'https://awywwzfpjnyyvbboboyi.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3eXd3emZwam55eXZiYm9ib3lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc5OTY2MTksImV4cCI6MjA0MzU3MjYxOX0.lXFfWhUuACvTElH7X75rPIFVpwe9ylTGxUwhaxIha9M'
  );
  const [walletAddress, setWalletAddress] = useState<string>('');
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

    const intervalId = setInterval(fetchOrders, 1); // Repeat every 5 minutes

    return () => clearInterval(intervalId); // Cleanup on unmount
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
      const extensionData = await (window as any).chrome.storage.local.get(
        'extensionData'
      );

      // Check if extensionData and items exist
      if (
        !extensionData ||
        !extensionData.extensionData ||
        !extensionData.extensionData.item
      ) {
        console.error('No extension data found');
        return; // Exit if no data is found
      }

      const extensionDataItems = extensionData.extensionData.item;
      const mappedProducts = extensionDataItems.map((item: any) => item.id);

      const tokenQuery = `{
            products(where: { id_in: [${mappedProducts
              .map((id: any) => `"${id}"`)
              .join(', ')}] }) { 
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

      console.log('subgraph_data', subgraph_data?.data.products);

      const productsWithAmounts = subgraph_data?.data.products.map(
        (product: any) => {
          const matchingItem = extensionDataItems.find(
            (item: any) => item.id.toString() === product.id.toString()
          );
          return { ...product, amount: matchingItem ? matchingItem.amount : 0 };
        }
      );

      return productsWithAmounts;
    } catch (err) {
      console.error('Error fetching data: ', err);
    }
  };

  // const queryTransaction = async () => {
  //   const transactionQuery = `{
  //     purchases(where: { buyer: "0x0c328394a8208a4139f4419db20fa9825b62273f" }) {
  //       id
  //       product {
  //         id
  //         name
  //         price
  //         quantity
  //         isForSale
  //         usdtBalance
  //         ipfsLink
  //         description
  //         seller {
  //           id
  //           isSeller
  //         }
  //       }
  //       buyer {
  //         id
  //         isSeller
  //       }
  //       quantity
  //       totalPrice
  //       isConfirmed
  //       purchaseTime
  //       isDisputed
  //       referrer {
  //         id
  //         isSeller
  //         isJudge
  //         referralRewards
  //       }
  //     }
  //   }`;

  //   const subgraph_data = await graphClient
  //     .query({
  //       query: gql(transactionQuery),
  //     })
  //     .then((data) => data)
  //     .catch((err) => {
  //       console.log('Error fetching data: ', err);
  //       return null;
  //     });

  //   console.log('subgraph_data', subgraph_data?.data.purchases);

  //   const data = subgraph_data?.data.purchases || [];
  //   const formattedTransactions = data.map((item: any) => {
  //     const product = item.product;
  //     const buyer = item.buyer;

  //     const when = new Date(item.purchaseTime * 1000).toLocaleString();

  //     return {
  //       tx: item.id,
  //       amount: (item.totalPrice / Math.pow(10, 18)).toFixed(2),
  //       when: when,
  //       id: item.id.toString(),
  //       address: product.seller.id,
  //       status: item.isConfirmed ? 'success' : 'waiting',
  //       name: product.name,
  //       blockExplorerUrl:
  //         chainConfig[chainId as keyof typeof chainConfig].blockExplorerUrl,
  //       handleReportClick: () => console.log('Report clicked for tx', item.id),
  //     };
  //   });

  //   setTransactions(formattedTransactions);
  // };

  useEffect(() => {
    const mockJudgeHistory = [
      {
        image:
          'https://cdn.pixabay.com/photo/2020/09/28/04/44/hippopotamus-5608509_1280.jpg',
        subject: 'Who is the best judge?',
        description: 'I think the judge is the best',
        productName: 'Product 1',
        price: '100',
        date: '2024-01-01',
        progress: 50,
        status: 'success',
      },
      {
        image:
          'https://cdn.pixabay.com/photo/2020/09/28/04/44/hippopotamus-5608509_1280.jpg',
        subject: 'Who is the best judge?',
        description: 'I think the judge is the best',
        productName: 'Product 1',
        price: '100',
        date: '2024-01-01',
        progress: 50,
        status: 'pending',
      },
    ];
    const query = async () => {
      setIsLoading(true);
      const query = await queryProduct();
      setProducts(query);
      console.log('queryProduct', query);
      setIsLoading(false);
    };
    query();
    // queryTransaction();
    listOrdersBuyer(walletAddress);
    setJudgeHistory(mockJudgeHistory);
  }, []);

  const handleRemoveClick = async (id: string) => {
    // Retrieve extension data from local storage
    const extensionData = await (window as any).chrome.storage.local.get(
      'extensionData'
    );
    const extensionDataItems = extensionData.extensionData.item;

    // Log the current items for debugging
    console.log('Items before removal:', extensionDataItems);

    // Filter out the item with the matching id
    const filteredItems = extensionDataItems.filter(
      (item: any) => item.id.toString() !== id
    );
    // Log the filtered items for debugging
    console.log('Filtered items:', filteredItems);

    // Update local storage with the filtered items
    await (window as any).chrome.storage.local.set({
      extensionData: { item: filteredItems },
    });

    // Update the products state
    setProducts(products.filter((product: any) => product.id !== id)); // Ensure id types match
  };

  const handleReportClick = () => {
    setPage('report');
  };

  const getExtensionData = async () => {
    const data = await (window as any).chrome.storage.local.get(
      'extensionData'
    );
    console.log('Extension data:', data);
  };

  const handleCheckout = async () => {
    try {
      const provider = new ethers.BrowserProvider(web3auth.provider);

      const signer = await provider.getSigner();

      const contractABI = [
        {
          inputs: [
            { internalType: 'uint256', name: '_id', type: 'uint256' },
            { internalType: 'uint256', name: '_quantity', type: 'uint256' },
            { internalType: 'address', name: '_referrer', type: 'address' },
          ],
          name: 'buyProduct',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ];

      const contractAddress = ethayContractAddress;

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const productId = 1;
      const quantity = 2;
      const referrerAddress = '0xe219f46e0aa82c274ab9baf4de43ee5a0b9bb156';

      const tx = await contract.buyProduct(
        productId,
        quantity,
        referrerAddress
      );

      const receipt = await tx.wait();
      console.log('Transaction successful:', receipt);
    } catch (error) {
      console.error('Error calling the contract:', error);
    }
  };

  const handleAmountChange = async (value: string, id: string) => {
    const extensionData = await (window as any).chrome.storage.local.get(
      'extensionData'
    );
    const extensionDataItems = extensionData.extensionData.item;

    if (value === '0') {
      handleRemoveClick(id);
    } else {
      const updatedItems = extensionDataItems.map((item: any) =>
        item.id.toString() === id ? { ...item, amount: value } : item
      );
      await (window as any).chrome.storage.local.set({
        extensionData: { item: updatedItems },
      });

      const updatedProducts = products.map((product: any) =>
        product.id.toString() === id ? { ...product, amount: value } : product
      );
      setProducts(updatedProducts);
    }
  };

  return (
    <div className='home-container'>
      <Navbar
        setPage={setPage}
        action='home'
        blockExplorerUrl={
          chainConfig[chainId as keyof typeof chainConfig].blockExplorerUrl
        }
        chainId={chainId}
      />
      <div className='home-mode-buttons'>
        <button
          className={
            mode === 'cart' ? 'home-mode-button-selected' : 'home-mode-button'
          }
          onClick={() => setMode('cart')}
        >
          Cart
        </button>
        <button
          className={
            mode === 'order' ? 'home-mode-button-selected' : 'home-mode-button'
          }
          onClick={() => setMode('order')}
        >
          Order
        </button>
        <button
          className={
            mode === 'history'
              ? 'home-mode-button-selected'
              : 'home-mode-button'
          }
          onClick={() => setMode('history')}
        >
          Report History
        </button>
      </div>
      {isLoading ? (
        <img src={loading} alt='loading' />
      ) : mode === 'cart' ? (
        <div className='transaction-list'>
          {products?.length > 0 ? (
            products.map((product: any) => (
              <TransactionCartCard
                key={product.id}
                {...product}
                amount={product.amount}
                handleRemoveClick={() => handleRemoveClick(product.id)}
                onAmountChange={handleAmountChange}
              />
            ))
          ) : (
            <h1 style={{ color: 'var(--primary-color)' }}>No products</h1>
          )}
          <button style={{ width: '100%' }} onClick={handleCheckout}>
            Checkout
          </button>
          <button style={{ width: '100%' }} onClick={getExtensionData}>
            log
          </button>
        </div>
      ) : mode === 'order' ? (
        <div className='transaction-list'>
          {transactions?.length > 0 ? (
            transactions.map((transaction: any) => (
              <TransactionCard
                key={transaction.id}
                {...transaction}
                image={transaction.image}
                blockExplorerUrl={
                  chainConfig[chainId as keyof typeof chainConfig]
                    .blockExplorerUrl
                }
                handleReportClick={handleReportClick}
              />
            ))
          ) : (
            <h1 style={{ color: 'var(--primary-color)' }}>No transactions</h1>
          )}
        </div>
      ) : (
        <div className='transaction-list'>
          {judgeHistory.length > 0 ? (
            judgeHistory.map((history: any) => (
              <JudgeHistoryCard key={history.id} {...history} />
            ))
          ) : (
            <h1 style={{ color: 'var(--primary-color)' }}>No History</h1>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
