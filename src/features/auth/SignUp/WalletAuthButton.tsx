import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useAccountEffect, useDisconnect } from "wagmi";
import loader from "@/assets/loader.svg";
import { useCreateRainbowKitUser } from "@/hooks/api-interaction/useCreateUser";
import { generateUserName } from "@/utils/generateUserName";
import { useNavigate, useSearchParams } from "react-router";
import { userExists } from "@/services/api/userServices";
import { AxiosError } from "axios";
import { useUser } from "@/context/UserContext";

const WalletAuthButton = ({
  setError,
}: {
  setError: (error: string) => void;
}) => {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const account = useAccount();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { disconnect } = useDisconnect();
  const paramsCategory = searchParams.get("category");
  const { setUser } = useUser();

  const createUserMutation = useCreateRainbowKitUser({
    onSuccess: (_, variables) => {
      handleConnect(variables.userAddress);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  useAccountEffect({
    onConnect: async (data) => {
      try {
        setError("");
        
        // Check if user exists
        const userExistsResponse = await userExists(data.address);
        
        if (userExistsResponse.success) {
          // User exists - sign them in
          handleConnect(data.address);
        } else {
          // User doesn't exist - create account
          const payload = {
            username: generateUserName(data.address),
            email: "NA",
            company: "NA",
            tags: paramsCategory?.split(",") ?? [],
            userAddress: data.address,
          };
          createUserMutation.mutate(payload);
        }
      } catch (error) {
        setError(
          error instanceof AxiosError ? error.message : "Authentication failed"
        );
        disconnect();
      }
    },
  });

  const isLoading = account.isConnecting || createUserMutation.isPending;

  const handleConnect = (address: string) => {
    if (address) {
      const userPayload = {
        email: "", // You might want to collect this separately
        publicAddress: address,
        username: generateUserName(address),
        walletType: "rainbow-kit" as const,
      };

      // Store user info in context
      setUser(userPayload);
      navigate("/dashboard");
    }
  };

  return (
    <button
      type="button"
      disabled={isLoading}
      onClick={() => {
        if (account.isConnected) {
          openAccountModal?.();
        } else {
          openConnectModal?.();
        }
      }}
      className="w-full flex items-center justify-center bg-orange-500 text-white py-3 rounded-md font-medium hover:bg-orange-600 disabled:opacity-50"
    >
      {isLoading ? (
        <span className="animate-spin text-white">
          <img src={loader} alt="loading..." />
        </span>
      ) : (
        "Connect Wallet"
      )}
    </button>
  );
};

export default WalletAuthButton;
