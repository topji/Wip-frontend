import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import { generateCertificateAvatar } from "@/utils/dicebear";
import { useGetCertificateDetails } from "@/hooks/api-interaction/useGetCertificateDetails";
import { useGetCertificateIds } from "@/hooks/api-interaction/useGetCertificateIds";
import { useUser } from "@/context/UserContext";
import { CertificateOwner } from "@/hooks/api-interaction/useGetCertificateIds";
import logo from "/World_IP_logo.svg";

// Helper function to safely format dates
const formatDate = (timestamp: number | string | undefined): string => {
  if (!timestamp) return "Unknown date";
  
  try {
    const numericTimestamp = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
    
    if (isNaN(numericTimestamp)) return "Invalid date";
    
    const date = new Date(numericTimestamp * 1000);
    if (isNaN(date.getTime())) return "Invalid date";
    
    return format(date, "dd/MM/yyyy | HH:mm");
  } catch (error) {
    return "Invalid date";
  }
};

// Helper function to get the last updated timestamp
const getLastUpdatedTimestamp = (certificate: any): number => {
  // Always return the original creation timestamp for consistent sorting
  return certificate.timestamp || 0;
};

const CertificateDetails = () => {
  const { user } = useUser();
  const { id } = useParams();
  const certificateId = parseInt(id || "0", 10);

  // Get all certificates to find the current one
  const { data: certificatesData, isLoading: loadingCertificates } = useGetCertificateIds(user?.publicAddress ?? "");
  
  // Get detailed certificate information
  const { data: certificateDetails, isLoading: loadingDetails } = useGetCertificateDetails(
    certificateId.toString()
  );

  // Find the current certificate from the list
  const certificate = useMemo(() => {
    if (!certificatesData?.data) return null;
    return certificatesData.data.find((cert: any) => cert.certificateId === certificateId);
  }, [certificatesData, certificateId]);

  // Get the last updated timestamp
  const lastUpdatedTimestamp = useMemo(() => {
    if (!certificate) return 0;
    return getLastUpdatedTimestamp(certificate);
  }, [certificate]);

  // Get the latest fileHash (most recent update or original if no updates)
  const latestFileHash = useMemo(() => {
    if (!certificateDetails?.data) return certificate?.fileHash || "N/A";
    const updates = certificateDetails.data.updates || [];
    const latestUpdate = updates.length > 0 ? updates[updates.length - 1] : null;
    return latestUpdate ? latestUpdate.fileHash : certificate?.fileHash || "N/A";
  }, [certificateDetails, certificate]);

  // Download certificate function
  const handleDownload = () => {
    if (!certificate) return;
    
    // Create a downloadable certificate data
    const certificateData = {
      certificateId: certificate.certificateId,
      description: certificate.description,
      fileHash: latestFileHash,
      fileFormat: certificate.fileFormat,
      timestamp: certificate.timestamp,
      owners: certificate.owners,
      createdAt: certificateDetails?.data?.createdAt,
      updatedAt: certificateDetails?.data?.updatedAt,
      updates: certificateDetails?.data?.updates || []
    };

    const dataStr = JSON.stringify(certificateData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `certificate-${certificate.certificateId}-${certificate.description.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle version history button click
  const handleVersionHistory = () => {
    // For now, just scroll to the version history section
    // In the future, this could open a modal or navigate to a dedicated page
    const versionHistorySection = document.getElementById('version-history');
    if (versionHistorySection) {
      versionHistorySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loadingCertificates || loadingDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5865F2] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading certificate details...</p>
        </div>
      </div>
    );
  }

  if (!certificate || !certificateDetails?.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Certificate Not Found</h2>
          <p className="text-gray-600 mb-6">The requested certificate could not be found.</p>
          <Link
            to="/dashboard"
            className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={logo} alt="WorldIP Logo" className="h-8" />
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-gray-900">Certificate Details</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Certificate Header Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Certificate Image */}
            <div className="w-full lg:w-80 h-64 lg:h-auto bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex-shrink-0">
              <img
                src={generateCertificateAvatar(certificate.description || "default-certificate", 400)}
                alt="Certificate avatar"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Certificate Info */}
            <div className="flex-1 p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-500 font-medium">Active Certificate</span>
                    <span className="text-sm text-[#5865F2] font-semibold">#{certificate.certificateId}</span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    {certificate.description}
                  </h1>
                  <div className="text-sm text-gray-500 mb-2">
                    Created on {formatDate(certificate.timestamp)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Last updated on {formatDate(lastUpdatedTimestamp)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Update Button */}
                <Link
                  to="/update-certificate"
                  state={{ certificateId: certificate.certificateId }}
                  className="group bg-white border border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-700 hover:text-blue-700 px-4 py-3 rounded-lg flex flex-col items-center gap-2 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5 group-hover:scale-105 transition-transform duration-200" viewBox="0 0 20 20" fill="none">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
                  className="group bg-white border border-gray-200 hover:border-green-500 hover:bg-green-50 text-gray-700 hover:text-green-700 px-4 py-3 rounded-lg flex flex-col items-center gap-2 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5 group-hover:scale-105 transition-transform duration-200" viewBox="0 0 20 20" fill="none">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Verify</span>
                </Link>

                {/* Version History Button */}
                <button
                  onClick={handleVersionHistory}
                  className="group bg-white border border-gray-200 hover:border-purple-500 hover:bg-purple-50 text-gray-700 hover:text-purple-700 px-4 py-3 rounded-lg flex flex-col items-center gap-2 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5 group-hover:scale-105 transition-transform duration-200" viewBox="0 0 20 20" fill="none">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>History</span>
                </button>

                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  className="group bg-white border border-gray-200 hover:border-orange-500 hover:bg-orange-50 text-gray-700 hover:text-orange-700 px-4 py-3 rounded-lg flex flex-col items-center gap-2 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5 group-hover:scale-105 transition-transform duration-200" viewBox="0 0 20 20" fill="none">
                    <path d="M3 17v3a1 1 0 001 1h12a1 1 0 001-1v-3M8 12l4 4 4-4M12 16V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hash Information */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-[#5865F2]" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L8 15M1 8L15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Hash Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-[#5865F2] mb-2 block">Current Hash</label>
                <div className="text-sm text-gray-700 font-mono bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 break-all">
                  {latestFileHash}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-[#5865F2] mb-2 block">Original Hash</label>
                <div className="text-sm text-gray-700 font-mono bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 break-all">
                  {certificate.fileHash}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-[#5865F2] mb-2 block">File Format</label>
                <div className="text-sm text-gray-700 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                  {certificate.fileFormat}
                </div>
              </div>
            </div>
          </div>

          {/* Ownership Information */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-[#5865F2]" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L8 15M1 8L15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Ownership Rights
            </h3>
            <div className="space-y-3">
              {certificate.owners.map((owner: CertificateOwner, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-[#5865F2]/10 to-[#5865F2]/5 border border-[#5865F2]/20 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#5865F2] to-[#4752C4] rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {owner.walletAddress.charAt(2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {owner.walletAddress.slice(0, 8)}...{owner.walletAddress.slice(-6)}
                      </div>
                      <div className="text-xs text-gray-500 font-mono">
                        {owner.walletAddress}
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-[#5865F2] bg-white px-3 py-1 rounded-lg">
                    {owner.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Version History Section */}
        {certificateDetails.data.updates && certificateDetails.data.updates.length > 0 && (
          <div id="version-history" className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-[#5865F2]" viewBox="0 0 16 16" fill="none">
                <path d="M8 4V2M8 14V12M12 8H14M2 8H4M13.5 13.5L12 12M4 4L5.5 5.5M4 13.5L5.5 12M13.5 4L12 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Recent Updates
            </h3>
            <div className="space-y-4">
              {certificateDetails.data.updates.slice(-3).map((update: any, index: number) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      Update #{certificateDetails.data.updates.length - index}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      {update.fileHash.slice(0, 20)}...
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(update.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateDetails;
