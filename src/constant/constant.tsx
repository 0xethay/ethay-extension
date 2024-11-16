export const BE_URL = "http://localhost:8000";

export const chainConfig = {
    "84532": {
        chainName: "Base Sepolia",
        chainId: "0x14a34",
        nativeCurrency: {
            name: "Base",
            symbol: "ETH",
            decimals: 18,
        },
        blockExplorerUrl: "https://base-sepolia.blockscout.com/",
        rpcTarget: "https://base-sepolia-rpc.publicnode.com",
        logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png"
    },
    "11155111": {
        chainName: "Sepolia",
        chainId: "0xaa36a7",
        nativeCurrency: {
            name: "Ethereum",
            symbol: "ETH",
            decimals: 18,
        },
        rpcTarget: "https://ethereum-sepolia-rpc.publicnode.com",
        blockExplorerUrl: "https://sepolia.etherscan.io/",
        logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png"
    },
    "25925": {
        chainName: "Bitkub Testnet",
        chainId: "0x6545",
        nativeCurrency: {
            name: "Bitkub",
            symbol: "tKUB",
            decimals: 18,
        },
        rpcTarget: "https://rpc-testnet.bitkubchain.io",
        blockExplorerUrl: "https://testnet.bkcscan.com/",
        logo: "https://cryptologos.cc/logos/bitkub-kub-logo.png"
    },
    "296":{
        chainName: "Hedera Testnet",
        chainId: "0x128",
        nativeCurrency: {
            name: "Hedera",
            symbol: "HBAR",
            decimals: 18,
        },
        rpcTarget: "https://testnet.hashio.io/api",
        blockExplorerUrl: "https://testnet.hashio.io/",
        logo: "https://cryptologos.cc/logos/hedera-hashgraph-hbar-logo.png"
    },
    "80002":{
        chainName: "Polygon Amoy",
        chainId: "0x13882",
        nativeCurrency: {
            name: "Polygon",
            symbol: "POL",
            decimals: 18,
        },
        rpcTarget: "https://polygon-amoy-bor-rpc.publicnode.com",
        blockExplorerUrl: "https://amoy-explorer.polygon.technology/",
        logo: "https://cryptologos.cc/logos/polygon-matic-logo.png"
    },
    "534351":{
        chainName: "Scroll Sepolia",
        chainId: "0x8274f",
        nativeCurrency: {
            name: "Scroll",
            symbol: "ETH",
            decimals: 18,
        },
        rpcTarget: "https://sepolia-rpc.scroll.io",
        blockExplorerUrl: "https://scroll-sepolia.blockscout.com/",
        logo: "https://cryptologos.cc/logos/scroll-scroll-logo.png"
    },
    "5003":{
        chainName: "Mantle Sepolia",
        chainId: "0x138b",
        nativeCurrency: {
            name: "Mantle",
            symbol: "MNT",
            decimals: 18,
        },
        rpcTarget: "https://rpc.sepolia.mantle.xyz",
        blockExplorerUrl: "https://explorer.sepolia.mantle.xyz/",
        logo: "https://cryptologos.cc/logos/mantle-mnt-logo.png"
    },
    "48899":{
        chainName: "Zircuit Testnet",
        chainId: "0xbf03",
        nativeCurrency: {
            name: "Zircuit",
            symbol: "ETH",
            decimals: 18,
        },
        rpcTarget: "https://zircuit1-testnet.p2pify.com",
        blockExplorerUrl: "https://explorer.testnet.zircuit.com/",
        logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png"
    },
    "545":{
        chainName: "Flow Testnet",
        chainId: "0x221",
        nativeCurrency: {
            name: "Flow",
            symbol: "FLOW",
            decimals: 18,
        },
        rpcTarget: "https://testnet.evm.nodes.onflow.org",
        blockExplorerUrl: "https://evm-testnet.flowscan.io/",
        logo: "https://cryptologos.cc/logos/flow-flow-logo.png"
    }
};

export const ethayContractAddress = "0x2612D031139ecC9F2FB6833409669e1392C82eFe";