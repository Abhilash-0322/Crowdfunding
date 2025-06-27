import { useWeb3 } from "../context/Web3Context";
import { useEffect, useState } from "react";
import { formatEther } from "ethers";
import { Link } from "react-router-dom";

interface Campaign {
  title: string;
  description: string;
  target: string;
  amountCollected: string;
  image: string;
  owner: string;
  donators: string[];
  donations: string[];
}

const Payment = () => {
  const { contract, address } = useWeb3()!;
  const [donatedCampaigns, setDonatedCampaigns] = useState<{ campaign: Campaign; amount: string; index: number }[]>([]);

  useEffect(() => {
    const fetchDonations = async () => {
      if (!contract || !address) return;
      const all = await contract.getCampaigns();
      const result: { campaign: Campaign; amount: string; index: number }[] = [];
      for (let i = 0; i < all.length; i++) {
        const c = all[i];
        if (c.donators && c.donations) {
          c.donators.forEach((donator: string, idx: number) => {
            if (donator.toLowerCase() === address.toLowerCase()) {
              result.push({ campaign: c, amount: c.donations[idx], index: i });
            }
          });
        }
      }
      setDonatedCampaigns(result);
    };
    fetchDonations();
  }, [contract, address]);

  return (
    <main className="max-w-2xl mx-auto mt-8 text-center text-white">
      <h2 className="text-3xl font-bold mb-4">Payment History</h2>
      {donatedCampaigns.length === 0 ? (
        <p>You have not donated to any campaigns yet.</p>
      ) : (
        <ul className="space-y-4">
          {donatedCampaigns.map(({ campaign, amount, index }, i) => (
            <li key={i} className="bg-[#232336] p-4 rounded-lg flex flex-col items-center">
              <Link to={`/campaign/${index}`} className="text-blue-400 hover:underline text-lg font-semibold mb-1">{campaign.title}</Link>
              <span>Donated: <span className="font-bold">{formatEther(amount)} ETH</span></span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default Payment; 