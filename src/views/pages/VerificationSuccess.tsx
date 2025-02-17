import WalletButton from "@/components/wallet/WalletButton";
import logo from "/World_IP_logo.svg";
import success from "@/assets/success.gif";
import { useNavigate } from "react-router";

const VerificationSuccess = () => {
  const navigate = useNavigate();

  return (
    <main className="flex gap-8 grow">
      <div className="flex flex-col gap-2 items-center justify-between grow">
        <div className="w-full flex items-center justify-between px-16 pb-8 pt-12">
          <img src={logo} alt="logo" />
          <WalletButton />
        </div>
        <div className="flex flex-col items-center justify-center">
          <div>
            <img src={success} alt="success" />
          </div>
          <div className="flex flex-col items-center justify-center gap-4 mb-12">
            <h1 className="text-6xl font-medium text-center">
              <span className="text-blue-500">Verified! </span>
              <p>
                Your
                <span className="text-orange-400"> #Copyright </span>
                is authentic
              </p>
            </h1>
            <p className="text-4xl font-medium text-[#6B6B6B]">
              The file matches the original registered copyright
            </p>
            <button 
              onClick={() => navigate("/dashboard")}
              className="bg-[#FF9519] cursor-pointer text-white px-6 py-3 rounded-full flex items-center gap-2 w-fit"
            >
              Go To Dashboard
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 12L12 4M5.5 4H12V10.5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VerificationSuccess;
