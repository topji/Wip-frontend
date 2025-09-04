import WalletButton from "@/components/wallet/WalletButton";
import logo from "/World_IP_logo.svg";
import success from "@/assets/success.gif";
import { useNavigate } from "react-router";

const RegisterSuccess = () => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <img src={logo} alt="logo" className="h-8" />
            <WalletButton />
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex gap-8 grow">
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
              <span className="text-blue-500">Congratulations! </span>
              <p>
                You own
                <span className="text-orange-400"> #Copyright </span>
              </p>
            </h1>
            <p className="text-4xl font-medium text-[#6B6B6B]">
              Your work is protected in more than 180 countries
            </p>
            <button 
              onClick={handleGoToDashboard}
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
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden p-4">
        <div className="max-w-md mx-auto">
          {/* Mobile Success Content */}
          <div className="text-center">
            {/* Success Animation */}
            <div className="flex justify-center mb-6">
              <img src={success} alt="success" className="w-32 h-32" />
            </div>
            
            {/* Success Message */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                <span className="text-blue-500">Congratulations!</span>
              </h1>
              <p className="text-lg font-medium text-gray-700 mb-2">
                You own <span className="text-orange-400">#Copyright</span>
              </p>
              <p className="text-sm text-gray-600">
                Your work is protected in more than 180 countries
              </p>
            </div>

            {/* Action Button */}
            <button 
              onClick={handleGoToDashboard}
              className="w-full bg-[#FF9519] hover:bg-[#E6850F] text-white px-6 py-4 rounded-xl flex items-center justify-center gap-3 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Go To Dashboard
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none" className="text-white">
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

          {/* Mobile Info Section */}
          <div className="mt-6 text-center">
            <div className="bg-[#5865F2] rounded-2xl p-4 text-white">
              <h3 className="font-semibold mb-2">What's Next?</h3>
              <p className="text-sm opacity-90">
                Your copyright is now registered on the blockchain. 
                You can view, update, and manage your certificates from the dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RegisterSuccess;
