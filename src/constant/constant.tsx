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
};
