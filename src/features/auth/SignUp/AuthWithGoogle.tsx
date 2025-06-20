import { useUser } from "@/context/UserContext";
import { createUser } from "@/hooks/api-interaction/useCreateUser";
import { useMagic } from "@/hooks/useMagic";
import { userExists } from "@/services/api/userServices";
import { generateUserName } from "@/utils/generateUserName";
import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

const AuthWithGoogle = ({
  setError,
}: {
  setError: (error: string) => void;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { magic } = useMagic();
  const { setUser } = useUser();
  const [searchParams] = useSearchParams();
  const paramsCategory = searchParams.get("category");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      
      await magic?.oauth2.loginWithRedirect({
        provider: "google",
        redirectURI: import.meta.env.VITE_GOOGLE_REDIRECT_URL,
      });
      
      const res = await magic?.oauth2.getRedirectResult();
      const userInfo = res?.magic.userMetadata;
      
      if (!userInfo?.publicAddress) {
        setError("Failed to get wallet address");
        return;
      }

      // Check if user exists
      const userExistsResponse = await userExists(userInfo.publicAddress);
      
      if (userExistsResponse.success) {
        // User exists - sign them in
        const userPayload = {
          email: userInfo?.email ?? "",
          publicAddress: userInfo.publicAddress,
          username: generateUserName(userInfo.publicAddress),
          walletType: "magic-link" as const,
        };
        setUser(userPayload);
        navigate("/dashboard");
      } else {
        // User doesn't exist - create account and redirect to registration
        const createUserPayload = {
          username: generateUserName(userInfo.publicAddress),
          email: userInfo?.email ?? "NA",
          company: "NA",
          tags: paramsCategory?.split(",") ?? [],
          userAddress: userInfo.publicAddress,
        };
        
        const response = await createUser(createUserPayload);
        if (response.data.success) {
          const userPayload = {
            email: userInfo?.email ?? "",
            publicAddress: userInfo.publicAddress,
            username: generateUserName(userInfo.publicAddress),
            walletType: "magic-link" as const,
          };
          setUser(userPayload);
          navigate("/create-hash");
        }
      }
    } catch (error) {
      setError(error instanceof AxiosError ? error.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSubmit}
      disabled={loading}
      className="w-full p-3 border rounded-md flex justify-center items-center gap-3 hover:bg-gray-50"
    >
      {loading ? (
        <span className="animate-spin text-black">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 3V6M12 18V21M6 12H3M21 12H18M5.63672 5.63672L7.75977 7.75977M16.2422 16.2422L18.3633 18.3633M18.3652 5.63477L16.2441 7.75586M7.75781 16.2422L5.63477 18.3652"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ) : (
        <>
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
          <span className="font-medium">Continue with Google</span>
        </>
      )}
    </button>
  );
};

export default AuthWithGoogle;
