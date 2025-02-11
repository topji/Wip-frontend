import logo from "/World_IP_logo.svg";
import { useRef, useState } from "react";
import { TextArea } from "@/components/TextArea/TextArea";
import { useGenerateHash } from "@/hooks/useGenerateHash";
import loader from "@/assets/loader.svg";
import { useNavigate } from "react-router";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import WalletButton from "@/components/wallet/WalletButton";

const RegisterIP = () => {
  const [fileType, setFileType] = useState<"file" | "text">("file");
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  const generateHash = useGenerateHash();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const { setValue: setHash } = useSessionStorage("hash", "");

  const handleOnSuccess = (hash: string) => {
    sessionStorage.setItem("description", description);
    setHash(hash);
    navigate("/set-ownership");
  };

  const handleUpload = async () => {
    if (fileType === "text") {
      setProcessing(true);
      const hash = await generateHash({ type: "text", content: text });
      console.log(hash);
      sessionStorage.setItem("description", description);
      handleOnSuccess(hash);
      setProcessing(false);
    } else {
      if (!fileInputRef.current) return;
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessing(true);
    const hash = await generateHash({ type: "file", content: file });
    const fileFormat = file.name.split(".").pop() || "";
    setHash(hash);
    sessionStorage.setItem("fileFormat", `.${fileFormat}`);
    sessionStorage.setItem("description", description);
    navigate("/set-ownership");
    setProcessing(false);
  };

  return (
    <main className="flex gap-8 grow">
      <div className="flex flex-col gap-8 items-center justify-center grow">
        <div className="self-start px-16 pb-8 pt-12">
          <img src={logo} alt="logo" />
        </div>
        <h1 className="text-6xl font-medium w-[18ch]">
          Drop your <span className="text-orange-400">Masterpiece </span>
          <span className="text-blue-500">here</span>
        </h1>
        <div className="relative">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source
              src="https://worldip.s3.us-east-1.amazonaws.com/hero-asset.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </div>
      <div className="bg-[#F8F8F8] p-12 w-[47%] flex flex-col items-start gap-8 justify-center">
        <div className="self-end">
          <WalletButton />
        </div>
        <div className="flex flex-col gap-6 space-y-4 grow justify-center">
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
            placeholder="Enter description of your work"
            className="mb-4"
          />

          {fileType === "text" && (
            <div className="flex flex-col gap-2">
              <TextArea value={text} onChange={setText} />
              <span className="text-sm text-[#4F4B5C] font-semibold flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 5V8.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle cx="8" cy="11" r="1" fill="currentColor" />
                </svg>
                Upload any text
              </span>
            </div>
          )}
          {fileType === "file" && (
            <input
              className="hidden"
              type="file"
              id="file"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          )}

          <button
            onClick={handleUpload}
            className="bg-[#FF9519] disabled:opacity-70 text-white px-6 py-3 rounded-full flex items-center gap-2 w-fit"
            disabled={processing}
          >
            {processing ? (
              <span className="animate-spin text-white">
                <img src={loader} alt="loading..." />
              </span>
            ) : (
              <>
                Upload
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

export default RegisterIP;
