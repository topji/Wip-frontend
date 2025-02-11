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

        <button
          type="button"
          className="w-full p-3 border rounded-md flex justify-center"
        >
          <div className="w-6 h-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="29"
              viewBox="0 0 28 29"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M27.0565 14.7654C27.0565 13.8033 26.9701 12.8781 26.8098 11.99H14.0303V17.2387H21.3329C21.0183 18.9348 20.0623 20.3719 18.6253 21.334V24.7386H23.0105C25.5762 22.3764 27.0565 18.8978 27.0565 14.7654Z"
                fill="#4285F4"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.0303 28.026C17.6939 28.026 20.7655 26.8109 23.0105 24.7386L18.6253 21.334C17.4102 22.1482 15.856 22.6292 14.0303 22.6292C10.4963 22.6292 7.50492 20.2424 6.43791 17.0352H1.90466V20.5507C4.13737 24.9853 8.72613 28.026 14.0303 28.026Z"
                fill="#34A853"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.43791 17.035C6.16654 16.2209 6.01234 15.3513 6.01234 14.457C6.01234 13.5626 6.16654 12.693 6.43791 11.8789V8.36328H1.90466C0.985679 10.1951 0.461426 12.2674 0.461426 14.457C0.461426 16.6465 0.985679 18.7188 1.90466 20.5506L6.43791 17.035Z"
                fill="#FBBC05"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.0303 6.28491C16.0225 6.28491 17.8111 6.96952 19.2174 8.31408L23.1092 4.42227C20.7593 2.23274 17.6878 0.888184 14.0303 0.888184C8.72613 0.888184 4.13737 3.92885 1.90466 8.36342L6.43791 11.879C7.50492 8.6718 10.4963 6.28491 14.0303 6.28491Z"
                fill="#EA4335"
              />
            </svg>
          </div>
        </button>
        <WalletAuthButton tab={tab} setTab={setTab} setError={setError} />
      </div>
    </div>
  );
};
