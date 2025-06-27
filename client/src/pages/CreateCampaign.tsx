import { useState } from "react";
import { useWeb3 } from "../context/Web3Context";
import { parseEther } from "ethers";
import { useNavigate } from "react-router-dom";

const CreateCampaign = () => {
  const { contract, address } = useWeb3()!;
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    target: "",
    deadline: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!contract) return;
    if (!form.title || !form.description || !form.target || !form.deadline || !form.image) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      const tx = await contract.createCampaign(
        address,
        form.title,
        form.description,
        parseEther(form.target),
        Math.floor(new Date(form.deadline).getTime() / 1000),
        form.image
      );
      await tx.wait?.();
      setLoading(false);
      navigate("/");
    } catch (err) {
      setLoading(false);
      setError("Failed to create campaign. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-[#232336] p-8 rounded-lg shadow-lg mt-8 flex flex-col gap-4" aria-label="Create campaign form">
      <h2 className="text-3xl font-bold mb-4 text-white" tabIndex={0}>Create a New Campaign</h2>
      {error && <div className="text-red-500 mb-2" role="alert">{error}</div>}
      <label htmlFor="title" className="text-white">Title</label>
      <input id="title" name="title" placeholder="Title" onChange={handleChange} value={form.title} className="p-2 rounded bg-[#13131a] text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required aria-required="true" />
      <label htmlFor="description" className="text-white">Description</label>
      <textarea id="description" name="description" placeholder="Description" onChange={handleChange} value={form.description} className="p-2 rounded bg-[#13131a] text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required aria-required="true" />
      <label htmlFor="target" className="text-white">Target (ETH)</label>
      <input id="target" name="target" placeholder="Target (ETH)" onChange={handleChange} value={form.target} className="p-2 rounded bg-[#13131a] text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required type="number" min="0" step="any" aria-required="true" />
      <label htmlFor="deadline" className="text-white">Deadline</label>
      <input id="deadline" name="deadline" type="date" onChange={handleChange} value={form.deadline} className="p-2 rounded bg-[#13131a] text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required aria-required="true" />
      <label htmlFor="image" className="text-white">Image URL</label>
      <input id="image" name="image" placeholder="Image URL" onChange={handleChange} value={form.image} className="p-2 rounded bg-[#13131a] text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required aria-required="true" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" disabled={loading} aria-busy={loading} aria-label="Create Campaign">{loading ? "Creating..." : "Create Campaign"}</button>
    </form>
  );
};

export default CreateCampaign;