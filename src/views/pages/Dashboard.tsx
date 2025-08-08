import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import copyRightIllustration from "@/assets/illustrations/copyRightIllus.png";
import {
  useGetCertificateIds,
  CertificateOwner,
} from "@/hooks/api-interaction/useGetCertificateIds";
import { useGetCertificateDetails } from "@/hooks/api-interaction/useGetCertificateDetails";
import { useUser } from "@/context/UserContext";


// Helper function to safely format dates
const formatDate = (timestamp: number | string | undefined): string => {
  if (!timestamp) return "Unknown date";
  
  try {
    // Convert to number if it's a string
    const numericTimestamp = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
    
    // Check if it's a valid number
    if (isNaN(numericTimestamp)) return "Invalid date";
    
    // Check if it's a reasonable timestamp (between 1970 and 2100)
    const date = new Date(numericTimestamp * 1000);
    if (date.getFullYear() < 1970 || date.getFullYear() > 2100) {
      return "Invalid date";
    }
    
    return format(date, "dd/MM/yyyy | HH:mm");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

// Helper function to get the last updated timestamp
const getLastUpdatedTimestamp = (certificate: any): number => {
  // Always return the original creation timestamp
  return certificate.timestamp;
};

const Dashboard = () => {
  const { user } = useUser();
  const { data: certificateIds, isLoading: loadingCertificateIds } =
    useGetCertificateIds(user?.publicAddress ?? "");

  console.log("Certificate IDs Response:", certificateIds);

  const isLoading = loadingCertificateIds;
  const certificates = certificateIds?.data || [];

  return (
    <div className="p-6 bg-[#EDEDED] w-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          My #Copyrights
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </h1>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center grow">
          <span className="animate-spin text-black">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3V6M12 18V21M6 12H3M21 12H18M5.63672 5.63672L7.75977 7.75977M16.2422 16.2422L18.3633 18.3633M18.3652 5.63477L16.2441 7.75586M7.75781 16.2422L5.63477 18.3652" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      ) : certificates.length === 0 ? (
        <div className="flex flex-col items-center justify-center grow py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-[#5865F2] to-[#FF9519] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Create your first Hash copyright
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Start your journey towards IP ownership and protect your intellectual property with blockchain technology.
            </p>
            <Link
              to="/create-hash"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#5865F2] to-[#FF9519] text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Create Your First Hash
            </Link>
          </div>
        </div>
      ) : (
        <SortedCertificatesList certificates={certificates} />
      )}
    </div>
  );
};

// Component to handle sorted certificates
const SortedCertificatesList = ({ certificates }: { certificates: any[] }) => {
  // Sort certificates by last updated timestamp first
  const sortedCertificates = useMemo(() => {
    return certificates.sort((a, b) => {
      const aLastUpdated = getLastUpdatedTimestamp(a);
      const bLastUpdated = getLastUpdatedTimestamp(b);
      return bLastUpdated - aLastUpdated; // Sort in descending order (newest first)
    });
  }, [certificates]);

  return (
    <div className="flex flex-col gap-6">
      {sortedCertificates.map((certificate) => (
        <CertificateCardWithDetails
          key={certificate._id}
          certificate={certificate}
        />
      ))}
    </div>
  );
};

// Separate component to handle individual certificate details
const CertificateCardWithDetails = ({ certificate }: { certificate: any }) => {
  const { data: certificateDetails } = useGetCertificateDetails(
    certificate.certificateId.toString()
  );

  return (
    <CertificateCard
      certificate={certificate}
      certificateDetails={certificateDetails}
    />
  );
};

