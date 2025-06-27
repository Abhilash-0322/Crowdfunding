import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { BrowserProvider, Contract, parseEther, formatEther, Signer } from "ethers";
import contractDataRaw from "../constants/CrowdFunding.json";

// Parse ABI from JSON string, handle possible errors
const contractData = {
  address: contractDataRaw.address,
  abi: typeof contractDataRaw.abi === "string" ? JSON.parse(contractDataRaw.abi) : contractDataRaw.abi
};

// Define a type for the context value
interface Web3ContextType {
  provider: BrowserProvider | null;
  signer: Signer | null;
  address: string;
  contract: Contract | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnecting: boolean;
  error: string | null;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [address, setAddress] = useState<string>("");
  const [contract, setContract] = useState<Contract | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to reset state
  const reset = () => {
    setSigner(null);
    setAddress("");
    setContract(null);
  };

  // Connect wallet function
  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    try {
      if (!provider) throw new Error("No provider found");
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      setSigner(signer);
      const userAddress = await signer.getAddress();
      setAddress(userAddress);
      setContract(new Contract(contractData.address, contractData.abi, signer));
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
      reset();
    } finally {
      setIsConnecting(false);
    }
  }, [provider]);

  // Disconnect wallet (just reset state)
  const disconnectWallet = () => {
    reset();
  };

  // Handle provider setup and auto-connect
  useEffect(() => {
    if ((window as any).ethereum) {
      const ethProvider = new BrowserProvider((window as any).ethereum);
      setProvider(ethProvider);
    } else {
      setError("MetaMask or compatible wallet not found");
    }
  }, []);

  // Auto-connect if already authorized
  useEffect(() => {
    const checkConnection = async () => {
      if (!provider) return;
      try {
        const accounts = await provider.send("eth_accounts", []);
        if (accounts && accounts.length > 0) {
          const signer = await provider.getSigner();
          setSigner(signer);
          setAddress(accounts[0]);
          setContract(new Contract(contractData.address, contractData.abi, signer));
        }
      } catch (err: any) {
        setError(err.message || "Failed to auto-connect");
      }
    };
    checkConnection();
  }, [provider]);

  // Listen for account/network changes
  useEffect(() => {
    if (!(window as any).ethereum) return;
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        reset();
      } else {
        setAddress(accounts[0]);
      }
    };
    const handleChainChanged = () => {
      window.location.reload();
    };
    (window as any).ethereum.on("accountsChanged", handleAccountsChanged);
    (window as any).ethereum.on("chainChanged", handleChainChanged);
    return () => {
      if ((window as any).ethereum.removeListener) {
        (window as any).ethereum.removeListener("accountsChanged", handleAccountsChanged);
        (window as any).ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  return (
    <Web3Context.Provider value={{ provider, signer, address, contract, connectWallet, disconnectWallet, isConnecting, error }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) throw new Error("useWeb3 must be used within a Web3Provider");
  return context;
};