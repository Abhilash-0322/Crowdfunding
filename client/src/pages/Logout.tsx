import { useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const { disconnectWallet } = useWeb3();
  const navigate = useNavigate();

  useEffect(() => {
    disconnectWallet();
    // Optionally redirect after logout
    const timer = setTimeout(() => navigate('/'), 1500);
    return () => clearTimeout(timer);
  }, [disconnectWallet, navigate]);

  return (
    <main className="max-w-2xl mx-auto mt-8 text-center text-white">
      <h2 className="text-3xl font-bold mb-4">Logout</h2>
      <p>You have been logged out. Redirecting to home...</p>
    </main>
  );
};

export default Logout; 