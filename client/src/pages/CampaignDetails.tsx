import { useParams, useNavigate } from "react-router-dom";
import { useWeb3 } from "../context/Web3Context";
import { useState, useEffect } from "react";
import { parseEther, formatEther } from "ethers";

interface Campaign {
  title: string;
  description: string;
  target: string;
  amountCollected: string;
  image: string;
  owner: string;
}

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contract } = useWeb3()!;
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!contract || id === undefined) return;
      const campaigns = await contract.getCampaigns();
      const idx = Number(id);
      if (!isNaN(idx) && campaigns[idx]) {
        setCampaign(campaigns[idx]);
      } else {
        setCampaign(null);
      }
    };
    fetchCampaign();
  }, [contract, id]);

  const handleDonate = async () => {
    setError("");
    if (!contract || id === undefined) return;
    setLoading(true);
    try {
      await contract.donateToCampaign(Number(id), { value: parseEther(amount) });
      setLoading(false);
      setAmount("");
      // Refresh campaign data after donation
      if (contract && id !== undefined) {
        const campaigns = await contract.getCampaigns();
        const idx = Number(id);
        if (!isNaN(idx) && campaigns[idx]) {
          setCampaign(campaigns[idx]);
        }
      }
    } catch (err) {
      setLoading(false);
      setError("Donation failed. Please try again.");
    }
  };

  if (campaign === null) return <div className="text-center mt-10 text-gray-400">Campaign not found.</div>;

  const target = Number(formatEther(campaign.target));
  const collected = Number(formatEther(campaign.amountCollected));
  const progress = target > 0 ? Math.min((collected / target) * 100, 100) : 0;

  return (
    <main className="max-w-xl mx-auto bg-[#232336] p-8 rounded-lg shadow-lg mt-8" aria-label="Campaign details">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-500 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Go back">&larr; Back</button>
      <img src={campaign.image} alt={`Campaign: ${campaign.title}`} className="w-full h-60 object-cover rounded mb-4" />
      <h2 className="text-3xl font-bold mb-2 text-white" tabIndex={0}>{campaign.title}</h2>
      <p className="mb-2 text-gray-300">{campaign.description}</p>
      <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2" aria-label="Progress bar">
        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${progress}%` }} aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}></div>
      </div>
      <p className="text-sm text-white">Target: <span className="font-semibold">{formatEther(campaign.target)} ETH</span></p>
      <p className="text-sm mb-2 text-white">Collected: <span className="font-semibold">{formatEther(campaign.amountCollected)} ETH</span></p>
      <form className="flex items-center gap-2 mt-4" onSubmit={e => { e.preventDefault(); handleDonate(); }} aria-label="Donate form">
        <label htmlFor="donate-amount" className="sr-only">Amount in ETH</label>
        <input
          id="donate-amount"
          type="number"
          placeholder="Amount in ETH"
          value={amount}
          min="0"
          step="any"
          onChange={e => setAmount(e.target.value)}
          className="p-2 rounded bg-[#13131a] text-white flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-required="true"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" disabled={loading} aria-busy={loading} aria-label="Donate">
          {loading ? "Donating..." : "Donate"}
        </button>
      </form>
      {error && <div className="text-red-500 mt-2" role="alert">{error}</div>}
    </main>
  );
};

export default CampaignDetails;