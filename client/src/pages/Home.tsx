import { useEffect, useState } from "react";
import { useWeb3 } from "../context/Web3Context";
import { formatEther } from "ethers";
import { Link } from "react-router-dom";

interface Campaign {
  title: string;
  description: string;
  target: string;
  amountCollected: string;
  image: string;
  owner: string;
}

const Home = () => {
  const { contract } = useWeb3()!;
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!contract) return;
      const data = await contract.getCampaigns();
      setCampaigns(data);
    };
    fetchCampaigns();
  }, [contract]);

  return (
    <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" aria-label="Campaigns list">
      {campaigns.length === 0 ? (
        <div className="col-span-full text-center text-gray-400 mt-10">No campaigns found. Create one!</div>
      ) : (
        campaigns.map((c, i) => {
          const target = Number(formatEther(c.target));
          const collected = Number(formatEther(c.amountCollected));
          const progress = target > 0 ? Math.min((collected / target) * 100, 100) : 0;
          return (
            <div key={i} className="bg-[#232336] rounded-lg p-4 shadow-lg flex flex-col items-center" role="region" aria-label={`Campaign card: ${c.title}`}> 
              <img src={c.image} alt={`Campaign: ${c.title}`} className="w-full h-40 object-cover rounded mb-4" />
              <h2 className="text-lg font-bold mb-2 text-white">{c.title}</h2>
              <p className="text-gray-300 mb-2 line-clamp-2">{c.description}</p>
              <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2" aria-label="Progress bar">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progress}%` }} aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}></div>
              </div>
              <p className="text-sm text-white">Target: <span className="font-semibold">{formatEther(c.target)} ETH</span></p>
              <p className="text-sm mb-2 text-white">Collected: <span className="font-semibold">{formatEther(c.amountCollected)} ETH</span></p>
              <Link to={`/campaign/${i}`} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" tabIndex={0} aria-label={`View details for ${c.title}`}>View Details</Link>
            </div>
          );
        })
      )}
    </main>
  );
};

export default Home;