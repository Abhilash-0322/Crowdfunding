import { useWeb3 } from "../context/Web3Context";
import { useEffect, useState } from "react";
import { formatEther } from "ethers";

interface Campaign {
  title: string;
  description: string;
  target: string;
  amountCollected: string;
  image: string;
  owner: string;
}

const Withdraw = () => {
  const { contract, address } = useWeb3()!;
  const [myCampaigns, setMyCampaigns] = useState<{ campaign: Campaign; index: number }[]>([]);
  const [loading, setLoading] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchMyCampaigns = async () => {
      if (!contract || !address) return;
      const all = await contract.getCampaigns();
      const mine: { campaign: Campaign; index: number }[] = [];
      for (let i = 0; i < all.length; i++) {
        if (all[i].owner.toLowerCase() === address.toLowerCase()) {
          mine.push({ campaign: all[i], index: i });
        }
      }
      setMyCampaigns(mine);
    };
    fetchMyCampaigns();
  }, [contract, address]);

  const handleWithdraw = async (index: number) => {
    setError("");
    setSuccess("");
    setLoading(index);
    try {
      if (!contract) throw new Error("No contract");
      await contract.withdrawFunds(index);
      setSuccess("Withdrawal successful!");
      setLoading(null);
      // Refresh campaigns
      if (!contract || !address) return;
      const all = await contract.getCampaigns();
      setMyCampaigns(all.filter((c: Campaign, i: number) => c.owner.toLowerCase() === address.toLowerCase()).map((c: Campaign, i: number) => ({ campaign: c, index: i })));
    } catch (err) {
      setLoading(null);
      setError("Withdrawal failed. You may not be the owner or there are no funds.");
    }
  };

  return (
    <main className="max-w-2xl mx-auto mt-8 text-center text-white">
      <h2 className="text-3xl font-bold mb-4">Withdraw Funds</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-500 mb-2">{success}</div>}
      {myCampaigns.length === 0 ? (
        <p>You have not created any campaigns or there are no funds to withdraw.</p>
      ) : (
        <ul className="space-y-4">
          {myCampaigns.map(({ campaign, index }, i) => (
            <li key={i} className="bg-[#232336] p-4 rounded-lg flex flex-col items-center">
              <span className="text-lg font-semibold mb-1">{campaign.title}</span>
              <span>Collected: <span className="font-bold">{formatEther(campaign.amountCollected)} ETH</span></span>
              <button
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                disabled={loading === index || Number(formatEther(campaign.amountCollected)) === 0}
                onClick={() => handleWithdraw(index)}
                aria-busy={loading === index}
              >
                {loading === index ? "Withdrawing..." : "Withdraw"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default Withdraw; 