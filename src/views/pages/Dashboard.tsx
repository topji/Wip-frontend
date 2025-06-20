import { format } from "date-fns";
import copyRightIllustration from "@/assets/illustrations/copyRightIllus.png";
import { Link } from "react-router";
import {
  useGetCertificateIds,
  CertificateOwner,
} from "@/hooks/api-interaction/useGetCertificateDetails";
import { useUser } from "@/context/UserContext";
import { useState } from "react";

const Dashboard = () => {
  const { user } = useUser();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: certificateIds, isLoading: loadingCertificateIds } =
    useGetCertificateIds(user?.publicAddress ?? "");

  // Console logs for debugging API responses
  console.log("Certificate IDs Response:", certificateIds);

  const currentCertificate = certificateIds?.data?.[currentIndex];

  const handlePrevious = () => {
    if (certificateIds?.data && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (certificateIds?.data && currentIndex < certificateIds.data.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const isLoading = loadingCertificateIds;

  return (
    <div className="p-8 bg-[#EDEDED] w-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          My #Copyrights
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </h1>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center grow">
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
                stroke="#000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      ) : (
        <div className="space-y-6 flex items-center gap-8">
          {currentCertificate && (
            <div
              key={currentCertificate._id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex gap-8">
                {/* Image Preview */}
                <div className="w-72 h-96 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={copyRightIllustration}
                    alt="Copyright preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 space-y-6">
                  <div className="font-bold">
                    <div className="text-[0.75rem] text-[#616161] mb-1">
                      Created on
                    </div>
                    <div className="text-[0.875rem] text-[#ADADAD]">
                      {format(
                        new Date(currentCertificate.timestamp * 1000),
                        "dd/MM/yyyy | HH:mm"
                      )}
                    </div>
                  </div>

                  <div className="font-bold">
                    <div className=" text-[#5865F2] mb-1">
                      Hash ID for this File
                    </div>
                    <div className="text-[1.25rem] text-black">
                      {currentCertificate.fileHash}
                    </div>
                  </div>

                  <div className="font-bold">
                    <div className="text-[#5865F2] mb-1">Description</div>
                    <p className="text-[1.25rem] text-black">
                      {currentCertificate.description}
                    </p>
                  </div>
                  <div className="flex gap-4 items-center justify-between">
                    <div>
                      <div className="text-[#5865F2] font-bold mb-1">
                        Ownership Rights
                      </div>
                      <div className="flex gap-4">
                        {currentCertificate.owners.map((owner: CertificateOwner, index: number) => (
                          <div
                            key={index}
                            className="flex items-center font-bold gap-2 p-2 border border-[#ECECED] rounded-full"
                          >
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">
                                {owner.walletAddress.charAt(2).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-[#B3B3B3]">
                              {owner.walletAddress.slice(0, 6)}...
                              {owner.walletAddress.slice(-4)}
                            </span>
                            <span className="text-[#4F4B5C]">
                              {owner.percentage}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Link
                        to="/update-certificate"
                        state={{ certificateId: currentCertificate.certificateId }}
                        className="bg-[#5865F2] cursor-pointer text-white px-6 py-3 rounded-full flex items-center gap-2 w-fit"
                      >
                        Update Certificate
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M4 12L12 4M5.5 4H12V10.5"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Link>
                      <Link
                        to="/verify-certificate"
                        state={{ 
                          certificateId: currentCertificate.certificateId,
                          originalHash: currentCertificate.fileHash 
                        }}
                        className="bg-[#FF9519] cursor-pointer text-white px-6 py-3 rounded-full flex items-center gap-2 w-fit"
                      >
                        Verify
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M4 12L12 4M5.5 4H12V10.5"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Navigation Buttons */}
          <div className="flex flex-col gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 19L5 12L12 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={handleNext}
              disabled={
                !certificateIds?.data || currentIndex === certificateIds.data.length - 1
              }
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5L19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
