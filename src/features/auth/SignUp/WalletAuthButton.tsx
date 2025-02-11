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
  tab,
  setTab,
  setError,
}: {
  tab: "signup" | "signin";
  setTab: React.Dispatch<React.SetStateAction<"signup" | "signin">>;
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
    onSuccess: (_, varriables) => {
      handleConnect(varriables.userAddress);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  useAccountEffect({
    onConnect: async (data) => {
      if (tab === "signup") {
        const payload = {
          username: generateUserName(data.address),
          email: "NA",
          company: "NA",
          tags: paramsCategory?.split(",") ?? [],
          userAddress: data.address,
        };
        createUserMutation.mutate(payload);
      } else {
        try {
          const userExistsResponse = await userExists(data.address);
          if (userExistsResponse.success) {
            handleConnect(data.address);
          } else {
            setError("User does not exist");
            disconnect();
            setTab("signup");
          }
        } catch (error) {
          setError(
            error instanceof AxiosError ? error.message : "Unknown error"
          );
          disconnect();
        }
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
      className="w-full flex items-center justify-center bg-orange-500 text-white py-3 rounded-md font-medium"
    >
      {isLoading ? (
        <span className="animate-spin text-white">
          <img src={loader} alt="loading..." />
        </span>
      ) : tab === "signup" ? (
        "Sign up with Wallet"
      ) : (
        "Login with Wallet"
      )}
    </button>
  );
};

export default WalletAuthButton;
