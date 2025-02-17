import { useState } from "react";
import logo from "/World_IP_logo.svg";
import { useRef } from "react";
import { TextArea } from "@/components/TextArea/TextArea";
import { useGenerateHash } from "@/hooks/useGenerateHash";
import loader from "@/assets/loader.svg";
import { useNavigate, useLocation } from "react-router";
import WalletButton from "@/components/wallet/WalletButton";

const VerifyCertificate = () => {
  const [fileType, setFileType] = useState<"file" | "text">("file");
  const [text, setText] = useState("");
  const generateHash = useGenerateHash();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { certificateId, originalHash } = location.state;

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
    <main className="flex gap-8 grow">
      <div className="flex flex-col gap-8 items-center justify-between grow">
        <div className="w-full flex items-center justify-between px-16 pb-8 pt-12">
          <img src={logo} alt="logo" />
          <WalletButton />
        </div>

        <div className="flex flex-col grow justify-center gap-6 space-y-4 w-full max-w-128">
          <h1 className="text-4xl font-medium">Verify Your Certificate</h1>
          
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
                Upload the original file to verify
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
              <p className="text-gray-500">Enter the original text to verify</p>
            </div>
          </div>

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
            onClick={handleVerify}
            className="bg-[#FF9519] disabled:opacity-70 text-white px-6 py-3 rounded-full flex items-center gap-2 w-fit"
            disabled={processing}
          >
            {processing ? (
              <span className="animate-spin text-white">
                <img src={loader} alt="loading..." />
              </span>
            ) : (
              <>
                Verify Certificate
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

export default VerifyCertificate;
