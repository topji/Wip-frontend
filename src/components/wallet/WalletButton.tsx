import { useUser } from "@/context/UserContext";
import { useAccountModal } from "@rainbow-me/rainbowkit";
import { useAccountEffect } from "wagmi";
import { useNavigate } from "react-router";
import { useMagic } from "@/hooks/useMagic";

const WalletButton = () => {
  const { user, clearUser } = useUser();
  const { openAccountModal } = useAccountModal();
  const { magic } = useMagic();
  const navigate = useNavigate();
  useAccountEffect({
    onDisconnect: () => {
      clearUser();
      navigate("/auth");
    },
  });

  const handleOpenAccountModal = async () => {
    if (user?.walletType === "rainbow-kit") {
      openAccountModal?.();
    } else if (user?.walletType === "magic-link") {
      await magic?.wallet.showUI().on("disconnect", () => {
        clearUser();
        navigate("/auth");
      });
    }
  };
  if (!user?.publicAddress) return null;

  return (
    <div className="relative">
      <button
        onClick={handleOpenAccountModal}
        className="flex items-center gap-3 bg-white rounded-2xl px-3 py-1 border-2 border-[#E2E2E2] hover:border-gray-300 transition-all"
      >
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm">
            {user.username.charAt(0).toUpperCase()}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-black transition-transform`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </div>
  );
};

export default WalletButton;
