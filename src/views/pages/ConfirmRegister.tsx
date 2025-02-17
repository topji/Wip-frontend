import logo from "/World_IP_logo.svg";
import { useUser } from "@/context/UserContext";
import { useShare } from "@/context/ShareContext";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { createCertificate } from "@/services/api/certificateServices";
import { useSessionStorage } from "@/hooks/useSessionStorage";

const ConfirmRegister = () => {
  const { user } = useUser();
  const { shares, setShares } = useShare();
  const navigate = useNavigate();
  const { storedValue: hash } = useSessionStorage("hash", "");
  const fileFormat = sessionStorage.getItem("fileFormat") || "txt";
  const description =
    sessionStorage.getItem("description") || "Copyright registration";

  useEffect(() => {
    // Recover shares from sessionStorage if context is empty
    if (shares.length === 0) {
      const storedShares = sessionStorage.getItem("shares");
      if (storedShares) {
        setShares(JSON.parse(storedShares));
      } else if (!user) {
        navigate("/set-ownership");
        return;
      }
    }

    const createCertificateCall = async () => {
      try {
        if (shares.length === 0) {
          console.error("No shares available");
          navigate("/set-ownership");
          return;
        }

        const payload = {
          fileHash: hash,
          metadataURI: "NA",
          description: description,
          fileFormat: fileFormat,
          owners: shares.map((share) => ({
            walletAddress: share.address,
            percentage: share.percentage,
          })),
        };
        const certificate = await createCertificate(payload);
        if (certificate.success) {
          // Clear stored shares after successful creation
          sessionStorage.removeItem("shares");
          navigate("/creation-success");
        }
      } catch (error) {
        console.error(error);
      }
    };

    createCertificateCall();
  }, [user, shares, hash, fileFormat, navigate, setShares]);

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
