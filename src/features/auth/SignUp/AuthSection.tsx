import { cn } from "@/utils/cn";
import { useState } from "react";
import AuthWithEmail from "./AuthWithEmail";
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
  const [tab, setTab] = useState<"signup" | "signin">("signup");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await magic?.auth.loginWithEmailOTP({
        email: email,
      });
      const userInfo = await magic?.user.getInfo();
      const userExistsResponse = await userExists(
        userInfo?.publicAddress ?? ""
      );
      if (userExistsResponse.success) {
        if (userInfo?.publicAddress) {
          const userPayload = {
            email: userInfo.email ?? "",
            publicAddress: userInfo.publicAddress,
            username: generateUserName(userInfo.publicAddress),
            walletType: "magic-link" as const,
          };
          setUser(userPayload);
          navigate("/dashboard");
        } else {
          setError("User does not exist");
          setTab("signup");
        }
      }
    } catch (error) {
      setError(error instanceof AxiosError ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-102 mx-auto p-6">
      <div className="flex mb-8">
        <button
          onClick={() => setTab("signup")}
          className={cn(
            "flex-1 bg-[#ECF0FF] text-gray-600 py-2 rounded-md",
            tab === "signup" && "bg-blue-600 text-white font-medium"
          )}
        >
          Sign Up
        </button>

        <button
          onClick={() => setTab("signin")}
          className={cn(
            "flex-1 py-2 bg-[#ECF0FF]  text-gray-600 rounded-md",
            tab === "signin" && "bg-blue-600 text-white font-medium"
          )}
        >
          Sign In
        </button>
      </div>
      {error && (
        <span className="text-red-500 text-sm p-4 inline-block rounded-md bg-red-100 w-full mb-6">
          {error}
        </span>
      )}
      <div className="space-y-6">
        {tab === "signin" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Id
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter Email Id"
                value={email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-blue-600 text-white py-3 rounded-md font-medium"
            >
              {loading ? (
                <span className="animate-spin text-white">
                  <img src={loader} alt="loading..." />
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        )}
        {tab === "signup" && <AuthWithEmail setError={setError} />}

        <div className="relative text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <span className="relative bg-white px-4 text-sm text-gray-500">
            OR
          </span>
        </div>

        <AuthWithGoogle tab={tab} setTab={setTab} setError={setError} />
        <WalletAuthButton tab={tab} setTab={setTab} setError={setError} />
      </div>
    </div>
  );
};
