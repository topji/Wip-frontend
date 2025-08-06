import { useState } from "react";
import logo from "/World_IP_logo.svg";
import { useRef } from "react";
import { TextArea } from "@/components/TextArea/TextArea";
import { useGenerateHash } from "@/hooks/useGenerateHash";
import loader from "@/assets/loader.svg";
import { useNavigate, useLocation } from "react-router";
import WalletButton from "@/components/wallet/WalletButton";
import copyRightIllustration from "@/assets/illustrations/copyRightIllus.png";

const VerifyCertificate = () => {
  const [fileType, setFileType] = useState<"file" | "text">("file");
  const [text, setText] = useState("");
  const generateHash = useGenerateHash();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { originalHash, certificateId } = location.state;

  const handleVerify = async () => {
    if (fileType === "text") {
      setProcessing(true);
      const hash = await generateHash({ type: "text", content: text });
      verifyHash(hash);
      setProcessing(false);
    } else {
      if (!fileInputRef.current) return;
      fileInputRef.current.click();
    }
  };

  const verifyHash = (generatedHash: string) => {
    if (generatedHash === originalHash) {
      navigate("/verification-success");
    } else {
      alert("Verification unsuccessful. The file has been modified or is different from the original.");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessing(true);
    const hash = await generateHash({ type: "file", content: file });
    verifyHash(hash);
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
          {/* Certificate Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-[#FF9519] to-[#5865F2] rounded-full flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Certificate to Verify</h2>
                <p className="text-sm text-gray-500">Certificate #{certificateId}</p>
              </div>
            </div>

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
                  <label className="text-xs font-medium text-[#FF9519] mb-1 block">Original Hash</label>
                  <p className="text-xs text-gray-600 font-mono bg-gray-50 px-3 py-2 rounded-md break-all">
                    {originalHash}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#FF9519] mb-1 block">Verification Status</label>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <span className="text-sm text-gray-700">Pending verification</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#FF9519] mb-1 block">Instructions</label>
                  <p className="text-sm text-gray-700 bg-blue-50 px-3 py-2 rounded-md">
                    Upload the original file or enter the original text to verify this certificate's authenticity.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-[#5865F2] to-[#FF9519] rounded-full flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Verify Certificate</h2>
                <p className="text-sm text-gray-500">Upload original content to verify authenticity</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Upload Type Selection */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Verification Method</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div 
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      fileType === "file" 
                        ? "border-[#FF9519] bg-orange-50" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setFileType("file")}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        fileType === "file" ? "border-[#FF9519] bg-[#FF9519]" : "border-gray-300"
                      }`}>
                        {fileType === "file" && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">File Upload</div>
                        <div className="text-xs text-gray-500">Upload original file</div>
                      </div>
                    </div>
                  </div>

                  <div 
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      fileType === "text" 
                        ? "border-[#FF9519] bg-orange-50" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setFileType("text")}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        fileType === "text" ? "border-[#FF9519] bg-[#FF9519]" : "border-gray-300"
                      }`}>
                        {fileType === "text" && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Text Input</div>
                        <div className="text-xs text-gray-500">Enter original text</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Input */}
              {fileType === "text" && (
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">
                    Original Text Content
                  </label>
                  <TextArea 
                    value={text} 
                    onChange={setText}
                    placeholder="Enter the original text content to verify..."
                    className="w-full"
                  />
                </div>
              )}

              {fileType === "file" && (
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-2 block">
                    Original File
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#FF9519] transition-colors cursor-pointer"
                       onClick={() => fileInputRef.current?.click()}>
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                      <path d="M7 16A4 4 0 0 1 3 12A4 4 0 0 1 7 8A4 4 0 0 1 11 12A4 4 0 0 1 7 16M7 8A4 4 0 0 0 3 12A4 4 0 0 0 7 16A4 4 0 0 0 11 12A4 4 0 0 0 7 8M7 8A4 4 0 0 1 11 12A4 4 0 0 1 7 16A4 4 0 0 1 3 12A4 4 0 0 1 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <p className="text-sm text-gray-600">Click to select the original file</p>
                    <p className="text-xs text-gray-500 mt-1">Must be the exact same file</p>
                  </div>
                  <input
                    className="hidden"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </div>
              )}

              {/* Verification Button */}
              <button
                onClick={handleVerify}
                disabled={processing || (!text && fileType === "text")}
                className="w-full bg-gradient-to-r from-[#FF9519] to-[#E6850F] disabled:opacity-50 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <span className="animate-spin text-white">
                      <img src={loader} alt="loading..." />
                    </span>
                    Verifying Certificate...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Verify Certificate
                  </>
                )}
              </button>

              {/* Verification Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-1">How verification works</h4>
                    <p className="text-xs text-blue-700">
                      We'll generate a hash from your uploaded content and compare it with the original hash. 
                      If they match, your certificate is authentic and unmodified.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificate;
