import { useWeb3 } from "../context/Web3Context";
import { Link } from "react-router-dom";

const Navbar = () => {
  const web3 = useWeb3();
  const address = web3?.address;
  const connectWallet = web3?.connectWallet;

  return (
    <nav className="flex items-center justify-between bg-[#1c1c24] p-4 rounded-lg mb-6 shadow-md" aria-label="Main navigation">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Crowdfunding Home">
          Crowdfunding DApp
        </Link>
        <Link to="/" className="text-white hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 ml-4">Home</Link>
        <Link to="/create-campaign" className="text-white hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 ml-4">Create Campaign</Link>
        <Link to="/profile" className="text-white hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 ml-4">My Campaigns</Link>
      </div>
      <div>
        {address ? (
          <span className="inline-block bg-green-700 text-white px-3 py-1 rounded-lg text-sm font-mono" aria-label="Connected wallet address">
            Connected: {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            aria-label="Connect Wallet"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;