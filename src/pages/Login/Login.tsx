import { useEffect, useState } from "react";
import "./Login.css";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { CHAIN_NAMESPACES, IProvider, WALLET_ADAPTERS, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { AuthAdapter } from "@web3auth/auth-adapter";
import Web3 from "web3";
import { chainConfig } from "../../constant/constant";

const clientId = "BLoNHbYDBd4-qGvlrf1gqVGkRwZU8dWDwNWuQX_RgXpiO-sihubEpBKwaX8CVey9irWG-923zJJG2qARGWefl5U";

const Login = ({ setPage, web3auth, setWeb3auth, chainId, setChainId }: { setPage: (page: string) => void, web3auth: any, setWeb3auth: (web3auth: any) => void, chainId: string, setChainId: (chainId: string) => void }) => {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(false);
  const [isFullPage, setIsFullPage] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  
  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.AUTH, {
      loginProvider: "google",
    });
    setProvider(web3authProvider);
  };

  useEffect(() => {
    localStorage.setItem("walletAddress", address || "");
    if (address) {
      setPage("home");
    }
  }, [address]);

  useEffect(() => {
    const init = async () => {
      try {
        const web3ChainConfig = {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: chainConfig[chainId as keyof typeof chainConfig].chainId ,
          rpcTarget: chainConfig[chainId as keyof typeof chainConfig].rpcTarget,
          displayName: chainConfig[chainId as keyof typeof chainConfig].chainName,
          blockExplorerUrl: chainConfig[chainId as keyof typeof chainConfig].blockExplorerUrl,
          ticker: chainConfig[chainId as keyof typeof chainConfig].nativeCurrency.symbol,
          tickerName: chainConfig[chainId as keyof typeof chainConfig].nativeCurrency.name,
          logo: chainConfig[chainId as keyof typeof chainConfig].logo,
        };

        const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig: web3ChainConfig } });

        const web3auth = new Web3AuthNoModal({
          clientId,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
          privateKeyProvider,
        });

        const authAdapter = new AuthAdapter({});
        web3auth.configureAdapter(authAdapter);

        await web3auth.init();

        if (web3auth.provider) {
          setProvider(web3auth.provider);
        }

        setWeb3auth(web3auth);

        if (web3auth.connected) {
          setLoggedIn(true);
          if (web3auth.provider) {
            const web3 = new Web3(web3auth.provider);
            const addresses = await web3.eth.getAccounts();
            console.log(addresses);
            setAddress(addresses[0]);
            localStorage.setItem("walletAddress", addresses[0]);
            setPage("home");
          }
        }

      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
      }
    };

    init();
    if (window.innerWidth > 400) setIsFullPage(true);
  }, []);

  const handleChainChange = (e: any) => {
    setChainId(e.target.value);
  }

  return (
    <div className="container">
      <div>
        <select name="chain" id="chain" onChange={handleChainChange}>
          <option value="84532">Base</option>
          <option value="11155111">Sepolia</option>
        </select>
      </div>
      <div>
        {!isFullPage ? (
          <button onClick={() => (window as any).chrome.tabs.create({ url: "index.html" })} className="card login">
            Login
          </button>
        ) : (
          <button onClick={login} className="card login">
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Login;
