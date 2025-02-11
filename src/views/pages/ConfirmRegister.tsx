import logo from "/World_IP_logo.svg";
import { useUser } from "@/context/UserContext";
import { useShare } from "@/context/ShareContext";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { createCertificate } from "@/services/api/certificateServices";
import { useSessionStorage } from "@/hooks/useSessionStorage";

const ConfirmRegister = () => {
  const { user } = useUser();
  const { shares } = useShare();
  const navigate = useNavigate();
  const { storedValue: hash } = useSessionStorage("hash", "");
  useEffect(() => {
    const createCertificateCall = async () => {
      try {
        const payload = {
          fileHash: hash,
          metadataURI: "NA",
          userAddress: user?.publicAddress ?? "",
        };
        const certificate = await createCertificate(payload);
        if (certificate.success) {
          navigate("/register-success");
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (!user || !shares) {
      navigate("/register-owner");
    }
    createCertificateCall();
  }, [user, shares]);

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
