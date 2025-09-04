import logo from "/World_IP_logo.svg";
import { useUser } from "@/context/UserContext";
import { useShare } from "@/context/ShareContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { createCertificate } from "@/services/api/certificateServices";
import { useSessionStorage } from "@/hooks/useSessionStorage";

const ConfirmRegister = () => {
  const { user } = useUser();
  const { shares, setShares } = useShare();
  const navigate = useNavigate();
  const { storedValue: hash } = useSessionStorage("hash", "");
  const fileFormat = sessionStorage.getItem("fileFormat") || "txt";
  const description =
    sessionStorage.getItem("description") || "Copyright registration";
  const [error, setError] = useState<string | null>(null);
  const [existingCertificateId, setExistingCertificateId] = useState<number | null>(null);

  useEffect(() => {
    // Recover shares from sessionStorage if context is empty
    if (shares.length === 0) {
      const storedShares = sessionStorage.getItem("shares");
      if (storedShares) {
        setShares(JSON.parse(storedShares));
      } else if (!user) {
        navigate("/set-ownership");
        return;
      }
    }
  }, [shares, user, navigate, setShares]);

  useEffect(() => {
    const createCertificateCall = async () => {
      try {
        if (shares.length === 0) {
          console.error("No shares available");
          navigate("/set-ownership");
          return;
        }

        const payload = {
          fileHash: hash,
          metadataURI: "NA",
          description: description,
          fileFormat: fileFormat,
          owners: shares.map((share) => ({
            walletAddress: share.address,
            percentage: share.percentage,
          })),
        };
        const certificate = await createCertificate(payload);
        
        if (certificate.success) {
          // Clear stored shares after successful creation
          sessionStorage.removeItem("shares");
          navigate("/creation-success");
        } else {
          // Handle duplicate file error
          if (certificate.message === "File is already registered" && certificate.existingCertificateId) {
            setError("This file has already been registered as a certificate");
            setExistingCertificateId(certificate.existingCertificateId);
          } else {
            setError(certificate.message || "Failed to create certificate");
          }
        }
      } catch (error: any) {
        console.error(error);
        if (error.response?.data?.message === "File is already registered") {
          setError("This file has already been registered as a certificate");
          setExistingCertificateId(error.response.data.existingCertificateId);
        } else {
          setError("Failed to create certificate. Please try again.");
        }
      }
    };

    createCertificateCall();
  }, [shares, hash, fileFormat, description, navigate]);

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Mobile Header */}
        <div className="md:hidden bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <img src={logo} alt="logo" className="h-8" />
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex gap-8 grow">
          <div className="flex flex-col gap-8 items-center justify-between grow">
            <div className="self-start px-16 pb-8 pt-12">
              <img src={logo} alt="logo" />
            </div>
            <div className="flex flex-col items-center justify-center grow">
              <div className="text-center max-w-md mx-auto">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-red-500">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  File Already Registered
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {error}
                  {existingCertificateId && (
                    <span className="block mt-2 text-sm text-gray-500">
                      Certificate ID: #{existingCertificateId}
                    </span>
                  )}
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => navigate("/create-hash")}
                    className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-6 py-3 rounded-full font-semibold transition-colors duration-200"
                  >
                    Try Different File
                  </button>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-semibold transition-colors duration-200"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden p-4">
          <div className="max-w-md mx-auto">
            {/* Mobile Error Content */}
            <div className="text-center">
              {/* Error Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-red-500">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              
              {/* Error Message */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  File Already Registered
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {error}
                  {existingCertificateId && (
                    <span className="block mt-2 text-xs text-gray-500">
                      Certificate ID: #{existingCertificateId}
                    </span>
                  )}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/create-hash")}
                  className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white px-6 py-4 rounded-xl flex items-center justify-center gap-3 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Try Different File
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-4 rounded-xl flex items-center justify-center gap-3 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-700">
                    <path d="M3 12L5 10L12 3L19 10L21 12L19 14L12 21L5 14L3 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Go to Dashboard
                </button>
              </div>
            </div>

            {/* Mobile Info Section */}
            <div className="mt-6 text-center">
              <div className="bg-[#5865F2] rounded-2xl p-4 text-white">
                <h3 className="font-semibold mb-2">Why This Happened?</h3>
                <p className="text-sm opacity-90">
                  This file has already been registered as a copyright certificate. 
                  Each file can only be registered once to maintain uniqueness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <img src={logo} alt="logo" className="h-8" />
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex gap-8 grow">
      <div className="flex flex-col gap-8 items-center justify-between grow">
        <div className="self-start px-16 pb-8 pt-12">
          <img src={logo} alt="logo" />
        </div>
        <h1 className="text-6xl font-medium w-[18ch] mb-12 text-center">
          Your <span className="text-orange-400">#Copyright </span>is
          <span className="text-blue-500"> Underway...</span>
        </h1>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden p-4">
        <div className="max-w-md mx-auto">
          {/* Mobile Loading Content */}
          <div className="text-center">
            {/* Loading Animation */}
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-[#5865F2] to-[#FF9519] rounded-full flex items-center justify-center">
                <div className="animate-spin">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M12 3V6M12 18V21M6 12H3M21 12H18M5.63672 5.63672L7.75977 7.75977M16.2422 16.2422L18.3633 18.3633M18.3652 5.63477L16.2441 7.75586M7.75781 16.2422L5.63477 18.3652" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Loading Message */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                Your <span className="text-orange-400">#Copyright</span> is
                <span className="text-blue-500"> Underway...</span>
              </h1>
              <p className="text-sm text-gray-600">
                We're processing your registration on the blockchain
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Processing...</span>
                <span className="text-xs text-gray-500">Please wait</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-[#5865F2] to-[#FF9519] h-2 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Mobile Info Section */}
          <div className="mt-6 text-center">
            <div className="bg-[#5865F2] rounded-2xl p-4 text-white">
              <h3 className="font-semibold mb-2">What's Happening?</h3>
              <p className="text-sm opacity-90">
                Your file is being registered on the blockchain. 
                This process ensures your copyright is permanently recorded and protected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ConfirmRegister;
