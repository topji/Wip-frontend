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
      <main className="flex gap-8 grow">
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
      </main>
    );
  }

  return (
    <main className="flex gap-8 grow">
      <div className="flex flex-col gap-8 items-center justify-between grow">
        <div className="self-start px-16 pb-8 pt-12">
          <img src={logo} alt="logo" />
        </div>
        <h1 className="text-6xl font-medium w-[18ch] mb-12 text-center">
          Your <span className="text-orange-400">#Copyright </span>is
          <span className="text-blue-500"> Underway...</span>
        </h1>
      </div>
    </main>
  );
};

export default ConfirmRegister;
