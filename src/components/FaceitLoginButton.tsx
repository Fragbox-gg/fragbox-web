// In your component (assume this is a client component; add 'use client' at top if needed)
import { useCallback } from 'react';

const FaceitLoginButton = () => {
  const handleLogin = useCallback(() => {
    const popup = window.open('/api/faceit', '_blank', 'width=500,height=600');
    const interval = setInterval(() => {
      if (popup?.closed) {
        clearInterval(interval);
        window.location.reload(); // Or fetch user/session data
      }
    }, 1000);
  }, []);

  return (
    <button
      onClick={handleLogin}
      className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-lime-600 to-lime-500 hover:from-lime-500 hover:to-lime-400 text-white font-medium rounded-lg shadow-lg shadow-lime-500/20 transition-all duration-200 border border-lime-400/30 focus:outline-none focus:ring-2 focus:ring-lime-500/50"
    >
      <span>Login with FACEIT</span>
    </button>
  );
};

export default FaceitLoginButton;