// Version History Modal Component
const VersionHistoryModal = ({ 
  isOpen, 
  onClose, 
  certificate, 
  certificateDetails 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  certificate: any; 
  certificateDetails: any; 
}) => {
  if (!isOpen) return null;

  // Get all versions sorted by timestamp (oldest first)
  const allVersions = useMemo(() => {
    const versions: Array<{
      type: 'original' | 'update';
      fileHash: string;
      description: string;
      timestamp: number;
      fileFormat?: string;
      updateNumber?: number;
    }> = [];
    
    // Add original version
    versions.push({
      type: 'original',
      fileHash: certificate.fileHash,
      description: certificate.description,
      timestamp: certificate.timestamp,
      fileFormat: certificate.fileFormat
    });
    
    // Add all updates
    const updates = certificateDetails?.data?.updates || [];
    updates.forEach((update: any, index: number) => {
      versions.push({
        type: 'update',
        fileHash: update.fileHash,
        description: update.description,
        timestamp: update.timestamp,
        updateNumber: index + 1
      });
    });
    
    // Sort by timestamp (oldest first)
    return versions.sort((a, b) => a.timestamp - b.timestamp);
  }, [certificate, certificateDetails]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Version History</h2>
            <p className="text-sm text-gray-500">Certificate #{certificate.certificateId}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {allVersions.map((version, index) => (
              <div key={index} className={`border rounded-lg p-4 ${
                version.type === 'original' 
                  ? 'bg-green-50 border-green-200' 
                  : index === allVersions.length - 1 
                    ? 'bg-purple-50 border-purple-200' 
                    : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    version.type === 'original' 
                      ? 'bg-green-500' 
                      : index === allVersions.length - 1 
                        ? 'bg-purple-500' 
                        : 'bg-blue-500'
                  }`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                      {version.type === 'original' ? (
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      ) : index === allVersions.length - 1 ? (
                        <path d="M13 10V3L4 14H11V21L20 10H13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      ) : (
                        <path d="M4 12L12 4M5.5 4H12V10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      )}
                    </svg>
                  </div>
                  <div>
                    <h3 className={`font-semibold ${
                      version.type === 'original' 
                        ? 'text-green-800' 
                        : index === allVersions.length - 1 
                          ? 'text-purple-800' 
                          : 'text-blue-800'
                    }`}>
                      {version.type === 'original' 
                        ? 'Original Version' 
                        : index === allVersions.length - 1 
                          ? 'Latest Version' 
                          : `Update #${version.updateNumber}`
                      }
                    </h3>
                    <p className={`text-sm ${
                      version.type === 'original' 
                        ? 'text-green-600' 
                        : index === allVersions.length - 1 
                          ? 'text-purple-600' 
                          : 'text-blue-600'
                    }`}>
                      {formatDate(version.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className={`text-xs font-medium ${
                      version.type === 'original' 
                        ? 'text-green-700' 
                        : index === allVersions.length - 1 
                          ? 'text-purple-700' 
                          : 'text-blue-700'
                    }`}>Description:</span>
                    <p className={`text-sm ${
                      version.type === 'original' 
                        ? 'text-green-800' 
                        : index === allVersions.length - 1 
                          ? 'text-purple-800' 
                          : 'text-blue-800'
                    }`}>{version.description}</p>
                  </div>
                  <div>
                    <span className={`text-xs font-medium ${
                      version.type === 'original' 
                        ? 'text-green-700' 
                        : index === allVersions.length - 1 
                          ? 'text-purple-700' 
                          : 'text-blue-700'
                    }`}>File Hash:</span>
                    <p className={`text-sm font-mono break-all ${
                      version.type === 'original' 
                        ? 'text-green-800' 
                        : index === allVersions.length - 1 
                          ? 'text-purple-800' 
                          : 'text-blue-800'
                    }`}>{version.fileHash}</p>
                  </div>
                  {version.fileFormat && (
                    <div>
                      <span className={`text-xs font-medium ${
                        version.type === 'original' 
                          ? 'text-green-700' 
                          : index === allVersions.length - 1 
                            ? 'text-purple-700' 
                            : 'text-blue-700'
                      }`}>File Format:</span>
                      <p className={`text-sm ${
                        version.type === 'original' 
                          ? 'text-green-800' 
                          : index === allVersions.length - 1 
                            ? 'text-purple-800' 
                            : 'text-blue-800'
                      }`}>{version.fileFormat}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Separate component for each certificate card to handle individual certificate details
const CertificateCard = ({ 
  certificate, 
  certificateDetails 
}: { 
  certificate: any; 
  certificateDetails: any; 
}) => {
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  // Get the last updated timestamp
  const lastUpdatedTimestamp = useMemo(() => {
    return getLastUpdatedTimestamp(certificate);
  }, [certificate]);

  // Get the latest fileHash (most recent update or original if no updates)
  const latestFileHash = useMemo(() => {
    const updates = certificateDetails?.data?.updates || [];
    const latestUpdate = updates.length > 0 ? updates[updates.length - 1] : null;
    return latestUpdate ? latestUpdate.fileHash : certificate.fileHash;
  }, [certificateDetails, certificate]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <div className="flex">
          {/* Image Preview */}
          <div className="w-58 h-77 bg-gray-100 rounded-l-xl overflow-hidden flex-shrink-0">
            <img
              src={copyRightIllustration}
              alt="Copyright preview"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">
                  Updated on {formatDate(lastUpdatedTimestamp)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {certificate.description}
                </h3>
              </div>

              {/* Action Buttons - Right Side */}
              <div className="flex flex-col gap-2 ml-4">
                      <Link
                        to="/update-certificate"
                  state={{ certificateId: certificate.certificateId }}
                  className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors duration-200"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M4 12L12 4M5.5 4H12V10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                  Update
                      </Link>
                      <Link
                        to="/verify-certificate"
                        state={{ 
                    certificateId: certificate.certificateId,
                    originalHash: certificate.fileHash,
                        }}
                  className="bg-[#FF9519] hover:bg-[#E6850F] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors duration-200"
                      >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M4 12L12 4M5.5 4H12V10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                        Verify
                </Link>
                <button
                  onClick={() => setShowVersionHistory(true)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors duration-200"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M8 4V2M8 14V12M12 8H14M2 8H4M13.5 13.5L12 12M4 4L5.5 5.5M4 13.5L5.5 12M13.5 4L12 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                  See Version History
                </button>
              </div>
            </div>

            {/* Hash ID - Show latest fileHash */}
            <div className="mb-4">
              <div className="text-xs font-medium text-[#5865F2] mb-1">
                Hash ID
              </div>
              <div className="text-sm text-gray-700 font-mono bg-gray-50 px-3 py-2 rounded-md break-all">
                {latestFileHash}
              </div>
            </div>

            {/* Ownership Rights */}
            <div>
              <div className="text-xs font-medium text-[#5865F2] mb-2">
                Ownership Rights
              </div>
              <div className="flex gap-2 flex-wrap">
                {certificate.owners.map((owner: CertificateOwner, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full"
                  >
                    <div className="w-5 h-5 bg-[#5865F2] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {owner.walletAddress.charAt(2).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-gray-600 text-xs font-medium">
                      {owner.walletAddress.slice(0, 6)}...{owner.walletAddress.slice(-4)}
                    </span>
                    <span className="text-[#5865F2] text-xs font-bold">
                      {owner.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
    </div>

      {/* Version History Modal */}
      <VersionHistoryModal
        isOpen={showVersionHistory}
        onClose={() => setShowVersionHistory(false)}
        certificate={certificate}
        certificateDetails={certificateDetails}
      />
    </>
  );
};

export default Dashboard;

