import { useWeb3 } from "../context/Web3Context";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatEther } from "ethers";

interface Campaign {
  title: string;
  description: string;
  target: string;
  amountCollected: string;
  image: string;
  owner: string;
}

const Profile = () => {
  const { contract, address } = useWeb3()!;
  const [myCampaigns, setMyCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    const fetchMyCampaigns = async () => {
      if (!contract || !address) return;
      const all = await contract.getCampaigns();
      setMyCampaigns(all.filter((c: Campaign) => c.owner.toLowerCase() === address.toLowerCase()));
    };
    fetchMyCampaigns();
  }, [contract, address]);

  return (
    <main className="max-w-4xl mx-auto mt-8" aria-label="My campaigns">
      <h2 className="text-3xl font-bold mb-6 text-white" tabIndex={0}>My Campaigns</h2>
      {myCampaigns.length === 0 ? (
        <div className="text-gray-400">You have not created any campaigns yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {myCampaigns.map((c, i) => {
            const target = Number(formatEther(c.target));
            const collected = Number(formatEther(c.amountCollected));
            const progress = target > 0 ? Math.min((collected / target) * 100, 100) : 0;
            return (
              <div key={i} className="bg-[#232336] rounded-lg p-4 shadow-lg flex flex-col items-center" role="region" aria-label={`My campaign card: ${c.title}`}> 
                <img src={c.image} alt={`My campaign: ${c.title}`} className="w-full h-40 object-cover rounded mb-4" />
                <h3 className="text-lg font-bold mb-2 text-white">{c.title}</h3>
                <p className="text-gray-300 mb-2 line-clamp-2">{c.description}</p>
                <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2" aria-label="Progress bar">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progress}%` }} aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}></div>
                </div>
                <Link to={`/campaign/${i}`} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" tabIndex={0} aria-label={`View details for ${c.title}`}>View Details</Link>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default Profile;