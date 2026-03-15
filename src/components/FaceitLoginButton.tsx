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
      className="
        inline-flex items-center justify-center
        px-3 py-2 md:px-5 md:py-2.5
        bg-gradient-to-r from-orange-600 to-orange-500   /* FACEIT orange brand */
        hover:from-orange-500 hover:to-orange-400
        text-white
        font-medium
        rounded-xl
        shadow-lg shadow-orange-500/20                 /* Orange-tinted shadow */
        transition-all duration-200
        border border-orange-400/30
        focus:outline-none focus:ring-2 focus:ring-orange-500/50
        cursor-pointer                                 /* Hand cursor */
        hover:shadow-xl hover:-translate-y-0.5         /* Extra pop on hover */
        active:scale-95                                /* Press-down effect */
      "
    >
      <span className="hidden md:inline">Login with FACEIT</span>
      <img
        src="/images/faceit_logo.jpg" 
        alt="FACEIT Logo" 
        className="w-7 h-7 ml-0 md:ml-2"
      />
    </button>
  );
};

export default FaceitLoginButton;