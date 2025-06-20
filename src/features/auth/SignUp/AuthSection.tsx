import { useState } from "react";
import WalletAuthButton from "./WalletAuthButton";
import { useNavigate } from "react-router";
import loader from "@/assets/loader.svg";
import { useMagic } from "@/hooks/useMagic";
import { AxiosError } from "axios";
import { userExists } from "@/services/api/userServices";
import { generateUserName } from "@/utils/generateUserName";
import { useUser } from "@/context/UserContext";
import AuthWithGoogle from "./AuthWithGoogle";

export const AuthSection = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { magic } = useMagic();
  const [loading, setLoading] = useState<boolean>(false);
  const { setUser } = useUser();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // Authenticate with Magic Link
      await magic?.auth.loginWithEmailOTP({
        email: email,
      });
      
      const userInfo = await magic?.user.getInfo();
      
      if (!userInfo?.publicAddress) {
        setError("Failed to get wallet address");
        return;
      }

      // Check if user exists
      await handleUserCheck(userInfo.publicAddress, userInfo.email || "");
      
    } catch (error) {
      setError(error instanceof AxiosError ? error.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUserCheck = async (walletAddress: string, email: string) => {
    try {
      const userExistsResponse = await userExists(walletAddress);
      
      if (userExistsResponse.success) {
        // User exists - sign them in
        const userPayload = {
          email: email,
          publicAddress: walletAddress,
          username: generateUserName(walletAddress),
          walletType: "magic-link" as const,
        };
        setUser(userPayload);
        navigate("/dashboard");
      } else {
        // User doesn't exist - redirect to registration
        const userPayload = {
          email: email,
          publicAddress: walletAddress,
          username: generateUserName(walletAddress),
          walletType: "magic-link" as const,
        };
        setUser(userPayload);
        navigate("/create-hash");
      }
    } catch (error) {
      setError("Failed to check user status");
    }
  };

  return (
    <div className="w-102 mx-auto p-6">
      <div className="text-center mb-8">
        <div className="inline-block px-8 py-6 rounded-xl shadow-sm bg-[#F4F6FB] border border-[#E3E6F5]">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#E3E6F5" />
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke="#5865F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h2 className="text-2xl font-bold tracking-tight">
              <span className="text-[#5865F2]">Login</span>
              <span className="text-gray-400 mx-2">or</span>
              <span className="text-[#FF9519]">Signup</span>
            </h2>
          </div>
          <p className="text-base text-[#6B7280] mt-1">
            Access your World IP dashboard securely
          </p>
        </div>
      </div>

      {error && (
        <span className="text-red-500 text-sm p-4 inline-block rounded-md bg-red-100 w-full mb-6">
          {error}
        </span>
      )}

      <div className="space-y-6">
        {/* Email Authentication */}
        <form onSubmit={handleEmailAuth} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              value={email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-spin text-white">
                <img src={loader} alt="loading..." />
              </span>
            ) : (
              "Continue with Email"
            )}
          </button>
        </form>

        <div className="relative text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <span className="relative bg-white px-4 text-sm text-gray-500">
            OR
          </span>
        </div>

        {/* Google Authentication */}
        <AuthWithGoogle setError={setError} />

        {/* Wallet Authentication */}
        <WalletAuthButton setError={setError} />
      </div>
    </div>
  );
};
