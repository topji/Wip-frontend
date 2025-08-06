import { useState, useEffect } from "react";
import logo from "/World_IP_logo.svg";
import { useRef } from "react";
import { TextArea } from "@/components/TextArea/TextArea";
import { useGenerateHash } from "@/hooks/useGenerateHash";
import loader from "@/assets/loader.svg";
import { useNavigate, useLocation } from "react-router";
import WalletButton from "@/components/wallet/WalletButton";
import { useUpdateCertificate } from "@/hooks/api-interaction/useUpdateCertificate";
import { useGetCertificateDetails } from "@/hooks/api-interaction/useGetCertificateDetails";
import { format } from "date-fns";
import copyRightIllustration from "@/assets/illustrations/copyRightIllus.png";

const UpdateCertificate = () => {
  const [fileType, setFileType] = useState<"file" | "text">("file");
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  const generateHash = useGenerateHash();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const certificateId = location.state?.certificateId;

  const updateCertificateMutation = useUpdateCertificate();
  
  // Get current certificate details
  const { data: certificateDetails, isLoading: loadingCertificate } = useGetCertificateDetails(
    certificateId?.toString() || ""
  );

  const handleUpload = async () => {
    if (fileType === "text") {
      setProcessing(true);
      const hash = await generateHash({ type: "text", content: text });
      handleUpdateCertificate(hash);
      setProcessing(false);
    } else {
      if (!fileInputRef.current) return;
      fileInputRef.current.click();
    }
  };

  const handleUpdateCertificate = async (hash: string) => {
    if (!certificateId) return;
    
    try {
      await updateCertificateMutation.mutateAsync({
        certificateId: certificateId,
        updatedFileHash: hash,
        updatedMetadataURI: `ipfs://${hash}/metadata.json`,
        updatedDescription: description,
      });
      navigate("/update-success");
    } catch (error) {
      console.error("Failed to update certificate:", error);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessing(true);
    const hash = await generateHash({ type: "file", content: file });
    await handleUpdateCertificate(hash);
    setProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <img src={logo} alt="logo" className="h-8" />
            <WalletButton />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Certificate Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-[#5865F2] to-[#FF9519] rounded-full flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Current Certificate</h2>
                <p className="text-sm text-gray-500">Certificate #{certificateId}</p>
              </div>
            </div>

            {loadingCertificate ? (
              <div className="flex items-center justify-center py-12">
                <span className="animate-spin text-[#5865F2]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3V6M12 18V21M6 12H3M21 12H18M5.63672 5.63672L7.75977 7.75977M16.2422 16.2422L18.3633 18.3633M18.3652 5.63477L16.2441 7.75586M7.75781 16.2422L5.63477 18.3652" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            ) : certificateDetails?.data ? (
              <div className="space-y-4">
                {/* Certificate Image */}
                <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img
                    src={copyRightIllustration}
                    alt="Certificate preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Certificate Details */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-[#5865F2] mb-1 block">Description</label>
                    <p className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-md">
                      {certificateDetails.data.description}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#5865F2] mb-1 block">Current Hash</label>
                    <p className="text-xs text-gray-600 font-mono bg-gray-50 px-3 py-2 rounded-md break-all">
                      {certificateDetails.data.fileHash}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#5865F2] mb-1 block">Created</label>
                    <p className="text-sm text-gray-700">
                      {format(new Date(certificateDetails.data.createdAt), "dd/MM/yyyy | HH:mm")}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#5865F2] mb-1 block">File Format</label>
                    <p className="text-sm text-gray-700">
                      {certificateDetails.data.fileFormat}
                    </p>
                  </div>

                  {/* Updates History */}
                  {certificateDetails.data.updates && certificateDetails.data.updates.length > 0 && (
                    <div>
                      <label className="text-xs font-medium text-[#5865F2] mb-2 block">Update History</label>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {certificateDetails.data.updates.slice(-3).map((update, index) => (
                          <div key={index} className="bg-gray-50 px-3 py-2 rounded-md">
                            <div className="flex justify-between items-start">
                              <p className="text-xs text-gray-700 line-clamp-2">{update.description}</p>
                              <span className="text-xs text-gray-500 ml-2">
                                {format(new Date(update.timestamp * 1000), "dd/MM/yyyy")}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Certificate details not available
              </div>
            )}
          </div>

          {/* Update Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-[#FF9519] to-[#5865F2] rounded-full flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M4 12L12 4M5.5 4H12V10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Update Certificate</h2>
                <p className="text-sm text-gray-500">Upload new content to update your certificate</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Upload Type Selection */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Upload Type</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div 
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      fileType === "file" 
                        ? "border-[#5865F2] bg-blue-50" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setFileType("file")}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        fileType === "file" ? "border-[#5865F2] bg-[#5865F2]" : "border-gray-300"
                      }`}>
                        {fileType === "file" && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">File Upload</div>
                        <div className="text-xs text-gray-500">PDF, Images, Audio, Video</div>
                      </div>
                    </div>
                  </div>

                  <div 
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      fileType === "text" 
                        ? "border-[#5865F2] bg-blue-50" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setFileType("text")}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        fileType === "text" ? "border-[#5865F2] bg-[#5865F2]" : "border-gray-300"
                      }`}>
                        {fileType === "text" && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Text Input</div>
                        <div className="text-xs text-gray-500">Direct text entry</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Input */}
              <div>
                <label className="text-sm font-medium text-gray-900 mb-2 block">
                  Update Description
                </label>
                <TextArea
                  value={description}
                  onChange={setDescription}
                  placeholder="Describe what you're updating in this certificate..."
                  className="w-full"
                />
              </div>

              {/* Content Input */}
              {fileType === "text" && (
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">
                    New Content
                  </label>
                  <TextArea 
                    value={text} 
                    onChange={setText}
                    placeholder="Enter your new text content here..."
                    className="w-full"
                  />
                </div>
              )}

              {fileType === "file" && (
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">
                    New File
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#5865F2] transition-colors cursor-pointer"
                       onClick={() => fileInputRef.current?.click()}>
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                      <path d="M7 16A4 4 0 0 1 3 12A4 4 0 0 1 7 8A4 4 0 0 1 11 12A4 4 0 0 1 7 16M7 8A4 4 0 0 0 3 12A4 4 0 0 0 7 16A4 4 0 0 0 11 12A4 4 0 0 0 7 8M7 8A4 4 0 0 1 11 12A4 4 0 0 1 7 16A4 4 0 0 1 3 12A4 4 0 0 1 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <p className="text-sm text-gray-600">Click to select a file</p>
                    <p className="text-xs text-gray-500 mt-1">Supports all file formats</p>
                  </div>
                  <input
                    className="hidden"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </div>
              )}

              {/* Update Button */}
              <button
                onClick={handleUpload}
                disabled={processing || (!text && fileType === "text") || !description}
                className="w-full bg-gradient-to-r from-[#5865F2] to-[#FF9519] disabled:opacity-50 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <span className="animate-spin text-white">
                      <img src={loader} alt="loading..." />
                    </span>
                    Updating Certificate...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M4 12L12 4M5.5 4H12V10.5"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Update Certificate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCertificate;
