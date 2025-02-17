import { useState } from "react";
import logo from "/World_IP_logo.svg";
import { useRef } from "react";
import { TextArea } from "@/components/TextArea/TextArea";
import { useGenerateHash } from "@/hooks/useGenerateHash";
import loader from "@/assets/loader.svg";
import { useNavigate, useLocation } from "react-router";
import WalletButton from "@/components/wallet/WalletButton";
import { useUpdateCertificate } from "@/hooks/api-interaction/useUpdateCertificate";

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
        certificateId,
        updatedFileHash: hash,
        updatedMetadataURI: "NA",
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
    <main className="flex gap-8 grow">
      <div className="flex flex-col gap-8 items-center justify-between grow">
        <div className="w-full flex items-center justify-between px-16 pb-8 pt-12">
          <img src={logo} alt="logo" />
          <WalletButton />
        </div>

        <div className="flex flex-col grow justify-center gap-6 space-y-4 w-full max-w-128">
          <h1 className="text-4xl font-medium">Update Your Certificate</h1>
          
          <div className="flex items-center max-w-128 gap-4 cursor-pointer">
            <div className="w-8 h-8 flex items-center justify-center">
              <input
                className="radio [--input-color:#7357FF] [--border:2px]"
                type="radio"
                name="file"
                id="file"
                checked={fileType === "file"}
                onChange={() => setFileType("file")}
              />
            </div>
            <div>
              <label htmlFor="file" className="text-lg font-medium">
                File
              </label>
              <p className="text-gray-500">
                Word/pdf/png/jpg/mp3/audio/video/text/image in all possible
                formats
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 cursor-pointer">
            <div className="w-8 h-8 flex items-center justify-center">
              <input
                className="radio [--input-color:#7357FF] [--border:2px]"
                type="radio"
                name="file"
                id="text"
                checked={fileType === "text"}
                onChange={() => setFileType("text")}
              />
            </div>
            <div>
              <label htmlFor="text" className="text-lg font-medium">
                Text
              </label>
              <p className="text-gray-500">Upload your Text</p>
            </div>
          </div>

          <TextArea
            value={description}
            onChange={setDescription}
            placeholder="Enter description of your update"
            className="mb-4"
          />

          {fileType === "text" && (
            <TextArea value={text} onChange={setText} />
          )}
          
          {fileType === "file" && (
            <input
              className="hidden"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          )}

          <button
            onClick={handleUpload}
            className="bg-[#5865F2] disabled:opacity-70 text-white px-6 py-3 rounded-full flex items-center gap-2 w-fit"
            disabled={processing}
          >
            {processing ? (
              <span className="animate-spin text-white">
                <img src={loader} alt="loading..." />
              </span>
            ) : (
              <>
                Update Certificate
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 12L12 4M5.5 4H12V10.5"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
};

export default UpdateCertificate;
