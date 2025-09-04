import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { generateCertificateAvatar } from "@/utils/dicebear";
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

// Helper function to calculate stats
const calculateStats = (certificates: any[]) => {
  const totalCertificates = certificates.length;
  
  // Find the earliest certificate (active since)
  const earliestTimestamp = certificates.length > 0 
    ? Math.min(...certificates.map(cert => cert.timestamp))
    : null;
  
  // Get unique file formats
  const formats = [...new Set(certificates.map(cert => cert.fileFormat).filter(Boolean))];
  
  return {
    totalCertificates,
    activeSince: earliestTimestamp,
    formatsUsed: formats
  };
};

const Dashboard = () => {
  const { user } = useUser();
  const { data: certificateIds, isLoading: loadingCertificateIds } =
    useGetCertificateIds(user?.publicAddress ?? "");

  console.log("Certificate IDs Response:", certificateIds);

  const isLoading = loadingCertificateIds;
  const certificates = certificateIds?.data || [];
  const stats = calculateStats(certificates);

  return (
    <div className="p-4 md:p-6 bg-[#EDEDED] w-full flex flex-col">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h1 className="text-lg md:text-xl font-semibold flex items-center gap-2">
          My #Copyrights
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </h1>
        
        {/* Mobile Upload Button */}
        <Link
          to="/create-hash"
          className="md:hidden bg-[#FF9519] hover:bg-[#E6850F] text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors duration-200"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
            <path d="M8 12L8 4M8 4L5 7M8 4L11 7M2 2L14 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Upload
        </Link>
      </div>

      {/* Stats Section */}
      {!isLoading && certificates.length > 0 && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Certificates */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#5865F2] to-[#4752C4] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Certificates</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCertificates}</p>
              </div>
            </div>
          </div>

          {/* Active Since */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#FF9519] to-[#E6850F] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Active Since</p>
                <p className="text-sm font-bold text-gray-900">
                  {stats.activeSince ? formatDate(stats.activeSince) : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Formats Used */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Formats Used</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {stats.formatsUsed.length > 0 ? (
                    stats.formatsUsed.map((format, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md"
                      >
                        {format}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">None</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none">
                <path d="M8 12L8 4M8 4L5 7M8 4L11 7M2 2L14 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Upload Your First Hash
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
    <div className="flex flex-col gap-4 md:gap-6">
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
    const fileHash = latestUpdate ? latestUpdate.fileHash : certificate?.fileHash;
    return fileHash || "default-hash";
  }, [certificateDetails, certificate]);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group">
        <div className="flex flex-col lg:flex-row">
          {/* Image Preview */}
          <div className="w-full lg:w-64 h-48 lg:h-auto bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
            <img
              src={generateCertificateAvatar(certificate?.description || "default-certificate", 200)}
              alt="Certificate avatar"
              className="w-32 h-32 lg:w-40 lg:h-40 object-contain group-hover:scale-105 transition-transform duration-300 rounded-xl"
            />
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6">
            {/* Header Section */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-2 font-medium">
                    Updated on {formatDate(lastUpdatedTimestamp)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                    {certificate.description}
                  </h3>
                </div>
                <div className="ml-4 flex items-center gap-3">
                  <Link
                    to={`/certificate-details/${certificate.certificateId}`}
                    state={{ certificateId: certificate.certificateId }}
                    className="group/view bg-gradient-to-r from-[#5865F2] to-[#4752C4] hover:from-[#4752C4] hover:to-[#3B4BB8] text-white px-3 py-2 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <svg className="w-4 h-4 group-hover/view:scale-110 transition-transform duration-200" viewBox="0 0 16 16" fill="none">
                      <path d="M1 3C1 1.89543 1.89543 1 3 1H13C14.1046 1 15 1.89543 15 3V13C15 14.1046 14.1046 15 13 15H3C1.89543 15 1 14.1046 1 13V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5 7L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>View</span>
                  </Link>
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500 font-medium">Active</span>
                </div>
              </div>
              
              {/* Hash ID */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-[#5865F2] mb-2 uppercase tracking-wide">
                  Hash ID
                </div>
                <div className="text-sm text-gray-700 font-mono bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 break-all">
                  {latestFileHash?.slice(0, 24) || "N/A"}...
                </div>
              </div>
            </div>

            {/* Ownership Rights */}
            <div className="mb-6">
              <div className="text-xs font-semibold text-[#5865F2] mb-3 uppercase tracking-wide">
                Ownership Rights
              </div>
              <div className="flex gap-2 flex-wrap">
                {certificate.owners.map((owner: CertificateOwner, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#5865F2]/10 to-[#5865F2]/5 border border-[#5865F2]/20 rounded-xl"
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-[#5865F2] to-[#4752C4] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {owner.walletAddress.charAt(2).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-gray-700 text-sm font-medium">
                      {owner.walletAddress.slice(0, 6)}...{owner.walletAddress.slice(-4)}
                    </span>
                    <span className="text-[#5865F2] text-sm font-bold bg-white px-2 py-1 rounded-lg">
                      {owner.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Update Button */}
              <Link
                to="/update-certificate"
                state={{ certificateId: certificate.certificateId }}
                className="group/btn bg-gradient-to-r from-[#FF9519] to-[#E6850F] hover:from-[#E6850F] hover:to-[#D17A0E] text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" viewBox="0 0 16 16" fill="none">
                  <path d="M4 12L12 4M5.5 4H12V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Update</span>
              </Link>

              {/* Verify Button */}
              <Link
                to="/verify-certificate"
                state={{ 
                  certificateId: certificate.certificateId,
                  originalHash: certificate.fileHash,
                  description: certificate.description
                }}
                className="group/btn bg-transparent border-2 border-[#FF9519] hover:bg-[#FF9519]/10 text-[#FF9519] hover:text-[#FF9519] px-4 py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" viewBox="0 0 16 16" fill="none">
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Verify</span>
              </Link>

              {/* Version History Button */}
              <button
                onClick={() => setShowVersionHistory(true)}
                className="group/btn bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 px-4 py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm0-1A7 7 0 1 1 8 1a7 7 0 0 1 0 14z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>History</span>
              </button>
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

